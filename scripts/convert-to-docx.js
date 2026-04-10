import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx'
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve()
const MD_PATH = path.join(__dirname, 'public', 'docs', '网站设计方案.md')
const DOCX_PATH = path.join(__dirname, 'public', 'docs', '网站设计方案.docx')

// 读取 Markdown 文件
const markdownContent = fs.readFileSync(MD_PATH, 'utf8')

// 解析 Markdown 并转换为 docx 段落
function parseMarkdownToDocx(markdown) {
  const lines = markdown.split('\n')
  const paragraphs = []
  
  for (const line of lines) {
    if (line.trim() === '') {
      // 空行
      paragraphs.push(new Paragraph({ text: '' }))
    } else if (line.startsWith('# ')) {
      // 一级标题
      const text = line.substring(2).trim()
      paragraphs.push(new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 },
        border: {
          bottom: {
            color: '3B82F6',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }))
    } else if (line.startsWith('## ')) {
      // 二级标题
      const text = line.substring(3).trim()
      paragraphs.push(new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }))
    } else if (line.startsWith('### ')) {
      // 三级标题
      const text = line.substring(4).trim()
      paragraphs.push(new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 160, after: 80 },
      }))
    } else if (line.startsWith('#### ')) {
      // 四级标题
      const text = line.substring(5).trim()
      paragraphs.push(new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_4,
        spacing: { before: 120, after: 60 },
      }))
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // 无序列表
      const text = line.substring(2).trim()
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({
            text: '• ',
            bold: true,
            color: '3B82F6',
          }),
          new TextRun(text),
        ],
        spacing: { before: 60, after: 60 },
        indent: { left: 720 },
      }))
    } else if (line.match(/^\d+\./)) {
      // 有序列表
      const match = line.match(/^(\d+)\.\s+(.*)/)
      if (match) {
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: match[1] + '. ',
              bold: true,
              color: '3B82F6',
            }),
            new TextRun(match[2]),
          ],
          spacing: { before: 60, after: 60 },
          indent: { left: 720 },
        }))
      }
    } else if (line.startsWith('|')) {
      // 表格行（简化处理，只显示文本）
      if (line.includes('---')) continue // 跳过表格分隔线
      const cells = line.split('|').filter(c => c.trim() !== '')
      if (cells.length > 0) {
        const rowText = cells.join(' | ')
        paragraphs.push(new Paragraph({
          text: rowText,
          spacing: { before: 40, after: 40 },
        }))
      }
    } else if (line.startsWith('```')) {
      // 代码块开始/结束标记
      continue
    } else if (line.startsWith('**') && line.endsWith('**')) {
      // 粗体文本
      const text = line.substring(2, line.length - 2)
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: text, bold: true })],
        spacing: { before: 60, after: 60 },
      }))
    } else {
      // 普通段落
      paragraphs.push(new Paragraph({
        text: line.trim(),
        spacing: { before: 60, after: 60 },
        lineSpacing: 360, // 1.5 倍行距
      }))
    }
  }
  
  return paragraphs
}

// 创建文档
const doc = new Document({
  sections: [
    {
      properties: {},
      children: parseMarkdownToDocx(markdownContent),
    },
  ],
})

// 生成并保存 docx 文件
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(DOCX_PATH, buffer)
  console.log(`✅ DOCX 文件已生成: ${DOCX_PATH}`)
}).catch(err => {
  console.error('❌ 生成 DOCX 文件失败:', err)
})
