import { types as t } from "@marko/compiler";
import { parseExpression } from "@marko/babel-utils";

const enum CODE {
  ASTERISK = 42,
  BACK_SLASH = 92,
  BACKTICK = 96,
  CARRIAGE_RETURN = 13,
  CLOSE_CURLY_BRACE = 125,
  CLOSE_PAREN = 41,
  CLOSE_SQUARE_BRACKET = 93,
  DOLLAR_SIGN = 36,
  DOUBLE_QUOTE = 34,
  FORWARD_SLASH = 47,
  NEW_LINE = 10,
  OPEN_CURLY_BRACE = 123,
  OPEN_PAREN = 40,
  OPEN_SQUARE_BRACKET = 91,
  SINGLE_QUOTE = 39,
}

export function parseNonStandardTemplateLiteral(
  string: t.NodePath<t.StringLiteral>,
) {
  const { file } = string.hub;
  const { extra } = string.node;
  let value = extra?.raw as string | undefined;
  if (typeof value !== "string") return;
  value = value.slice(1, -1);
  const { length } = value;
  const valueStart = string.node.start == null ? null : string.node.start + 1;
  let elements: undefined | t.TemplateElement[];
  let expressions: undefined | t.Expression[];
  let lastEndBracket = 0;

  for (let i = 0; i < length; i++) {
    switch (value.charCodeAt(i)) {
      case CODE.BACK_SLASH:
        i++;
        break;
      case CODE.DOLLAR_SIGN:
        if (value.charCodeAt(i + 1) === CODE.OPEN_CURLY_BRACE) {
          const bracketStart = i + 2;
          const bracketEnd = skipBracketed(
            value,
            bracketStart,
            length,
            CODE.CLOSE_CURLY_BRACE,
          );
          if (bracketEnd === -1) return;
          const el = t.templateElement(
            { raw: value.slice(lastEndBracket, i) },
            false,
          );

          i = bracketEnd - 1;
          lastEndBracket = bracketEnd;
          const expr =
            valueStart != null
              ? parseExpression(
                  file,
                  value.slice(bracketStart, i),
                  valueStart + bracketStart,
                  valueStart + i,
                )
              : parseExpression(file, value.slice(bracketStart, i));

          if (elements) {
            elements.push(el);
            expressions!.push(expr);
          } else {
            elements = [el];
            expressions = [expr];
          }
        }
        break;
    }
  }

  if (elements) {
    elements.push(
      t.templateElement({ raw: value.slice(lastEndBracket) }, true),
    );
    return t.templateLiteral(elements, expressions!);
  }
}

function skipBracketed(str: string, start: number, end: number, close: number) {
  let i = start;
  while (i < end) {
    const code = str.charCodeAt(i);
    switch (code) {
      case close:
        return i + 1;
      case CODE.DOUBLE_QUOTE:
      case CODE.SINGLE_QUOTE:
        i = skipString(str, i + 1, end, code);
        if (i === -1) return -1;
        break;
      case CODE.BACKTICK:
        i = skipTemplateString(str, i + 1, end);
        if (i === -1) return -1;
        break;
      case CODE.FORWARD_SLASH:
        // Check next character to see if we are in a comment or regexp
        switch (str.charCodeAt(i + 1)) {
          case CODE.FORWARD_SLASH:
            i = skipLineComment(str, i + 2, end);
            if (i === -1) return -1;
            break;
          case CODE.ASTERISK:
            i = skipBlockComment(str, i + 2, end);
            if (i === -1) return -1;
            break;
          default:
            i++;
            break;
        }
        break;
      case CODE.OPEN_PAREN:
        i = skipBracketed(str, i + 1, end, CODE.CLOSE_PAREN);
        if (i === -1) return -1;
        break;
      case CODE.OPEN_SQUARE_BRACKET:
        i = skipBracketed(str, i + 1, end, CODE.CLOSE_SQUARE_BRACKET);
        if (i === -1) return -1;
        break;
      case CODE.OPEN_CURLY_BRACE:
        i = skipBracketed(str, i + 1, end, CODE.CLOSE_CURLY_BRACE);
        if (i === -1) return -1;
        break;

      default:
        i++;
    }
  }

  return -1;
}

function skipString(str: string, start: number, end: number, quote: number) {
  let i = start;
  while (i < end) {
    switch (str.charCodeAt(i)) {
      case quote:
        return i + 1;
      case CODE.BACK_SLASH:
        i += 2;
        break;
      default:
        i++;
        break;
    }
  }

  return -1;
}

function skipTemplateString(str: string, start: number, end: number) {
  let i = start;
  while (i < end) {
    switch (str.charCodeAt(i)) {
      case CODE.BACKTICK:
        return i + 1;
      case CODE.BACK_SLASH:
        i += 2;
        break;
      case CODE.DOLLAR_SIGN:
        if (str.charCodeAt(i + 1) === CODE.OPEN_CURLY_BRACE) {
          i = skipBracketed(str, i + 2, end, CODE.CLOSE_CURLY_BRACE);
          if (i === -1) return -1;
        } else {
          i++;
        }
        break;
      default:
        i++;
        break;
    }
  }

  return -1;
}

function skipLineComment(str: string, start: number, end: number) {
  let i = start;
  while (i < end) {
    switch (str.charCodeAt(i)) {
      case CODE.NEW_LINE:
        return i + 1;
      case CODE.CARRIAGE_RETURN:
        return i + (str.charCodeAt(i + 1) === CODE.NEW_LINE ? 2 : 1);
      default:
        i++;
        break;
    }
  }

  return -1;
}

function skipBlockComment(str: string, start: number, end: number) {
  let i = start;
  while (i < end) {
    if (str.charCodeAt(i) === CODE.ASTERISK) {
      if (str.charCodeAt(i + 1) === CODE.FORWARD_SLASH) {
        return i + 2;
      }

      i += 2;
    } else {
      i++;
    }
  }

  return -1;
}
