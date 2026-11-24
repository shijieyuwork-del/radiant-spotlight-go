import { gzipSync, brotliCompressSync } from "node:zlib";
import type { Plugin } from "vite";

/** Report real emitted module sizes without shipping a visualization library to visitors. */
export function bundleReport(): Plugin {
  return {
    name: "bundle-size-report",
    apply: "build",
    generateBundle(_options, bundle) {
      const chunks = Object.values(bundle).filter((item) => item.type === "chunk");
      const report = chunks.map((chunk) => ({
        file: chunk.fileName, entry: chunk.isEntry, imports: chunk.imports,
        bytes: Buffer.byteLength(chunk.code), gzipBytes: gzipSync(chunk.code).length,
        brotliBytes: brotliCompressSync(chunk.code).length,
        modules: Object.entries(chunk.modules).map(([id, info]) => ({
          id: id.replace(process.cwd() + "/", ""), bytes: info.renderedLength,
        })).sort((a, b) => b.bytes - a.bytes),
      }));
      for (const entry of report.filter((item) => item.entry)) {
        console.log(`bundle-report: ${entry.file}: ${entry.bytes} bytes raw, ${entry.gzipBytes} gzip, ${entry.brotliBytes} brotli`);
        console.log(`bundle-report contributors: ${entry.modules.slice(0, 12).map((m) => `${m.id} (${m.bytes})`).join(", ")}`);
      }
      this.emitFile({ type: "asset", fileName: "bundle-report.json", source: JSON.stringify(report, null, 2) });
    },
  };
}