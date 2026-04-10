import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve()
const MD_PATH = path.join(__dirname, 'public', 'docs', '网站设计方案.md')
const PDF_PATH = path.join(__dirname, 'public', 'docs', '网站设计方案.pdf')

// 读取 Markdown 文件
const markdownContent = fs.readFileSync(MD_PATH, 'utf8')

// 创建 PDF 文档
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 72, bottom: 72, left: 72, right: 72 },
  bufferPages: true,
})

// 创建写入流
const stream = fs.createWriteStream(PDF_PATH)
doc.pipe(stream)

// 设置字体
doc.font('Helvetica')

// 解析 Markdown 并转换为 PDF
function parseMarkdownToPDF(markdown) {
  const lines = markdown.split('\n')
  let y = doc.y
  const pageHeight = doc.page.height - 144 // 减去上下边距
  const pageWidth = doc.page.width - 144 // 减去左右边距
  
  // 添加标题
  doc.fontSize(24)
    .font('Helvetica-Bold')
    .fillColor('#2d3748')
    .text('PhuketCore 网站设计方案', { align: 'center' })
    .moveDown(1)
  
  doc.fontSize(10)
    .font('Helvetica')
    .fillColor('#64748b')
    .text('文档版本: 1.0 | 创建日期: 2026-03-03 | 最后更新: 2026-03-03', { align: 'center' })
    .moveDown(2)
  
  y = doc.y
  
  for (const line of lines) {
    // 检查是否需要新页面
    if (y > pageHeight) {
      doc.addPage()
      y = 72
    }
    
    if (line.trim() === '') {
      // 空行
      y += 12
      doc.y = y
    } else if (line.startsWith('# ')) {
      // 一级标题
      const text = line.substring(2).trim()
      doc.fontSize(20)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text(text, { continued: false })
        .moveDown(0.5)
      
      // 添加下划线
      const lineWidth = doc.widthOfString(text)
      doc.moveTo(72, doc.y - 5)
        .lineTo(72 + lineWidth, doc.y - 5)
        .lineWidth(1)
        .strokeColor('#3b82f6')
        .stroke()
        .moveDown(0.5)
      
      y = doc.y + 20
    } else if (line.startsWith('## ')) {
      // 二级标题
      const text = line.substring(3).trim()
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#1e293b')
        .text(text)
        .moveDown(0.8)
      y = doc.y + 16
    } else if (line.startsWith('### ')) {
      // 三级标题
      const text = line.substring(4).trim()
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#334155')
        .text(text)
        .moveDown(0.6)
      y = doc.y + 14
    } else if (line.startsWith('#### ')) {
      // 四级标题
      const text = line.substring(5).trim()
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#475569')
        .text(text)
        .moveDown(0.4)
      y = doc.y + 12
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // 无序列表
      const text = line.substring(2).trim()
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#64748b')
        .text('• ' + text, { indent: 20 })
        .moveDown(0.3)
      y = doc.y + 8
    } else if (line.match(/^\d+\./)) {
      // 有序列表
      const match = line.match(/^(\d+)\.\s+(.*)/)
      if (match) {
        doc.fontSize(11)
          .font('Helvetica')
          .fillColor('#64748b')
          .text(match[1] + '. ' + match[2], { indent: 20 })
          .moveDown(0.3)
        y = doc.y + 8
      }
    } else if (line.startsWith('|')) {
      // 表格行（简化处理）
      if (line.includes('---')) {
        y += 8
        doc.y = y
        continue
      }
      const cells = line.split('|').filter(c => c.trim() !== '')
      if (cells.length > 0) {
        doc.fontSize(10)
          .font('Helvetica')
          .fillColor('#64748b')
          .text(cells.join(' | '))
          .moveDown(0.2)
        y = doc.y + 6
      }
    } else if (line.startsWith('```')) {
      // 代码块标记
      continue
    } else if (line.startsWith('**') && line.endsWith('**')) {
      // 粗体文本
      const text = line.substring(2, line.length - 2)
      doc.fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#64748b')
        .text(text)
        .moveDown(0.3)
      y = doc.y + 8
    } else {
      // 普通段落
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#64748b')
        .text(line.trim(), { lineGap: 4 })
        .moveDown(0.3)
      y = doc.y + 8
    }
  }
}

// 生成 PDF 内容
parseMarkdownToPDF(markdownContent)

// 完成 PDF 生成
doc.end()

stream.on('finish', () => {
  console.log(`✅ PDF 文件已生成: ${PDF_PATH}`)
})

stream.on('error', (err) => {
  console.error('❌ 生成 PDF 文件失败:', err)
})
