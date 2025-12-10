# 第一階段：建置 React 應用程式
FROM node:20-alpine AS builder

WORKDIR /app

# 先複製 package 檔案以利用 Docker 快取機制
COPY package.json package-lock.json ./

# 安裝依賴套件
RUN npm ci

# 複製其餘的應用程式程式碼
COPY . .

# 建置應用程式
RUN npm run build

# 第二階段：使用 Nginx 服務應用程式
FROM nginx:alpine

# 從 builder 階段複製建置好的檔案
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製自定義的 Nginx 設定檔
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 port
EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]
