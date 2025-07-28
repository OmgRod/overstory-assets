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
          }
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
          }
        },
        {
          opcode: "parseUTString",
          blockType: Scratch.BlockType.REPORTER,
          text: "parse UT string [TEXT]",
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Long ago^1, two races&ruled over Earth^1\\:&HUMANS and MONSTERS^6. \\E1 ^1 %"
            }
          }
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
          }
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
          result.push(`expression:${parseInt(num || "0")}`);
          continue;
        } else {
          if (nextCh === ":") {
            result.push(`text:\uFFF9`);
          } else {
            result.push(`text:${nextCh}`);
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
        result.push(`pause:${parseInt(num || "1")}`);
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

      result.push(`text:${ch}`);
      i++;
    }

    return result.join("|");
  }

  countSplitParts(args) {
    const text = args.TEXT ?? "";
    const sep = args.SEP ?? "|";
    return text.split(sep).length;
  }
}

Scratch.extensions.register(new SplitStringExtension());
