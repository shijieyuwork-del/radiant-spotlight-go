import { Fragment, type ReactNode } from "react";
import { parseClinicDescription } from "@/lib/clinic-reading-guide";
import { ClinicReadingGuide } from "./ClinicReadingGuide";

/** Small, safe formatting for admin text: headings, lists and HTTPS sources, never HTML. */
function sourceLinks(text: string): ReactNode[] {
  return text.split(/(\[[^\]\n]+\]\(https:\/\/[^\s)]+\))/g).map((part, index) => {
    const match = /^\[([^\]\n]+)\]\((https:\/\/[^\s)]+)\)$/.exec(part);
    if (!match) return <Fragment key={index}>{part}</Fragment>;
    return <a key={index} href={match[2]} target="_blank" rel="noopener noreferrer nofollow" className="break-words underline underline-offset-4">{match[1]}</a>;
  });
}

function renderBlocks(blocks: string[]) {
  return blocks.map((block, index) => {
    const lines = block.split("\n");
    if (lines.every((line) => line.startsWith("- "))) return <ul key={index} className="list-disc space-y-5 ps-5 marker:text-primary">{lines.map((line, item) => <li key={item}>{sourceLinks(line.slice(2))}</li>)}</ul>;
    return <p key={index} className="whitespace-pre-line break-words">{sourceLinks(block)}</p>;
  });
}

export function ClinicDescription({ description, language = "en" }: { description: string; language?: string }) {
  const { intro, chapters } = parseClinicDescription(description);
  if (!intro.length && !chapters.length) return null;
  if (chapters.length) return <ClinicReadingGuide key={`${language}:${description}`} description={description} language={language} chapters={chapters} intro={renderBlocks(intro)} renderBlocks={renderBlocks} />;
  return <div className="reading-copy mt-4 max-w-prose space-y-5 text-base leading-relaxed text-foreground">{renderBlocks(intro)}</div>;
}
