# Cloudflare Pages 部署说明

Render 如果要求绑卡，可以改用 Cloudflare Pages。Cloudflare Pages 免费计划可用于静态站点，Pages Functions 可承载本项目的 `/api/*` 接口。

## 部署步骤

1. 打开 Cloudflare Dashboard。
2. 进入 `Workers & Pages`。
3. 选择 `Create` -> `Pages`。
4. 选择 `Connect to Git`。
5. 授权 GitHub 并选择仓库：

```text
wheezing0324/zsy-portfolio
```

6. 构建配置：

```text
Framework preset: None
Build command: 留空
Build output directory: /
Root directory: /
```

7. 点击部署。

## 接口说明

Cloudflare Pages 会自动识别 `functions/` 目录。本项目已提供：

- `/api/profile`
- `/api/contact`
- `/api/prd`
- `/api/prd/feedback`
- `/api/prd/acceptance`
- `/api/dashboard`
- `/api/dashboard/followup`
- `/api/acceptance`
- `/api/acceptance/check`
- `/api/acceptance/feedback`

## 数据持久化说明

当前 API 使用内存数据，适合作品集演示。Cloudflare 的运行环境可能在不同请求之间重启，因此不要把它当作长期数据库。如果后续要真正收集联系信息，可以接 Cloudflare D1 或 KV。
