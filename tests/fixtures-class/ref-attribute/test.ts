import type { FixtureConfig } from "../../main.test";

export default {
  steps: [
    (screen) => {
      screen.getByText("Click Me").click();
    },
  ],
} satisfies FixtureConfig;
