# PhuketCore 部署指南

## 部署步骤

### 1. 本地构建

```bash
# 安装依赖
npm install

# 构建前端
npm run build
```

构建完成后，会生成 `dist/` 目录。

### 2. 上传到服务器

需要上传以下文件和目录到服务器：

```
phuketcore/
├── dist/              # 前端构建文件（必须）
├── public/            # 文档目录（必须，包含 docs 子目录）
│   └── docs/
│       ├── devlog.md
│       └── 其他文档...
├── server.js          # 服务器文件（必须）
├── package.json       # 项目配置（必须）
└── node_modules/      # 依赖（可选，可在服务器上安装）
```

**重要：** 确保 `public/docs/devlog.md` 文件存在且有内容！

### 3. 在服务器上安装依赖

```bash
cd /path/to/phuketcore

# 安装生产依赖
npm install --production

# 或者安装所有依赖
npm install
```

### 4. 创建/验证 docs 目录

```bash
# 检查目录是否存在
ls -la public/docs/

# 如果不存在，创建目录和文件
mkdir -p public/docs

# 创建 devlog.md 文件
cat > public/docs/devlog.md << 'EOF'
# 开发日志

## 2026-03-03
这是第一条开发日志。

EOF

# 验证文件
cat public/docs/devlog.md
```

### 5. 启动服务器

**方法 1：直接启动**
```bash
node server.js
```

**方法 2：使用 PM2（推荐）**
```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name phuketcore

# 查看状态
pm2 status

# 查看日志
pm2 logs phuketcore

# 设置开机自启
pm2 startup
pm2 save
```

### 6. 验证部署

**检查服务器日志：**
```bash
# 应该看到类似输出
=== 服务器启动信息 ===
__dirname: /path/to/phuketcore
DOC_DIR: /path/to/phuketcore/public/docs
LOG_PATH: /path/to/phuketcore/public/docs/devlog.md
public/docs 目录存在：true
devlog.md 文件存在：true
devlog.md 文件大小：XXX bytes
========================
设置静态文件服务
server listening on 3000
```

**测试 API：**
```bash
# 测试开发日志 API
curl http://localhost:3000/api/devlog

# 应该返回 Markdown 内容
```

**访问网站：**
- 首页：http://your-domain.com
- 开发日志：http://your-domain.com/dlog
- 后台管理：http://your-domain.com/admin

## 常见问题

### 问题 1：API 返回 404

**症状：** 访问 `/api/devlog` 返回 404 错误

**原因：** `public/docs/devlog.md` 文件不存在

**解决：**
```bash
# 检查文件是否存在
ls -la public/docs/devlog.md

# 如果不存在，创建文件
mkdir -p public/docs
echo "# 开发日志\n\n" > public/docs/devlog.md

# 重启服务器
pm2 restart phuketcore
```

### 问题 2：POST 请求返回 HTML

**症状：** POST `/api/devlog` 返回 `<!DOCTYPE html>` 而不是 JSON

**原因：** API 路由没有被正确匹配，被 SPA 回退拦截

**解决：** 确保服务器代码中 API 路由在 SPA 回退之前定义（已修复）

### 问题 3：文件权限错误

**症状：** 保存日志时报错 `write_failed` 或 `EACCES`

**原因：** Node.js 进程没有写入 `public/docs` 目录的权限

**解决：**
```bash
# 修改目录权限
chmod -R 755 public/docs

# 或者修改所有者（如果使用特定用户运行）
chown -R node:node public/docs
```

### 问题 4：构建后页面空白

**症状：** 访问网站显示空白页面

**原因：** 
1. `dist/` 目录没有正确上传
2. 静态文件路径配置错误

**解决：**
```bash
# 重新构建
npm run build

# 检查 dist 目录
ls -la dist/

# 重新上传到服务器
```

## 更新部署

### 只更新前端代码

```bash
# 本地构建
npm run build

# 上传 dist 目录到服务器
scp -r dist/* user@server:/path/to/phuketcore/dist/

# 重启服务器（可选，静态文件更新通常不需要重启）
pm2 restart phuketcore
```

### 只更新后端代码

```bash
# 上传 server.js 到服务器
scp server.js user@server:/path/to/phuketcore/

# 重启服务器
pm2 restart phuketcore
```

### 完整更新

```bash
# 拉取最新代码
git pull origin main

# 安装依赖（如果有更新）
npm install

# 重新构建
npm run build

# 重启服务
pm2 restart phuketcore
```

## 服务器配置建议

### 使用 Nginx 反向代理（可选）

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 使用 HTTPS（推荐）

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

## 监控和维护

### 查看日志

```bash
# PM2 日志
pm2 logs phuketcore

# 或者查看实时日志
pm2 logs phuketcore --lines 100 --nostream
```

### 性能监控

```bash
# 查看应用状态
pm2 status

# 查看详细信息
pm2 show phuketcore

# 监控 CPU 和内存
pm2 monit
```

### 备份数据

```bash
# 备份文档目录
tar -czf docs-backup-$(date +%Y%m%d).tar.gz public/docs/

# 定期备份（添加到 crontab）
0 2 * * * tar -czf /backup/docs-$(date +\%Y\%m\%d).tar.gz /path/to/phuketcore/public/docs/
```

## 故障排除

### 调试模式

```bash
# 以调试模式启动
NODE_ENV=development node server.js

# 查看详细日志
pm2 logs phuketcore --debug
```

### 重置应用

```bash
# 停止应用
pm2 stop phuketcore

# 删除应用
pm2 delete phuketcore

# 重新启动
pm2 start server.js --name phuketcore
```

### 检查端口占用

```bash
# 查看 3000 端口占用
lsof -i :3000

# 或者
netstat -tulpn | grep 3000

# 如果端口被占用，杀死进程
kill -9 <PID>

# 或者修改 server.js 中的端口
const port = process.env.PORT || 3001
```

---

**最后更新：** 2026-03-03  
**版本：** 1.0
