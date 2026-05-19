# 个人主页部署说明

这个项目是一个 Node 静态站点 + 本地 API 服务，包含个人主页、三个 Vibe Coding 作品、PRD 页面和后端交互接口。

## 推荐方式：Render

Render 可以直接运行 `node server.js`，适合保留当前三个作品的后端交互。

### 1. 上传到 GitHub

在 GitHub 新建一个仓库，例如：

`portfolio-zsy`

然后把当前文件夹上传到仓库。需要包含：

- `index.html`
- `server.js`
- `package.json`
- `profile-photo.png`
- `works/`
- `docs/`

### 2. 创建 Render Web Service

1. 打开 Render 控制台。
2. 选择 `New` -> `Web Service`。
3. 连接刚才的 GitHub 仓库。
4. Runtime 选择 `Node`。
5. Build Command 留空或填写：

```bash
npm install
```

6. Start Command 填写：

```bash
npm start
```

### 3. 环境变量

Render 会自动提供 `PORT`。为了让服务能被外部访问，添加：

```bash
HOST=0.0.0.0
```

### 4. 访问地址

部署完成后，Render 会给你一个公开链接，例如：

`https://your-service-name.onrender.com`

别人访问这个链接就能看到你的个人主页。

## 为什么不只用 GitHub Pages

GitHub Pages 只能托管静态页面，不能运行 `server.js`。如果只用 GitHub Pages，主页能打开，但这些后端交互会退回到静态 fallback，无法展示真实 API 写入。

## 当前后端数据说明

当前联系表单、跟进记录、反馈新增等数据都保存在 Node 内存中。服务重启后会清空。这适合作品集演示，但不适合长期收集真实招聘信息。

如果后续要长期保存联系人或反馈，可以再接入：

- Supabase
- Neon PostgreSQL
- MongoDB Atlas
- Airtable

