// 简单的 Node/Express 服务：提供静态前端 + devlog API
// 使用说明：
// 1. 本地开发：仍然使用 `npm run dev` (vite)，不用启动此服务。
// 2. 生产部署：先 `npm run build`，然后在服务器上运行 `node server.js`。

import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'

const __dirname = path.resolve()
const app = express()
app.use(cors())
app.use(express.json())

// 我们将日志和其他文档文件放在 public/docs 目录下，方便在开发和构建后都能访问
const DOC_DIR = path.resolve(__dirname, 'public', 'docs')
const LOG_PATH = path.join(DOC_DIR, 'devlog.md')

// 启动时输出路径信息，方便调试
console.log('=== 服务器启动信息 ===')
console.log('__dirname:', __dirname)
console.log('DOC_DIR:', DOC_DIR)
console.log('LOG_PATH:', LOG_PATH)
console.log('public/docs 目录存在:', fs.existsSync(DOC_DIR))
console.log('devlog.md 文件存在:', fs.existsSync(LOG_PATH))
if (fs.existsSync(LOG_PATH)) {
  const stats = fs.statSync(LOG_PATH)
  console.log('devlog.md 文件大小:', stats.size, 'bytes')
}
console.log('========================')

// 确保 docs 目录存在并包含基础文件
if (!fs.existsSync(DOC_DIR)) {
  console.log('创建 public/docs 目录...')
  fs.mkdirSync(DOC_DIR, { recursive: true })
}
if (!fs.existsSync(LOG_PATH)) {
  console.log('创建 devlog.md 文件...')
  fs.writeFileSync(LOG_PATH, '# 开发日志\n\n', 'utf8')
}
// 其他文档如项目说明等可由管理员在后台创建编辑

// 日志中间件，用于调试
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// API路由 - 必须在静态文件服务之前
// GET: 返回当前 devlog 文件内容（追加接口依旧可用）
app.get('/api/devlog', (req, res) => {
  console.log('处理 /api/devlog 请求')
  console.log('LOG_PATH:', LOG_PATH)
  console.log('文件是否存在:', fs.existsSync(LOG_PATH))
  
  if (!fs.existsSync(LOG_PATH)) {
    console.log('文件不存在，返回空内容')
    return res.type('text/plain').send('# 开发日志\n\n')
  }
  
  try {
    const content = fs.readFileSync(LOG_PATH, 'utf8')
    console.log('文件内容长度:', content.length)
    console.log('文件内容预览:', content.substring(0, 100))
    return res.type('text/plain').send(content)
  } catch (error) {
    console.error('读取文件失败:', error)
    return res.status(500).json({ error: 'read_failed' })
  }
})

// POST: 追加新日志条目，body: { text: '...' }
// 该接口用于客户端快速提交新条目，后台管理页面将通过通用 docs API 修改整个文件。
app.post('/api/devlog', (req, res) => {
  console.log('处理 /api/devlog POST 请求')
  const { text } = req.body || {}
  if (!text || !text.trim()) return res.status(400).json({ error: 'empty' })

  const date = new Date().toISOString().slice(0, 10)
  const entry = `\n## ${date}\n${text.trim()}\n`

  try {
    fs.appendFileSync(LOG_PATH, entry, 'utf8')
    return res.json({ ok: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'write_failed' })
  }
})

// 专用接口：返回项目说明文本，服务器端将把多个 BSL-* 文件拼接，便于前端统一展示
app.get('/api/project-info', (req, res) => {
  console.log('处理 /api/project-info 请求')
  const files = ['BSL-README.md', 'BSL-FEATURES.md', 'BSL-ISSUES.md']
  let out = ''
  for (const f of files) {
    const p = path.join(DOC_DIR, f)
    if (fs.existsSync(p)) {
      out += fs.readFileSync(p, 'utf8') + '\n\n'
    }
  }
  res.type('text/plain').send(out)
})

// 通用 docs API：列出、读取、写入指定文档（仅限 docs 目录）
app.get('/api/docs/list', (req, res) => {
  console.log('处理 /api/docs/list 请求')
  fs.readdir(DOC_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: 'read_failed' })
    return res.json({ files })
  })
})

app.get('/api/docs/:name', (req, res) => {
  console.log(`处理 /api/docs/${req.params.name} 请求`)
  const name = req.params.name
  if (!/^[\w.-]+$/.test(name)) return res.status(400).json({ error: 'invalid_name' })
  const p = path.join(DOC_DIR, name)
  if (!p.startsWith(DOC_DIR)) return res.status(400).json({ error: 'invalid_path' })
  if (!fs.existsSync(p)) return res.status(404).json({ error: 'not_found' })
  return res.sendFile(p)
})
app.post('/api/docs/:name', (req, res) => {
  console.log(`处理 /api/docs/${req.params.name} POST 请求`)
  const name = req.params.name
  const { content } = req.body || {}
  if (!/^[\w.-]+$/.test(name)) return res.status(400).json({ error: 'invalid_name' })
  if (typeof content !== 'string') return res.status(400).json({ error: 'invalid_content' })
  const p = path.join(DOC_DIR, name)
  if (!p.startsWith(DOC_DIR)) return res.status(400).json({ error: 'invalid_path' })
  try {
    fs.writeFileSync(p, content, 'utf8')
    return res.json({ ok: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'write_failed' })
  }
})

// 在生产时，`dist` 是 vite build 输出目录，我们把它作为静态文件根
console.log('设置静态文件服务')
app.use(express.static(path.join(__dirname, 'dist')))

// 确保 public/docs 目录也被静态文件服务包含（用于直接访问文件）
app.use('/public', express.static(path.join(__dirname, 'public')))

// SPA 回退：只处理 GET 请求，API 请求不处理
app.get('*', (req, res, next) => {
  // 如果是 API 路径，继续到下一个路由（会返回 404）
  if (req.url.startsWith('/api/')) {
    console.log(`API 路径未找到：${req.url}`)
    return next()
  }
  // 否则返回 index.html
  console.log(`处理 SPA 回退：${req.url}`)
  const index = path.join(__dirname, 'dist', 'index.html')
  if (fs.existsSync(index)) {
    return res.sendFile(index)
  }
  next()
})

// 处理所有未匹配的 API 请求，返回 JSON 错误
app.use('/api/*', (req, res) => {
  console.log(`API 未找到：${req.method} ${req.url}`)
  res.status(404).json({ error: 'not_found', message: `API endpoint not found: ${req.url}` })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`server listening on ${port}`))
