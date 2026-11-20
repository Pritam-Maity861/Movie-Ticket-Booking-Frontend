import React from "react";
import { CreditCard, ExternalLink, Ticket } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  onNavigate?: (url: string) => void;
}

interface NormalizedUrlResult {
  isCheckout: boolean;
  path: string;
  fullUrl: string;
}

/**
 * Normalizes any checkout URL (relative path, query parameter, or hallucinated external domain)
 * into a genuine, workable URL: http://localhost:5173/checkout/:bookingId
 */
function normalizeUrl(rawUrl: string): NormalizedUrlResult {
  const trimmed = rawUrl.trim();
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "http://localhost:5173";

  // Pattern 1: query parameter booking_id=UUID or bookingId=UUID
  const queryMatch = trimmed.match(/[?&]booking_?id=([a-zA-Z0-9_-]+)/i);
  if (queryMatch) {
    const bookingId = queryMatch[1];
    return {
      isCheckout: true,
      path: `/checkout/${bookingId}`,
      fullUrl: `${origin}/checkout/${bookingId}`,
    };
  }

  // Pattern 2: /checkout/UUID or path ending with /checkout/:id
  const pathMatch = trimmed.match(/\/checkout\/([a-zA-Z0-9_-]+)/i);
  if (pathMatch) {
    const bookingId = pathMatch[1];
    return {
      isCheckout: true,
      path: `/checkout/${bookingId}`,
      fullUrl: `${origin}/checkout/${bookingId}`,
    };
  }

  // Pattern 3: relative path starting with /checkout
  if (trimmed.startsWith("/checkout")) {
    return {
      isCheckout: true,
      path: trimmed,
      fullUrl: `${origin}${trimmed}`,
    };
  }

  // Internal relative link
  if (trimmed.startsWith("/")) {
    return {
      isCheckout: false,
      path: trimmed,
      fullUrl: `${origin}${trimmed}`,
    };
  }

  return { isCheckout: false, path: trimmed, fullUrl: trimmed };
}

/**
 * Recursively parses inline formatting:
 * - Bold with links: **[label](url)**
 * - Direct links: [label](url)
 * - Plain bold: **text**
 * - Plain italic: *text*
 * - Inline code: `code`
 * - Plain text
 */
function renderInline(
  text: string,
  onNavigate?: (url: string) => void,
  keyPrefix = "inline"
): React.ReactNode[] {
  const tokenRegex =
    /(\*\*\[[^\]]+\]\([^)]+\)\*\*|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    // Case 1: Bold link **[label](url)**
    const boldLinkMatch = part.match(/^\*\*\[([^\]]+)\]\(([^)]+)\)\*\*$/);
    if (boldLinkMatch) {
      const label = boldLinkMatch[1];
      const rawUrl = boldLinkMatch[2];
      const { isCheckout, path, fullUrl } = normalizeUrl(rawUrl);

      if (isCheckout) {
        return (
          <a
            key={key}
            href={fullUrl}
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.(path);
            }}
            title={`Checkout: ${fullUrl}`}
            className="inline-flex items-center gap-2 px-4 py-2 my-1.5 bg-primary hover:bg-primary-dull text-white font-black rounded-xl shadow-lg shadow-primary/30 text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer no-underline select-none border border-primary/50"
          >
            <CreditCard className="w-4 h-4 text-white shrink-0" />
            <span>{label}</span>
          </a>
        );
      }

      if (path.startsWith("/")) {
        return (
          <button
            key={key}
            onClick={() => onNavigate?.(path)}
            className="text-primary hover:text-primary-dull font-bold underline underline-offset-2 cursor-pointer inline-flex items-center gap-1"
          >
            <Ticket className="w-3.5 h-3.5" />
            {label}
          </button>
        );
      }

      return (
        <a
          key={key}
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-dull underline underline-offset-2 inline-flex items-center gap-1 font-bold"
        >
          {label}
          <ExternalLink className="w-3 h-3 inline" />
        </a>
      );
    }

    // Case 2: Standard link [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const rawUrl = linkMatch[2];
      const { isCheckout, path, fullUrl } = normalizeUrl(rawUrl);

      if (isCheckout) {
        return (
          <a
            key={key}
            href={fullUrl}
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.(path);
            }}
            title={`Checkout: ${fullUrl}`}
            className="inline-flex items-center gap-2 px-4 py-2 my-1.5 bg-primary hover:bg-primary-dull text-white font-black rounded-xl shadow-lg shadow-primary/30 text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer no-underline select-none border border-primary/50"
          >
            <CreditCard className="w-4 h-4 text-white shrink-0" />
            <span>{label}</span>
          </a>
        );
      }

      // Internal app navigation vs external link
      if (path.startsWith("/")) {
        return (
          <button
            key={key}
            onClick={() => onNavigate?.(path)}
            className="text-primary hover:text-primary-dull font-bold underline underline-offset-2 cursor-pointer inline-flex items-center gap-1"
          >
            <Ticket className="w-3.5 h-3.5" />
            {label}
          </button>
        );
      }

      return (
        <a
          key={key}
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-dull underline underline-offset-2 inline-flex items-center gap-0.5 font-medium"
        >
          {label}
          <ExternalLink className="w-3 h-3 inline" />
        </a>
      );
    }

    // Case 3: Bold text: **text**
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={key} className="font-bold text-white">
          {renderInline(boldMatch[1], onNavigate, `${key}-b`)}
        </strong>
      );
    }

    // Case 4: Italic text: *text*
    const italicMatch = part.match(/^\*([^*]+)\*$/);
    if (italicMatch) {
      return (
        <em key={key} className="italic text-gray-300">
          {renderInline(italicMatch[1], onNavigate, `${key}-i`)}
        </em>
      );
    }

    // Case 5: Inline Code: `code`
    const codeMatch = part.match(/^`([^`]+)`$/);
    if (codeMatch) {
      return (
        <code
          key={key}
          className="px-1.5 py-0.5 rounded bg-white/10 text-primary font-mono text-[11px] border border-white/5"
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
          className="text-xs font-black text-primary mt-2.5 mb-1 flex items-center gap-1.5 tracking-wide"
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
          className="text-sm font-black text-primary mt-3 mb-1.5 tracking-wide"
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
          className="text-base font-black text-primary mt-3 mb-2 tracking-wide"
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
          className="my-2.5 overflow-x-auto rounded-xl border border-white/15 bg-black/50 shadow-inner"
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-primary/10 border-b border-primary/20 text-primary font-bold uppercase tracking-wider text-[11px]">
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
              <span className="text-primary font-black select-none">•</span>
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
              <span className="text-primary font-bold select-none text-[11px] shrink-0">
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
