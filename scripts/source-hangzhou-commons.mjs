import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const candidates = [
  ['浙江大学医学院附属第二医院 整形科', 'zju-second', '20250419 Zhejiang Daxue Yixueyuan Fushu Di-Er Yiyuan.jpg'],
  ['浙江省人民医院 整形外科', 'zhejiang-provincial', "Zhejiang Provincial People's Hospital 01.jpg"],
  ['浙江大学医学院附属第一医院', 'zju-first', 'Main gate of Qingchun Campus, The First Affiliated Hospital of Zhejiang University School of Medicine, 202501.jpg'],
  ['浙江大学医学院附属邵逸夫医院', 'sir-run-run-shaw', '202407邵逸夫醫院慶春院區主樓.jpg'],
  ['浙江医院', 'zhejiang-hospital', 'Zhejiang Hospital, Zhejiang University School of Medicine.jpg'],
  ['浙江省中医院', 'zhejiang-chinese-medicine', 'Chinese medicine hospital of zhejiang province 01.jpg'],
  ['浙江省肿瘤医院', 'zhejiang-cancer', '浙江省腫瘤醫院門牌.jpg'],
  ['杭州市第一人民医院', 'hangzhou-first', "The first people's hospital of hangzhou 01.jpg"],
  ['杭州市第三人民医院', 'hangzhou-third', '市三医院 20260707 103142.jpg'],
  ['浙江大学医学院附属妇产科医院', 'zju-womens', "Exterior of Hubin Campus, Women's Hospital School of Medcine Zhejiang University, 202602.jpg"],
  ['浙江大学医学院附属儿童医院', 'zju-childrens-binjiang', "The Children's Hospital of Zhejiang Province 02.jpg"],
  ['浙江大学医学院附属口腔医院', 'zju-stomatology', 'Zhejiang Stomatology Hospital 03.jpg'],
  ['杭州市萧山区第一人民医院', 'xiaoshan-first', "Xiaoshan First People's Hospital 01.jpg"],
];
const clean = (s='') => s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#(?:x([\da-f]+)|(\d+));/gi, (_,h,d)=>String.fromCodePoint(parseInt(h||d,h?16:10))).replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const root = new URL('../', import.meta.url).pathname;
const output = join(root, 'src/assets/real-photos/hangzhou');
await mkdir(output, { recursive: true });
const maxDownloads = Number(process.argv.find((arg) => arg.startsWith('--max-downloads='))?.split('=')[1] ?? 9);
let downloads = 0;
for (const [hospitalZh, slug, title] of candidates) {
  const sourceUrl = 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(title.replaceAll(' ','_'));
  const cachePath = join(tmpdir(), `celadon-${slug}-commons.html`);
  let raw;
  try { raw = await readFile(cachePath, 'utf8'); } catch {
    const res = await fetch(sourceUrl);
    if (!res.ok) { console.error('FAILED PAGE', slug, res.status, 'Retry-After:', res.headers.get('retry-after')); process.exitCode = 1; break; }
    raw = await res.text();
    await writeFile(cachePath, raw);
  }
  const html = raw.replaceAll('&#95;', '_');
  const author = clean(html.match(/id="fileinfotpl_aut"[\s\S]*?<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/)?.[1]);
  const description = clean(html.match(/id="fileinfotpl_desc"[\s\S]*?<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/)?.[1]);
  const photoDate = clean(html.match(/id="fileinfotpl_date"[\s\S]*?<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/)?.[1]);
  const license = clean(html.match(/class="licensetpl_short"[^>]*>([\s\S]*?)<\/span>/)?.[1]);
  const licenseUrl = clean(html.match(/class="licensetpl_link"[^>]*>([\s\S]*?)<\/span>/)?.[1]);
  const originalUrl = html.match(/<div class="fullImageLink"[^>]*><a href="([^"]+)"/)?.[1]?.replaceAll('&amp;','&').split('?')[0];
  if (!author || !license || !originalUrl || !/CC BY(?:-SA)? [\d.]+|CC0|Public domain/i.test(license) || /NC|ND/.test(license)) { console.error('MISSING METADATA', slug, {author,license,originalUrl}); continue; }
  const imgPath = 'src/assets/real-photos/hangzhou/' + slug + '.webp';
  const metadata = {hospitalZh,imgPath,author,license,licenseUrl,sourceUrl,description: `${description} Photograph: ${photoDate}.`,modifications:'Resized to 1200 pixels wide and converted to WebP; original aspect ratio retained.',originalUrl};
  console.log(JSON.stringify(metadata));
  if (process.argv.includes('--metadata-only')) { await new Promise(resolve=>setTimeout(resolve, 1200)); continue; }
  try { await readFile(join(root, imgPath)); continue; } catch {}
  const img = await fetch(originalUrl);
  if(!img.ok) { console.error('FAILED IMAGE',slug,img.status,'Retry-After:',img.headers.get('retry-after'));process.exitCode=1;break; }
  const temp = join(tmpdir(), `celadon-${slug}-original.jpg`);
  await writeFile(temp, Buffer.from(await img.arrayBuffer()));
  execFileSync('cwebp', ['-quiet','-q','84','-resize','1200','0',temp,'-o',join(root,imgPath)]);
  downloads += 1;
  if (downloads >= maxDownloads) { console.error(`Stopped at the requested batch limit: ${downloads} downloads.`); break; }
  await new Promise(resolve=>setTimeout(resolve, 15000));
}
