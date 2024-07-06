#Hướng dẫn chạy backup

Từ dữ liệu thô (sql) chuyển sang JSON

```bash
npm start
```

Từ data JSON thô chuyển sang [Sản phẩm, Danh mục, Nhóm]

```bash
npm run ct
```

Làm cả 2 việc cùng một lúc chạy

```bash
npm run sct
```

## Cầu cấu hình biến .env trước khi chạy lệnh dưới

Đồng bộ sản phẩm lên server

```bash
npm run lgprd
```

Đồng bộ danh mục lên server

```bash
npm run lgctapi
```

Đồng bộ nhóm lên server

```bash
npm run lggp
```

## Cầu chạy cuối cùng

Đồng bộ bài viết lên server

```bash
npm run lgpsapi
```

Làm tất cả công việc trên

```bash
npm run asynapi
```

Làm tất cả công việc từ data ---> đồng bộ data lên server

```bash
npm run backup
```
