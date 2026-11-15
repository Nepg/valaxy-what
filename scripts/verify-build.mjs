// process.exit(0)
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const output = new URL('../demo/dist/', import.meta.url)
const home = await readFile(new URL('index.html', output), 'utf8')
const article = await readFile(new URL('posts/reading-at-the-edge.html', output), 'utf8')
const notFound = await readFile(new URL('404.html', output), 'utf8')
assert.match(notFound, /这份记录尚未抵达/)
const archive = await readFile(new URL('archives.html', output), 'utf8')
assert.match(home, /边境手记/)
assert.match(home, /ark-post-row/)
assert.match(archive, /让小工具成为日常的一部分/)
assert.match(article, /让颜色有职责/)
assert.match(article, /<table/)
assert.match(article, /<pre/)
assert.doesNotMatch(home, /尚未完成的观察/)
await assert.rejects(access(new URL('posts/draft.html', output)))
console.log(`Verified prerendered home, archive, article and draft exclusion in ${fileURLToPath(output)}`)
