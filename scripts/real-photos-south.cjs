const { execFileSync } = require('node:child_process');
const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

function documentFor(title) {
  const url = `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_')).replaceAll('%3A', ':')}`;
  const html = execFileSync('curl', ['-L', '--fail', '--silent', '--show-error', '--max-time', '45', url], {maxBuffer: 20 * 1024 * 1024}).toString();
  return {doc: new JSDOM(html).window.document, url};
}
function inspect(title) {
  const {doc, url} = documentFor(title);
  if (title.startsWith('Category:')) {
    return {title, url,
      categories: [...doc.querySelectorAll('#mw-subcategories a')].filter(a => a.getAttribute('href')?.startsWith('/wiki/Category:')).map(a => a.textContent),
      files: [...doc.querySelectorAll('.gallerytext a')].filter(a => a.getAttribute('href')?.startsWith('/wiki/File:')).map(a => a.getAttribute('title') || a.textContent.trim())};
  }
  const field = id => doc.querySelector(`#${id}`)?.nextElementSibling?.textContent.trim().replaceAll(/\s+/g, ' ');
  return {title, sourceUrl:url, download: doc.querySelector('.fullImageLink a')?.href,
    author: field('fileinfotpl_aut'), description: field('fileinfotpl_desc'), source: field('fileinfotpl_src'),
    license: doc.querySelector('.licensetpl_short')?.textContent.trim(),
    licenseUrl: doc.querySelector('.licensetpl_link')?.textContent.trim(),
    licenses: [...doc.querySelectorAll('.licensetpl')].map(el => ({name:el.querySelector('.licensetpl_short')?.textContent.trim(),url:el.querySelector('.licensetpl_link')?.textContent.trim()}))};
}
if (process.argv[2] === 'download' || process.argv[2] === 'download-verified') {
  const entries = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
  for (const entry of entries) {
    if (fs.existsSync(path.resolve(entry.imgPath))) { console.log(`Exists: ${entry.hospitalZh}`); continue; }
    const name = entry.fileTitle.replace(/^File:/, '').replaceAll(' ', '_');
    const md5 = createHash('md5').update(name).digest('hex');
    const info = process.argv[2] === 'download-verified' ? {
      download: `https://upload.wikimedia.org/wikipedia/commons/${md5[0]}/${md5.slice(0,2)}/${encodeURIComponent(name)}`,
      licenses: [{name:entry.license}]
    } : inspect(entry.fileTitle);
    if (!info.download?.startsWith('https://upload.wikimedia.org/')) throw new Error(`Missing original for ${entry.fileTitle}`);
    if (!info.licenses.some(l => /CC BY(?:-SA)? [1-4]\.0|CC0|Public domain/.test(l.name || ''))) throw new Error(`No reusable license: ${entry.fileTitle}`);
    const out = path.resolve(entry.imgPath);
    fs.mkdirSync(path.dirname(out),{recursive:true});
    const tmp = fs.mkdtempSync('/tmp/celadon-south-photo-');
    const original = path.join(tmp,'original');
    const headers = path.join(tmp, 'headers.txt');
    try {
      execFileSync('curl',['-L','--fail','--silent','--show-error','--max-time','90','-D',headers,info.download,'-o',original]);
    } catch (error) {
      console.error(JSON.stringify({failedAt:new Date().toISOString(),hospitalZh:entry.hospitalZh,headersPath:headers,responseHeaders:fs.existsSync(headers)?fs.readFileSync(headers,'utf8'):null}));
      throw error;
    }
    let conversionSource = original;
    if (entry.rotation) {
      conversionSource = path.join(tmp, 'upright.jpg');
      execFileSync('sips', ['-r', String(entry.rotation), original, '--out', conversionSource]);
    }
    execFileSync('cwebp',['-quiet','-q','84','-resize','1200','0',conversionSource,'-o',out]);
    console.log(JSON.stringify({...entry,...info}));
    execFileSync('sleep',['15']);
  }
} else {
  for (const title of process.argv.slice(2)) {
    try { console.log(JSON.stringify(inspect(title))); }
    catch (error) {console.log(JSON.stringify({title,error:error.message}));}
  }
}
