const fs = require("fs");
const path = require("path");
const register = require("@marko/compiler/register");
const autotest = require("mocha-autotest").default;
const expect = require("chai").expect;
const toDiffableHtml = require("diffable-html");
const createBrowser = require("../../utils/create-browser").default;
const tempFS = require("../../utils/temp-fs");
const domToString = require("../utils/vdom-to-html");
const browser = createBrowser({
  dir: __dirname,
  html: `<div id="testsTarget"></div><div></div>`,
  extensions: register({
    babelConfig: {
      babelrc: false,
      configFile: false,
    },
    writeVersionComment: false,
    resolveVirtualDependency(filename, { code, virtualPath }) {
      tempFS.writeTempFile(path.resolve(filename, "..", virtualPath), code);
      return virtualPath;
    },
    output: "dom",
    extensions: {},
  }),
});

initBrowser(browser);
describe("old render", () => {
  autotest("fixtures", {
    html: testRunner,
    vdom: testRunner,
    "html ≅ vdom": compareNormalized,
  });

  // autotest("fixtures-async-deprecated", {
  //   html: testRunner,
  // });
});

function testRunner(fixture) {
  fixture.test(() => runRenderTest(fixture));
}

function compareNormalized({ test, context }) {
  test(function () {
    if (!context.html || !context.vdom) {
      this.skip();
    } else {
      expect(context.html).to.equal(context.vdom);
    }
  });
}

async function runRenderTest(fixture) {
  let dir = fixture.dir;
  let output = fixture.mode || "html";
  let snapshot = fixture.snapshot;
  let isVDOM = output === "vdom";

  let templatePath = path.join(dir, "template.marko");
  let mainPath = path.join(dir, "test.js");
  let main = !fs.existsSync(mainPath)
    ? {}
    : isVDOM
      ? browser.require(mainPath)
      : require(mainPath);

  if (main.checkError) {
    let e;

    try {
      let template = isVDOM
        ? browser.require(templatePath)
        : require(templatePath);
      let templateData = Object.assign({}, main.templateData || {});
      await template.render(templateData);
    } catch (_e) {
      e = _e;
      let errorFile = path.join(dir, "error.txt");
      fs.writeFileSync(errorFile, e.stack.toString(), {
        encoding: "utf8",
      });
    }

    if (!e) {
      throw new Error("Error expected");
    }

    main.checkError(e);
    return;
  } else {
    let template = isVDOM
      ? browser.require(templatePath)
      : require(templatePath);
    let templateData = Object.assign({}, main.templateData || {});

    if (template.default) {
      template = template.default;
    }

    let html = "";
    let out = isVDOM
      ? template.createOut()
      : template.createOut(
          {},
          {
            write: (data) => (html += data),
            flush: () => {
              if (!main.noFlushComment) {
                html += "<!--FLUSH-->";
              }
            },
            end: () => {
              html = html.replace(/<!--FLUSH-->$/, "");
              out.emit("finish");
            },
          },
        );
    let asyncEventsVerifier = createAsyncVerifier(main, snapshot, out, isVDOM);

    await template.render(templateData, out).end();

    if (isVDOM) {
      let document = browser.window.document;
      let actualNode = document.createDocumentFragment();
      out.___getResult().replaceChildrenOf(actualNode);

      actualNode.normalize();
      let vdomString = domToString(actualNode, {
        childrenOnly: true,
      });

      snapshot(vdomString, {
        name: "vdom",
        ext: ".html",
      });

      fixture.context.vdom = normalizeHtml(actualNode);
    } else {
      if (main.checkHtml) {
        fs.writeFileSync(path.join(dir, "actual.html"), html, {
          encoding: "utf8",
        });
        main.checkHtml(html);
      } else {
        snapshot(html, {
          ext: ".html",
          format: toDiffableHtml,
        });
      }

      fixture.context.html = normalizeHtml(html);
    }

    asyncEventsVerifier.verify();
  }
}

function normalizeHtml(htmlOrNode) {
  let document = browser.window.document;

  if (typeof htmlOrNode === "string") {
    document.open();
    document.write(htmlOrNode);
    document.close();
  } else {
    document.documentElement.innerHTML = "";
    document.body.appendChild(htmlOrNode);
  }

  const treeWalker = document.createTreeWalker(document.body);
  const nodesToRemove = [];

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    if (
      node.nodeType === 8 ||
      isIgnoredTag(node) ||
      isClientReorderFragment(node)
    ) {
      nodesToRemove.push(node);
    }
    if (node.nodeType === 1) {
      if (node.tagName === "TEXTAREA") {
        node.textContent = node.value;
      }

      // sort attrs by name.
      Array.from(node.attributes)
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((attr) => {
          node.removeAttributeNode(attr);
          node.setAttributeNode(attr);
        });
    }
  }

  nodesToRemove.forEach((n) => n.remove());
  // eslint-disable-next-line no-self-assign
  document.body.innerHTML = document.body.innerHTML;
  document.body.normalize();

  return document.body.innerHTML.trim();
}

function isIgnoredTag(node) {
  switch (node.tagName) {
    case "LINK":
    case "TITLE":
    case "STYLE":
    case "SCRIPT":
      return true;
    default:
      return false;
  }
}

function isClientReorderFragment(node) {
  return /^af\d+$/.test(node.id);
}

function createAsyncVerifier(main, snapshot, out, isVDOM) {
  var events = [];
  var eventsByAwaitInstance = {};

  var addEventListener = function (event) {
    out.on(event, function (arg) {
      var name = arg.name;

      if (!eventsByAwaitInstance[name]) {
        eventsByAwaitInstance[name] = [];
      }

      eventsByAwaitInstance[name].push(event);

      events.push({
        event: event,
        arg: Object.assign({}, arg),
      });
    });
  };

  addEventListener("await:begin");
  addEventListener("await:beforeRender");
  addEventListener("await:finish");

  return {
    verify() {
      if (main.checkEvents && !isVDOM) {
        main.checkEvents(events, snapshot, out);
      }

      // Make sure all of the await instances were correctly ended
      Object.keys(eventsByAwaitInstance).forEach(function (name) {
        var events = eventsByAwaitInstance[name];
        expect(events).to.deep.equal([
          "await:begin",
          "await:beforeRender",
          "await:finish",
        ]);
      });
    },
  };
}

function initBrowser(browser) {
  browser.window.Error = Error;
  browser.window.process = process;
  browser.window.$ = browser.window.jQuery = browser.require("jquery");
}
