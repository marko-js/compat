import type { FixtureConfig } from "../../../main.test";

export default {
  input: {
    attrs: {
      "data-foo": "bar",
      "data-bar": "baz",
    },
  },
} satisfies FixtureConfig;
