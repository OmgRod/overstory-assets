class SplitStringExtension {
  getInfo() {
    return {
      id: "splitString",
      name: "String Tools",
      blocks: [
        {
          opcode: "splitAndGet",
          blockType: Scratch.BlockType.REPORTER,
          text: "split [TEXT] by [SEP] and get part [INDEX]",
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "SND_TXT2|Hello world"
            },
            SEP: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "|"
            },
            INDEX: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 2
            }
          },
          category: "String Tools"
        },
        {
          opcode: "sliceText",
          blockType: Scratch.BlockType.REPORTER,
          text: "[SIDE] [COUNT] letters of [TEXT]",
          arguments: {
            SIDE: {
              type: Scratch.ArgumentType.STRING,
              menu: "sides",
              defaultValue: "first"
            },
            COUNT: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 5
            },
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "example"
            }
          },
          category: "String Tools"
        },
        {
          opcode: "countSplitParts",
          blockType: Scratch.BlockType.REPORTER,
          text: "count of sections in [TEXT] split by [SEP]",
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "SND_TXT2|Hello world"
            },
            SEP: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "|"
            }
          },
          category: "String Tools"
        },

        // Undertale string parsing category blocks
        {
          opcode: "parseUTString",
          blockType: Scratch.BlockType.REPORTER,
          text: "parse undertale string [TEXT]",
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Long ago^1, two races&ruled over Earth^1\\&#HUMANS and MONSTERS^6. \\E1 ^1 %"
            }
          },
          category: "Undertale String Tools"
        },
        {
          opcode: "utParsedToText",
          blockType: Scratch.BlockType.REPORTER,
          text: "convert parsed undertale string [TEXT] to text",
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "text#L|text#o|text#n|text#g|text# |pause#1|text#a|text#g|text#o|newline"
            }
          },
          category: "Undertale String Tools"
        },
        {
          opcode: "utSplitParsedLimited",
          blockType: Scratch.BlockType.REPORTER,
          text: "split parsed undertale string [TEXT] by [SEP] max [LIMIT] splits",
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "text#Long|pause#1|newline|expression#0"
            },
            SEP: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "|"
            },
            LIMIT: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 2
            }
          },
          category: "Undertale String Tools"
        },
        {
          opcode: "utSplitParsed",
          blockType: Scratch.BlockType.REPORTER,
          text: "split parsed undertale string [TEXT] by [SEP]",
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "text#Long|pause#1|newline|expression#0"
            },
            SEP: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "|"
            }
          },
          category: "Undertale String Tools"
        },
        {
          opcode: "countLeadingWhitespace",
          blockType: Scratch.BlockType.REPORTER,
          text: "count leading whitespace in [TEXT]",
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "    indented text"
            }
          },
          category: "String Tools"
        },
        {
          opcode: "keyPressed",
          blockType: Scratch.BlockType.BOOLEAN,
          text: "[KEY] key pressed?",
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "enter"
            }
          },
          category: "String Tools"
        }
      ],
      menus: {
        sides: {
          acceptReporters: true,
          items: ["first", "last"]
        }
      }
    };
  }

  splitAndGet(args) {
    const text = args.TEXT ?? "";
    const sep = args.SEP ?? "|";
    const index = Number(args.INDEX) - 1;
    const parts = text.split(sep);
    return parts[index] ?? "";
  }

  sliceText(args) {
    const text = args.TEXT ?? "";
    const count = Math.max(0, Number(args.COUNT));
    const side = args.SIDE;

    if (side === "first") return text.slice(0, count);
    if (side === "last") return text.slice(-count);
    return "";
  }

  countSplitParts(args) {
    const text = args.TEXT ?? "";
    const sep = args.SEP ?? "|";
    return text.split(sep).length;
  }

  parseUTString(args) {
    const raw = args.TEXT ?? "";
    const result = [];

    let i = 0;
    while (i < raw.length) {
      const ch = raw[i];

      if (ch === "\\") {
        i++;
        if (i >= raw.length) break;
        const nextCh = raw[i];

        if (nextCh === "E") {
          i++;
          let num = "";
          while (i < raw.length && /[0-9]/.test(raw[i])) {
            num += raw[i++];
          }
          result.push(`expression#${parseInt(num || "0")}`);
          continue;
        } else {
          if (nextCh === ":") {
            result.push(`text#\uFFF9`);
          } else {
            result.push(`text#${nextCh}`);
          }
          i++;
          continue;
        }
      }

      if (ch === "^") {
        let num = "";
        i++;
        while (i < raw.length && /[0-9]/.test(raw[i])) {
          num += raw[i++];
        }
        result.push(`pause#${parseInt(num || "1")}`);
        continue;
      }

      if (ch === "&") {
        result.push("newline");
        i++;
        continue;
      }

      if (ch === "%" && raw[i + 1] === "%") {
        result.push("end");
        i += 2;
        continue;
      }

      if (ch === "%") {
        result.push("flush");
        i++;
        continue;
      }

      result.push(`text#${ch}`);
      i++;
    }

    return result.join("|");
  }

  utParsedToText(args) {
    const parsed = args.TEXT ?? "";
    if (!parsed) return "";
    const parts = parsed.split("|");
    let output = "";
    for (const part of parts) {
      if (part.startsWith("text#")) {
        let textPart = part.slice(5);
        textPart = textPart.replace(/\uFFF9/g, ":");
        output += textPart;
      } else if (part.startsWith("pause#")) {
        output += `[pause ${part.slice(6)}]`;
      } else if (part === "newline") {
        output += "\n";
      } else if (part === "end") {
        output += "[end]";
      } else if (part === "flush") {
        output += "[flush]";
      } else if (part.startsWith("expression#")) {
        output += `[expr ${part.slice(11)}]`;
      } else {
        output += `[${part}]`;
      }
    }
    return output;
  }

  utSplitParsedLimited(args) {
    const parsed = args.TEXT ?? "";
    const sep = args.SEP ?? "|";
    const limit = Math.max(0, Number(args.LIMIT) || 0);

    if (limit === 0) return parsed;

    const parts = [];
    let remaining = parsed;
    for (let i = 0; i < limit - 1; i++) {
      const index = remaining.indexOf(sep);
      if (index === -1) break;
      parts.push(remaining.slice(0, index));
      remaining = remaining.slice(index + sep.length);
    }
    parts.push(remaining);

    return parts.join("\n");
  }

  utSplitParsed(args) {
    const parsed = args.TEXT ?? "";
    const sep = args.SEP ?? "|";
    const parts = parsed.split(sep);
    return parts.join("\n");
  }

  countLeadingWhitespace(args) {
    const text = args.TEXT ?? "";
    const match = text.match(/^(\s*)/);
    return match ? match[1].length : 0;
  }

  keyPressed(args, util) {
    return util.ioQuery('keyboard', 'getKeyIsDown', [args.KEY.toLowerCase()]);
  }
}

Scratch.extensions.register(new SplitStringExtension());
