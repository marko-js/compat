import { Tokenizer } from "@marko/compat-utils";

export enum ForType {
  Init,
  In,
  From,
}

const enum PartType {
  Id,
  In,
  From,
  To,
  Step,
  Init,
  Test,
  Update,
  StatusVar,
  Separator,
  Iterator,
}

interface Range {
  start: number;
  end: number;
  value: string;
}
interface ForState {
  type: ForType | undefined;
  source: string;
  depth: number;
  hasPipe: boolean;
  partType: PartType | undefined;
  partStart: number;
  idPart: Range | undefined;
  inPart: Range | undefined;
  fromPart: Range | undefined;
  toPart: Range | undefined;
  stepPart: Range | undefined;
  initPart: Range | undefined;
  testPart: Range | undefined;
  updatePart: Range | undefined;
  statusVarPart: Range | undefined;
  separatorPart: Range | undefined;
  iteratorPart: Range | undefined;
}
const forTokenizer = new Tokenizer<ForState>([
  { pattern: /\/\/.*$/ },
  { pattern: /\/\*(?:[\s\S]*?)\*\// },
  { pattern: /"(?:\\.|[^"\\]+)*"/ },
  { pattern: /'(?:\\.|[^'\\]+)*'/ },
  {
    pattern: /\s+in\s+/,
    match(state, start, end) {
      if (state.depth === 0 && !state.hasPipe && state.type === undefined) {
        state.type = ForType.In;
        state.partType = PartType.Id;
        endPart(state, start, PartType.In, end);
      }
    },
  },
  {
    pattern: /\s+from\s+/,
    match(state, start, end) {
      if (state.depth === 0 && !state.hasPipe && state.type === undefined) {
        state.type = ForType.From;
        state.partType = PartType.Id;
        endPart(state, start, PartType.From, end);
      }
    },
  },
  {
    pattern: /\s+to\s+/,
    match(state, start, end) {
      if (state.depth === 0 && !state.hasPipe && state.type === ForType.From) {
        endPart(state, start, PartType.To, end);
      }
    },
  },
  {
    pattern: /\s+step\s+/,
    match(state, start, end) {
      if (state.depth === 0 && !state.hasPipe && state.type === ForType.From) {
        endPart(state, start, PartType.Step, end);
      }
    },
  },
  {
    pattern: /;/,
    match(state, start, end) {
      if (state.depth === 0 && !state.hasPipe) {
        if (state.type === undefined) {
          state.type = ForType.Init;
          state.partType = PartType.Init;
          endPart(state, start, PartType.Test, end);
        } else if (state.partType === PartType.Test) {
          endPart(state, start, PartType.Update, end);
        } else {
          state.hasPipe = true; // trailing semicolon has same behavior as pipe
          endPart(state, start, undefined, end);
        }
      }
    },
  },
  {
    pattern: /\bseparator\s*=\s*/,
    match(state, start, end) {
      if (state.depth === 0 && state.hasPipe) {
        endPart(state, start, PartType.Separator, end);
      }
    },
  },
  {
    pattern: /\bstatus-var\s*=\s*/,
    match(state, start, end) {
      if (state.depth === 0 && state.hasPipe) {
        endPart(state, start, PartType.StatusVar, end);
      }
    },
  },
  {
    pattern: /\biterator\s*=\s*/,
    match(state, start, end) {
      if (state.depth === 0 && state.hasPipe) {
        endPart(state, start, PartType.Iterator, end);
      }
    },
  },
  {
    pattern: /\s+\|\s+/,
    match(state, start, end) {
      if (state.depth === 0 && !state.hasPipe) {
        state.hasPipe = true;
        endPart(state, start, undefined, end);
      }
    },
  },
  {
    pattern: /[{([]/,
    match(state) {
      state.depth++;
    },
  },
  {
    pattern: /[})\]]/,
    match(state) {
      state.depth--;
    },
  },
]);

export function parseFor(source: string):
  | undefined
  | {
      type: ForType.In;
      id: Range;
      in: Range;
      statusVar: Range | undefined;
      separator: Range | undefined;
      iterator: Range | undefined;
    }
  | {
      type: ForType.From;
      id: Range;
      from: Range;
      to: Range | undefined;
      step: Range | undefined;
      statusVar: Range | undefined;
      separator: Range | undefined;
      iterator: Range | undefined;
    }
  | {
      type: ForType.Init;
      init: Range;
      test: Range;
      update: Range | undefined;
      statusVar: Range | undefined;
      separator: Range | undefined;
      iterator: Range | undefined;
    } {
  const state: ForState = {
    type: undefined,
    source,
    depth: 0,
    hasPipe: false,
    partType: undefined,
    partStart: 0,
    idPart: undefined,
    inPart: undefined,
    fromPart: undefined,
    toPart: undefined,
    stepPart: undefined,
    initPart: undefined,
    testPart: undefined,
    updatePart: undefined,
    statusVarPart: undefined,
    iteratorPart: undefined,
    separatorPart: undefined,
  };
  forTokenizer.tokenize(source, state);
  endPart(state, source.length, undefined, source.length);

  switch (state.type) {
    case ForType.In:
      return {
        type: ForType.In,
        id: state.idPart!,
        in: state.inPart!,
        statusVar: state.statusVarPart,
        separator: state.separatorPart,
        iterator: state.iteratorPart,
      } as const;
    case ForType.From:
      return {
        type: ForType.From,
        id: state.idPart!,
        from: state.fromPart!,
        to: state.toPart,
        step: state.stepPart,
        statusVar: state.statusVarPart,
        separator: state.separatorPart,
        iterator: state.iteratorPart,
      } as const;
    case ForType.Init:
      if (!state.testPart) break;
      return {
        type: ForType.Init,
        init: state.initPart!,
        test: state.testPart,
        update: state.updatePart,
        statusVar: state.statusVarPart,
        separator: state.separatorPart,
        iterator: state.iteratorPart,
      } as const;
  }
}

function endPart(
  state: ForState,
  end: number,
  nextType: PartType | undefined,
  nextStart: number,
) {
  const { partStart: start, partType } = state;
  state.partStart = nextStart;
  state.partType = nextType;

  if (partType === undefined) return;

  const part: Range = {
    start,
    end,
    value: state.source.slice(start, end),
  };

  switch (partType) {
    case PartType.Id:
      state.idPart = part;
      break;
    case PartType.From:
      state.fromPart = part;
      break;
    case PartType.To:
      state.toPart = part;
      break;
    case PartType.In:
      state.inPart = part;
      break;
    case PartType.Step:
      state.stepPart = part;
      break;
    case PartType.Init:
      state.initPart = part;
      break;
    case PartType.Test:
      state.testPart = part;
      break;
    case PartType.Update:
      state.updatePart = part;
      break;
    case PartType.StatusVar:
      state.statusVarPart = part;
      break;
    case PartType.Separator:
      state.separatorPart = part;
      break;
    case PartType.Iterator:
      state.iteratorPart = part;
      break;
  }
}
