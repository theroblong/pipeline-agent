import Link from "next/link";
import type React from "react";

type MarkdownViewProps = {
  content: string;
};

function renderInline(text: string) {
  const parts: React.ReactNode[] = [];
  const pattern = /(`[^`]+`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("`")) {
      parts.push(<code key={parts.length}>{token.slice(1, -1)}</code>);
    } else {
      const label = match[2];
      const href = match[3];
      const isLocalMarkdown = href.endsWith(".md") || href.startsWith("../");
      parts.push(
        <Link
          key={parts.length}
          href={isLocalMarkdown ? "#" : href}
          className={isLocalMarkdown ? "muted-link" : undefined}
        >
          {label}
        </Link>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function isTableSeparator(line: string) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function parseTable(lines: string[], start: number) {
  const rows: string[][] = [];
  let index = start;

  while (index < lines.length && lines[index].includes("|")) {
    if (!isTableSeparator(lines[index])) {
      rows.push(
        lines[index]
          .trim()
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((cell) => cell.trim())
      );
    }

    index += 1;
  }

  return { rows, nextIndex: index };
}

export function MarkdownView({ content }: MarkdownViewProps) {
  const lines = content.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push(<pre key={blocks.length}>{codeLines.join("\n")}</pre>);
      index += 1;
      continue;
    }

    if (
      trimmed.includes("|") &&
      index + 1 < lines.length &&
      isTableSeparator(lines[index + 1])
    ) {
      const table = parseTable(lines, index);
      const [header, ...body] = table.rows;

      blocks.push(
        <div className="table-scroll" key={blocks.length}>
          <table>
            <thead>
              <tr>
                {header.map((cell) => (
                  <th key={cell}>{renderInline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, rowIndex) => (
                <tr key={`${row.join("-")}-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${cell}-${cellIndex}`}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      index = table.nextIndex;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      blocks.push(<h3 key={blocks.length}>{renderInline(trimmed.slice(4))}</h3>);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      blocks.push(<h2 key={blocks.length}>{renderInline(trimmed.slice(3))}</h2>);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      blocks.push(<h1 key={blocks.length}>{renderInline(trimmed.slice(2))}</h1>);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const items: string[] = [];

      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }

      blocks.push(
        <ul key={blocks.length}>
          {items.map((item) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    blocks.push(<p key={blocks.length}>{renderInline(trimmed)}</p>);
    index += 1;
  }

  return <article className="markdown-view">{blocks}</article>;
}
