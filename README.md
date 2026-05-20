# 郑舒予个人求职主页

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/wheezing0324/zsy-portfolio)

这是一个用于 AI / B 端产品经理实习求职展示的个人主页，包含：

- 双语个人主页
- 三个 Vibe Coding 小产品
- 三份美化版 PRD
- Node.js 后端 API 交互

## 本地运行

```bash
npm start
```

然后访问：

```text
http://127.0.0.1:4173
```

## Render 部署

项目已包含 `render.yaml`。在 Render 中创建 Web Service 后使用：

- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variable: `HOST=0.0.0.0`

详细步骤见 `DEPLOY.md`。

## Cloudflare Pages 部署

如果 Render 要求绑卡，可以使用 Cloudflare Pages。项目已包含 `functions/` 目录，Cloudflare Pages 会自动把它部署为 `/api/*` 接口。

详细步骤见 `CLOUDFLARE.md`。
