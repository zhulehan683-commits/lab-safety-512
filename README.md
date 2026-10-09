# 实验室安全题库（512题）

静态网页，可直接部署到 GitHub Pages，无需安装依赖或构建。

## 页面
- `index.html`：题库浏览、搜索、按题型筛选、掌握标记。
- `practice.html`：顺序/随机练习、错题练习。

## GitHub Pages
将本目录文件上传到仓库根目录。在 Settings → Pages 选择 Deploy from a branch，分支 main，目录 / (root)，保存。
访问 https://<用户名>.github.io/<仓库名>/。

保留 `.nojekyll` 文件。页面和脚本均使用相对路径，支持仓库子路径。

## 本地预览
在目录执行 `python -m http.server 8000`，打开 http://localhost:8000/。

## 学习记录
掌握标记和错题记录保存在浏览器 localStorage 中。迁移到新域名后原网站学习记录不会自动转移；原网站仍可访问其原有记录。

源站：https://lab-safety-512.navyguppy4.chatgpt.site
