export interface Token<State> {
  pattern: RegExp;
  match?(state: State, start: number, end: number): void;
}

interface Match<State> {
  matchIndex: number;
  match: Exclude<Token<State>["match"], undefined>;
}

export class Tokenizer<State> {
  #regexp: RegExp;
  #matches: Match<State>[];
  constructor(tokens: Token<State>[]) {
    let src = "";
    let sep = "";
    this.#matches = [];

    for (let i = 0; i < tokens.length; i++) {
      const { pattern, match } = tokens[i];

      if (pattern.flags) {
        throw new Error("Tokenizer pattern must not have flags");
      }

      src += `${sep}(${pattern.source})`;
      sep = "|";

      if (match) {
        this.#matches.push({ matchIndex: i + 1, match });
      }
    }

    this.#regexp = new RegExp(src, "g");
  }

  tokenize(str: string, state: State): void {
    for (const match of str.matchAll(this.#regexp)) {
      for (const token of this.#matches) {
        const content = match[token.matchIndex];
        if (content !== undefined) {
          const index = match.index!;
          token.match(state, index, index + content.length);
          break;
        }
      }
    }
  }
}
