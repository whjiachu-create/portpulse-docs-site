import fs from 'fs';

const p = 'static/openapi.json';
if (!fs.existsSync(p)) {
  console.error('openapi.json not found, skip clean');
  process.exit(0);
}

let raw = fs.readFileSync(p, 'utf8');

// 1) 文案中英替换（你贴到的中文）
raw = raw.replaceAll("支持 '14' 或 '14d'，范围 7-60", "Supports '14' or '14d', range 7–60");

let obj;
try { obj = JSON.parse(raw); } catch (e) {
  console.error('Invalid JSON after replace:', e.message);
  process.exit(1);
}

// 2) 删除重复路径：/v1/hs/{hs_code}/imports（保留 /v1/hs/{code}/imports）
if (obj.paths && obj.paths["/v1/hs/{hs_code}/imports"]) {
  delete obj.paths["/v1/hs/{hs_code}/imports"];
}

// 3) 去重所有 method 的 tags 数组（["ports","ports"] → ["ports"]）
if (obj.paths) {
  for (const [route, rec] of Object.entries(obj.paths)) {
    if (rec && typeof rec === 'object') {
      for (const [method, def] of Object.entries(rec)) {
        if (def && def.tags && Array.isArray(def.tags)) {
          def.tags = Array.from(new Set(def.tags.map(String)));
        }
      }
    }
  }
}

// 4) 重新写回（保持紧凑；若想美化可传 2 作为第三参）
fs.writeFileSync(p, JSON.stringify(obj));
console.log('✅ cleaned static/openapi.json',
            `paths=${Object.keys(obj.paths||{}).length}`);
