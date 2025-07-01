# Article Frontend Practice

## 專案簡介

這是一個部落格網站的前端專案，使用 React 開發，並與後端 API (`article-practice`) 整合。此專案提供文章的瀏覽、創建、編輯、刪除，以及評論功能。

## 功能列表

- **文章管理**
  - 瀏覽文章列表
  - 查看文章詳細內容
  - 新增文章
  - 編輯文章
  - 刪除文章
- **評論管理**
  - 新增評論
  - 刪除評論
- **使用者管理**
  - 使用者登入
  - 使用者註冊

## 技術棧

- **前端框架**: React
- **狀態管理**: React Hooks
- **HTTP 客戶端**: Axios
- **路由管理**: React Router
- **樣式**: CSS 或其他樣式庫（可選）

## 安裝與使用

### 1. 複製專案

```bash
git clone https://github.com/cczzHoward/article-frontend-practice.git
cd article-frontend-practice
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 啟動開發伺服器

```bash
npm start
```

開發伺服器將在 `http://localhost:3000` 啟動。

### 4. 配置後端 API

確保後端 API (`article-practice`) 已啟動，並在 `src/api.js` 中設置正確的 API 基本 URL。

## 文件結構

```plaintext
article-frontend-practice/
├── public/                # 靜態文件
├── src/
│   ├── components/        # React 元件
│   ├── pages/             # 頁面
│   ├── api.js             # API 配置
│   ├── App.js             # 主應用
│   ├── index.js           # 入口文件
├── package.json           # 項目配置
├── README.md              # 專案說明文件
```

## 後端 API 文件

請參考後端專案 `article-practice` 的 README 文件以了解 API 的詳細使用方式。

## 貢獻指南

1. Fork 此專案
2. 建立新分支 (`git checkout -b feature/your-feature`)
3. 提交更改 (`git commit -m 'Add some feature'`)
4. 推送到分支 (`git push origin feature/your-feature`)
5. 發送 Pull Request
