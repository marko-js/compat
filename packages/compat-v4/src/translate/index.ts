import { types as t } from "@marko/compiler";
export default {
  Program: {
    exit(program) {
      if (program.hub.file.markoOpts.modules === "cjs") {
        program.pushContainer(
          "body",
          t.expressionStatement(
            t.assignmentExpression(
              "=",
              t.memberExpression(
                t.identifier("module"),
                t.identifier("exports"),
              ),
              t.callExpression(
                t.memberExpression(
                  t.identifier("Object"),
                  t.identifier("assign"),
                ),
                [
                  t.memberExpression(
                    t.identifier("exports"),
                    t.identifier("default"),
                  ),
                  t.identifier("exports"),
                ],
              ),
            ),
          ),
        );
      }
    },
  },
} satisfies t.Visitor;
