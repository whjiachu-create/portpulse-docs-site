import fs from 'fs'; import path from 'path'; import https from 'https';
const SRC = process.env.OPENAPI_SRC || 'https://api.useportpulse.com/openapi.json';
const OUT = path.join('static', 'openapi.json');
https.get(SRC, (res) => {
  if (res.statusCode !== 200) { console.error('HTTP', res.statusCode); process.exit(1); }
  const chunks=[]; res.on('data', c=>chunks.push(c));
  res.on('end', () => {
    const buf = Buffer.concat(chunks);
    try { JSON.parse(buf.toString('utf8')); } catch { console.error('Invalid JSON'); process.exit(1); }
    fs.mkdirSync(path.dirname(OUT), {recursive:true}); fs.writeFileSync(OUT, buf);
    console.log(`✅ Saved ${OUT} (${buf.length} bytes)`);
  });
}).on('error', (e)=>{ console.error(e); process.exit(1); });
