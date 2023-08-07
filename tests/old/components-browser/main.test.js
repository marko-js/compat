"use strict";

var path = require("path");
var autotest = require("mocha-autotest").default;
var compiler = require("@marko/compiler");
var register = require("@marko/compiler/register");
var tempFS = require("../../utils/temp-fs");
var createBrowser = require("../../utils/create-browser").default;
var browserHelpersPath = require.resolve("../utils/browser-helpers");
var ssrTemplate = require("./template.marko");

var baseConfig = {
  babelConfig: {
    babelrc: false,
    configFile: false,
  },
  writeVersionComment: false,
  resolveVirtualDependency(filename, { code, virtualPath }) {
    tempFS.writeTempFile(path.resolve(filename, "..", virtualPath), code);
    return virtualPath;
  },
};

var domConfig = { ...baseConfig, output: "dom" };
var hydrateConfig = {
  ...baseConfig,
  output: "hydrate",
  modules: "cjs",
};
var browser = createBrowser({
  dir: __dirname,
  html: `<div id="testsTarget"></div><div></div>`,
  extensions: register({
    ...domConfig,
    extensions: {},
  }),
});

initBrowser(browser);
var BrowserHelpers = browser.require(browserHelpersPath);

describe("old components-browser", () => {
  autotest("fixtures", {
    client: runClientTest,
    hydrate: runHydrateTest,
  });
});

function runClientTest(fixture) {
  let test = fixture.test;
  let resolve = fixture.resolve;
  let context = fixture.context || (fixture.context = {});
  test((done) => {
    let helpers = new BrowserHelpers();
    let testFile = resolve("test.js");
    let testFunc = browser.require(testFile);
    let hasCallback = testFunc.length > 1;

    try {
      if (hasCallback) {
        testFunc(helpers, cleanupAndFinish);
      } else {
        const result = testFunc(helpers);
        if (result && result.then) {
          result.then(cleanupAndFinish, cleanupAndFinish);
        } else {
          cleanupAndFinish();
        }
      }
    } catch (err) {
      cleanupAndFinish(err);
    }

    function cleanupAndFinish(err) {
      // Cache components for use in hydrate run.
      if (!err) context.rendered = helpers.rendered;
      helpers.instances.forEach((instance) => instance.destroy());
      helpers.targetEl.innerHTML = "";
      done(err);
    }
  });
}

function runHydrateTest(fixture) {
  let test = fixture.test;
  let resolve = fixture.resolve;
  let context = fixture.context;
  test((done) => {
    var components = context.rendered;
    if (!components)
      throw new Error("No components rendered by client version of test");
    var $global = components.reduce(
      ($g, c) => Object.assign($g, c.$global),
      {},
    );

    ssrTemplate
      .render({ components: components, $global: $global })
      .then(function (html) {
        var browser = createBrowser({
          html,
          dir: fixture.dir,
          extensions: register({
            ...domConfig,
            extensions: {},
          }),
        });

        var virtualSource = `import "${ssrTemplate.path}";\n`;
        for (const def of components) {
          virtualSource += `import "${def.template}";\n`;
        }

        var hydrateCode = `require=>{${
          compiler.compileSync(
            virtualSource,
            resolve("_hydrate_.marko"),
            hydrateConfig,
          ).code
        }}`;

        initBrowser(browser);

        (0, browser.window.eval)(hydrateCode)(browser.require);
        var testFile = resolve("test.js");
        var testFunc = browser.require(testFile);
        var BrowserHelpers = browser.require(browserHelpersPath);
        var helpers = new BrowserHelpers();
        var hasCallback = testFunc.length > 1;
        var curInstance = 0;

        helpers.isHydrate = true;
        helpers.mount = function () {
          return browser.window.getComponent(curInstance++);
        };

        if (hasCallback) {
          testFunc(helpers, done);
        } else {
          const result = testFunc(helpers);
          if (result && result.then) {
            result.then(done, done);
          } else {
            done();
          }
        }
      })
      .catch(done);
  });
}

function initBrowser(browser) {
  browser.window.Error = Error;
  browser.window.process = process;
  browser.window.$ = browser.window.jQuery = browser.require("jquery");
}
