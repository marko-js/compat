import type { FixtureConfig } from "../../../main.test";

export default {
  steps: [(screen) => screen.getByRole("button").click()],
} satisfies FixtureConfig;
