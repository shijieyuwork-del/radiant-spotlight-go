import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

export type PdfExtraction = { text: string; images: string[]; pageCount: number; processedPages: number };

export type PdfExtractionOptions = {
  maxPages?: number;
  maxRenderedPages?: number;
  onProgress?: (processed: number, total: number) => void;
};

const representativePages = (pageCount: number, sampleCount: number): Set<number> => {
  if (pageCount <= sampleCount) return new Set(Array.from({ length: pageCount }, (_, index) => index + 1));
  return new Set(Array.from({ length: sampleCount }, (_, index) =>
    Math.round(1 + (index * (pageCount - 1)) / (sampleCount - 1))));
};

/**
 * 在浏览器里解析长 PDF：读取全文文字，并从整份文档均匀抽取代表页面供 AI 识别扫描件。
 */
export const extractPdf = async (file: File, options: PdfExtractionOptions = {}): Promise<PdfExtraction> => {
  const { maxPages = 60, maxRenderedPages = 8, onProgress } = options;
  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  const pages = Math.min(doc.numPages, maxPages);
  const pagesToRender = representativePages(pages, Math.min(maxRenderedPages, pages));
  const texts: string[] = [];
  const images: string[] = [];

  for (let index = 1; index <= pages; index += 1) {
    const page = await doc.getPage(index);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (pageText) texts.push(`[Page ${index}] ${pageText}`);

    if (pagesToRender.has(index)) {
      const viewport = page.getViewport({ scale: 1.25 });
      const canvas = document.createElement("canvas");
      canvas.width = Math.min(Math.round(viewport.width), 1200);
      canvas.height = Math.round((canvas.width / viewport.width) * viewport.height);
      const context = canvas.getContext("2d");
      if (context) {
        const scaled = page.getViewport({ scale: canvas.width / page.getViewport({ scale: 1 }).width });
        await page.render({ canvas, canvasContext: context, viewport: scaled }).promise;
        images.push(canvas.toDataURL("image/jpeg", 0.68));
      }
    }
    onProgress?.(index, pages);
  }

  return { text: texts.join("\n\n"), images, pageCount: doc.numPages, processedPages: pages };
};
