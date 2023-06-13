import type { FixtureConfig } from "../../main.test";

export default {
  skipCompileDOM: true,
  skipCompileHTML: true,
  skipRenderDOM: true,
  skipRenderHTML: true,
  migrations: [
    {
      "Non-standard template literals are deprecated.": {
        7: true,
      },
    },
    {
      "Non-standard template literals are deprecated.": {
        8: true,
      },
    },
  ],
} satisfies FixtureConfig;
