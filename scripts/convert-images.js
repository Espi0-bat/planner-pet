import sharp from 'sharp'
import { readdirSync, statSync } from 'fs'
import { join, basename, extname } from 'path'

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname
  .replace(/^\/([A-Z]:)/, '$1')
  .replace(/%20/g, ' ')

const PNGs = readdirSync(PUBLIC_DIR)
  .filter(f => extname(f).toLowerCase() === '.png')
  .map(f => join(PUBLIC_DIR, f))

console.log(`Convertendo ${PNGs.length} PNGs para WebP...\n`)

let totalBefore = 0
let totalAfter = 0

for (const src of PNGs) {
  const dest = src.replace(/\.png$/i, '.webp')
  const name = basename(src)

  const before = statSync(src).size
  await sharp(src)
    .webp({ quality: 82, effort: 6 })
    .toFile(dest)
  const after = statSync(dest).size

  totalBefore += before
  totalAfter += after

  const saved = (((before - after) / before) * 100).toFixed(0)
  console.log(`  ${name} → ${basename(dest)}   ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB  (-${saved}%)`)
}

console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(2)}MB → ${(totalAfter/1024/1024).toFixed(2)}MB  (-${(((totalBefore-totalAfter)/totalBefore)*100).toFixed(0)}%)`)
