import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

export type PdfExtraction = { text: string; images: string[]; pageCount: number };

/**
 * 在浏览器里解析 PDF：提取文字层，并把前几页渲染成 JPEG 以便 AI 识别扫描件。
 */
export const extractPdf = async (file: File, maxPages = 4): Promise<PdfExtraction> => {
  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  const pages = Math.min(doc.numPages, maxPages);
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
    if (pageText) texts.push(pageText);

    const viewport = page.getViewport({ scale: 1.4 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.min(Math.round(viewport.width), 1400);
    canvas.height = Math.round((canvas.width / viewport.width) * viewport.height);
    const context = canvas.getContext("2d");
    if (context) {
      const scaled = page.getViewport({ scale: (canvas.width / viewport.width) * 1.4 });
      await page.render({ canvas, canvasContext: context, viewport: scaled }).promise;
      images.push(canvas.toDataURL("image/jpeg", 0.72));
    }
  }

  return { text: texts.join("\n\n"), images, pageCount: doc.numPages };
};
