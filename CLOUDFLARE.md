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
- `/api/content`

## 数据持久化说明

当前 API 使用内存数据，适合作品集演示。Cloudflare 的运行环境可能在不同请求之间重启，因此不要把它当作长期数据库。如果后续要真正收集联系信息，可以接 Cloudflare D1 或 KV。

## 让首页编辑内容同步到所有浏览器

首页编辑模式会调用 `/api/content`。要让修改后的文案被其他浏览器同步看到，需要在 Cloudflare Pages 里配置 KV：

1. 打开 Cloudflare Dashboard。
2. 进入 `Workers & Pages` -> `KV`，新建一个 namespace，例如 `zsy_portfolio_content`。
3. 回到 Pages 项目 `zsy-portfolio`。
4. 进入 `Settings` -> `Functions` -> `KV namespace bindings`。
5. 添加 binding：

```text
Variable name: PORTFOLIO_CONTENT
KV namespace: zsy_portfolio_content
```

6. 发布密码默认是 `zsy2026`。如果想以后换密码，可以进入 `Settings` -> `Environment variables`，添加：

```text
Variable name: CONTENT_ADMIN_PIN
Value: 自己设置的新密码，例如 6-12 位数字或字母
```

7. 重新部署一次 Cloudflare Pages。

配置完成后，打开 `https://zsy-portfolio.pages.dev/?edit=1`，点击「保存并同步」，输入 `zsy2026`，刷新其他浏览器即可看到同步后的内容。
