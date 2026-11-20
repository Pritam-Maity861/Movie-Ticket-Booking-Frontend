import React from "react";
import { CreditCard, ExternalLink, Ticket } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  onNavigate?: (url: string) => void;
}

/**
 * Normalizes any checkout URL (relative or hallucinated external) to the app route `/checkout/:bookingId`
 */
function normalizeUrl(rawUrl: string): { isCheckout: boolean; url: string } {
  const trimmed = rawUrl.trim();

  // Pattern 1: query parameter booking_id=UUID or bookingId=UUID
  const queryMatch = trimmed.match(/[?&]booking_?id=([a-zA-Z0-9_-]+)/i);
  if (queryMatch) {
    return { isCheckout: true, url: `/checkout/${queryMatch[1]}` };
  }

  // Pattern 2: /checkout/UUID or path ending with /checkout/:id
  const pathMatch = trimmed.match(/\/checkout\/([a-zA-Z0-9_-]+)/i);
  if (pathMatch) {
    return { isCheckout: true, url: `/checkout/${pathMatch[1]}` };
  }

  // Pattern 3: relative path /checkout
  if (trimmed.startsWith("/checkout")) {
    return { isCheckout: true, url: trimmed };
  }

  return { isCheckout: false, url: trimmed };
}

/**
 * Parses inline formatting: **bold**, *italic*, `code`, and [label](url)
 */
function renderInline(
  text: string,
  onNavigate?: (url: string) => void,
  keyPrefix = "inline"
): React.ReactNode[] {
  // Regex matches: [label](url), **bold**, *italic*, `code`
  const tokenRegex =
    /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    // Link: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const rawUrl = linkMatch[2];
      const { isCheckout, url } = normalizeUrl(rawUrl);

      if (isCheckout) {
        return (
          <button
            key={key}
            onClick={() => onNavigate?.(url)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 my-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold rounded-lg shadow-md shadow-amber-500/20 text-xs transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{label.replace(/^Proceed to Checkout\s*–?\s*/i, "Pay ")}</span>
          </button>
        );
      }

      // Internal app navigation vs external link
      if (url.startsWith("/")) {
        return (
          <button
            key={key}
            onClick={() => onNavigate?.(url)}
            className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 cursor-pointer inline-flex items-center gap-1"
          >
            <Ticket className="w-3 h-3" />
            {label}
          </button>
        );
      }

      return (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:text-amber-300 underline underline-offset-2 inline-flex items-center gap-0.5 font-medium"
        >
          {label}
          <ExternalLink className="w-3 h-3 inline" />
        </a>
      );
    }

    // Bold: **text**
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={key} className="font-bold text-white">
          {boldMatch[1]}
        </strong>
      );
    }

    // Italic: *text*
    const italicMatch = part.match(/^\*([^*]+)\*$/);
    if (italicMatch) {
      return (
        <em key={key} className="italic text-gray-300">
          {italicMatch[1]}
        </em>
      );
    }

    // Inline Code: `code`
    const codeMatch = part.match(/^`([^`]+)`$/);
    if (codeMatch) {
      return (
        <code
          key={key}
          className="px-1.5 py-0.5 rounded bg-white/10 text-amber-300 font-mono text-[11px]"
        >
          {codeMatch[1]}
        </code>
      );
    }

    return part;
  });
}

/**
 * Checks if a line is a markdown table row (e.g. | col1 | col2 |)
 */
function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|");
}

/**
 * Checks if a line is a markdown table separator (e.g. |---|---|)
 */
function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return false;
  const inner = trimmed.slice(1, -1);
  return inner.split("|").every((cell) => /^[\s-:]+$/.test(cell));
}

/**
 * Splits a markdown table row into trimmed cell values
 */
function parseRowCells(rowLine: string): string[] {
  const trimmed = rowLine.trim();
  // Strip leading and trailing '|'
  const inner = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return inner.split("|").map((c) => c.trim());
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  onNavigate,
}) => {
  if (!content) return null;

  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const currentLine = lines[index];
    const trimmed = currentLine.trim();

    // 1. Horizontal Rule: --- or ***
    if (/^(\s*[-*_]\s*){3,}$/.test(trimmed)) {
      nodes.push(<hr key={`hr-${index}`} className="border-white/10 my-2.5" />);
      index++;
      continue;
    }

    // 2. Headings: #, ##, ###
    if (trimmed.startsWith("### ")) {
      nodes.push(
        <h4
          key={`h4-${index}`}
          className="text-xs font-bold text-amber-300 mt-2.5 mb-1 flex items-center gap-1.5"
        >
          {renderInline(trimmed.slice(4), onNavigate, `h4-${index}`)}
        </h4>
      );
      index++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      nodes.push(
        <h3
          key={`h3-${index}`}
          className="text-sm font-extrabold text-amber-400 mt-3 mb-1.5"
        >
          {renderInline(trimmed.slice(3), onNavigate, `h3-${index}`)}
        </h3>
      );
      index++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      nodes.push(
        <h2
          key={`h2-${index}`}
          className="text-base font-black text-amber-500 mt-3 mb-2"
        >
          {renderInline(trimmed.slice(2), onNavigate, `h2-${index}`)}
        </h2>
      );
      index++;
      continue;
    }

    // 3. Markdown Table: Starts with | ... | and next line is separator
    if (
      isTableRow(currentLine) &&
      index + 1 < lines.length &&
      isTableSeparator(lines[index + 1])
    ) {
      const headerCells = parseRowCells(currentLine);
      index += 2; // skip header row and separator row

      const rows: string[][] = [];
      while (index < lines.length && isTableRow(lines[index])) {
        rows.push(parseRowCells(lines[index]));
        index++;
      }

      nodes.push(
        <div
          key={`table-${index}`}
          className="my-2.5 overflow-x-auto rounded-xl border border-white/15 bg-black/40 shadow-inner"
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/10 border-b border-white/10 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                {headerCells.map((head, hIdx) => (
                  <th key={hIdx} className="px-3 py-2 text-left">
                    {renderInline(head, onNavigate, `th-${hIdx}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={rIdx % 2 === 0 ? "bg-white/[0.02]" : "bg-white/[0.05]"}
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-3 py-2 text-gray-200 align-top text-[12px]"
                    >
                      {renderInline(cell, onNavigate, `td-${rIdx}-${cIdx}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // 4. Bullet lists: - item or * item
    if (/^[-*]\s+/.test(trimmed)) {
      const bulletItems: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        bulletItems.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index++;
      }

      nodes.push(
        <ul key={`ul-${index}`} className="my-1.5 space-y-1 pl-1">
          {bulletItems.map((item, bIdx) => (
            <li
              key={bIdx}
              className="flex items-start gap-2 text-gray-200 text-xs leading-relaxed"
            >
              <span className="text-amber-400 font-bold select-none">•</span>
              <span className="flex-1">
                {renderInline(item, onNavigate, `li-${bIdx}`)}
              </span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 5. Numbered lists: 1. item
    if (/^\d+\.\s+/.test(trimmed)) {
      const numberedItems: { num: string; text: string }[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        const itemTrimmed = lines[index].trim();
        const match = itemTrimmed.match(/^(\d+)\.\s+(.*)$/);
        if (match) {
          numberedItems.push({ num: match[1], text: match[2] });
        }
        index++;
      }

      nodes.push(
        <ol key={`ol-${index}`} className="my-1.5 space-y-1 pl-1">
          {numberedItems.map((item, nIdx) => (
            <li
              key={nIdx}
              className="flex items-start gap-2 text-gray-200 text-xs leading-relaxed"
            >
              <span className="text-amber-400 font-semibold select-none text-[11px] shrink-0">
                {item.num}.
              </span>
              <span className="flex-1">
                {renderInline(item.text, onNavigate, `ol-${nIdx}`)}
              </span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 6. Empty Line
    if (!trimmed) {
      index++;
      continue;
    }

    // 7. Regular paragraph line
    nodes.push(
      <p key={`p-${index}`} className="my-1 text-xs leading-relaxed">
        {renderInline(currentLine, onNavigate, `p-${index}`)}
      </p>
    );
    index++;
  }

  return <div className="space-y-1">{nodes}</div>;
};

export default MarkdownRenderer;
