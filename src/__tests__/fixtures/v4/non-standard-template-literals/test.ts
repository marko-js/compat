import type { FixtureConfig } from "../../../main.test";

export default {
  migrations: [
    {
      "Non-standard template literals are deprecated.": {
        8: true,
      },
    },
    {
      "Non-standard template literals are deprecated.": {
        9: true,
      },
    },
  ],
} satisfies FixtureConfig;
