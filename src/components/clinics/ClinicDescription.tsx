import { Fragment, type ReactNode } from "react";

/** Small, safe formatting for admin text: headings, lists and HTTPS sources, never HTML. */
function sourceLinks(text: string): ReactNode[] {
  return text.split(/(\[[^\]\n]+\]\(https:\/\/[^\s)]+\))/g).map((part, index) => {
    const match = /^\[([^\]\n]+)\]\((https:\/\/[^\s)]+)\)$/.exec(part);
    if (!match) return <Fragment key={index}>{part}</Fragment>;
    return <a key={index} href={match[2]} target="_blank" rel="noopener noreferrer nofollow" className="break-words underline underline-offset-4">{match[1]}</a>;
  });
}

export function ClinicDescription({ description }: { description: string }) {
  const blocks = description.replace(/\r\n/g, "\n").trim().split(/\n\s*\n/).filter(Boolean);
  if (!blocks.length) return null;
  return <div className="mt-4 max-w-prose space-y-5 text-base leading-7 text-foreground">
    {blocks.map((block, index) => {
      if (/^## [^\n]+$/.test(block)) return <h3 key={index} className="!mt-8 break-words font-display text-xl font-semibold leading-snug">{block.slice(3)}</h3>;
      const lines = block.split("\n");
      if (lines.every((line) => line.startsWith("- "))) return <ul key={index} className="list-disc space-y-3 pl-5 marker:text-primary">{lines.map((line, item) => <li key={item}>{sourceLinks(line.slice(2))}</li>)}</ul>;
      return <p key={index} className="whitespace-pre-line break-words">{sourceLinks(block)}</p>;
    })}
  </div>;
}
