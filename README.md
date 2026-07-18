# Thư viện sách khảo cứu văn hoá

Web app hiển thị và quản lý các đầu sách khảo cứu văn hoá, xây bằng Next.js (App Router).

## Tính năng

- **Trang public** (`/`): grid thumbnail sách (tên + tác giả), filter theo nhiều category, click vào sách để xem chi tiết (NXB, mô tả, category, link mua/đọc).
- **Trang admin** (`/ChatVietCMS`, có bảo vệ bằng mật khẩu):
  - Thêm / sửa / xoá sách, upload ảnh bìa.
  - Thêm / xoá category (xoá category sẽ tự gỡ khỏi các sách đang gán).
  - Export toàn bộ dữ liệu ra CSV.
  - Import hàng loạt từ CSV (tự tạo category mới nếu chưa có; nếu cột `id` khớp sách đã có sẽ cập nhật thay vì tạo mới).

## Cách lưu trữ dữ liệu

Dữ liệu được lưu dạng file JSON trong thư mục `data/` (`books.json`, `categories.json`), không dùng database. Ảnh bìa upload được lưu trong `public/uploads/`.

**Lưu ý quan trọng khi deploy lên Vercel/Netlify:** các nền tảng serverless này có filesystem chỉ đọc (read-only) ở production — mọi thao tác ghi từ trang admin (thêm/sửa/xoá sách, upload ảnh) sẽ **không được lưu lại lâu dài** giữa các lần deploy hoặc giữa các instance khác nhau.

Vì vậy, workflow đề xuất là:

1. Chạy `npm run dev` **ở local** để vào `/ChatVietCMS` thêm/sửa sách, upload ảnh — các thay đổi được ghi trực tiếp vào `data/*.json` và `public/uploads/`.
2. `git add` + `git commit` các thay đổi đó (bao gồm cả ảnh upload).
3. Deploy/redeploy lên Vercel/Netlify — trang public (`/`) được build tĩnh từ dữ liệu đã commit.

Nếu sau này cần admin thao tác trực tiếp trên môi trường production, nên chuyển `data/db.ts` sang một database thật (Postgres, SQLite qua Turso, v.v.) và lưu ảnh lên một object storage (S3, Vercel Blob...).

## Cài đặt & chạy local

1. Cài dependencies:

   ```bash
   npm install
   ```

2. Tạo file `.env.local` từ mẫu và đặt mật khẩu admin:

   ```bash
   cp .env.example .env.local
   ```

   Sửa `ADMIN_PASSWORD` (mật khẩu đăng nhập `/ChatVietCMS`) và `SESSION_SECRET` (chuỗi bí mật bất kỳ, dùng để ký session cookie) trong `.env.local`.

3. Chạy dev server:

   ```bash
   npm run dev
   ```

   Mở [http://localhost:3000](http://localhost:3000) cho trang public, [http://localhost:3000/ChatVietCMS](http://localhost:3000/ChatVietCMS) cho trang quản trị.

## Build production

```bash
npm run build
npm run start
```

## Cấu trúc dữ liệu sách

| Trường | Mô tả |
| --- | --- |
| `title` | Tên sách |
| `author` | Tác giả |
| `publisher` | Nhà xuất bản |
| `thumbnail` | Đường dẫn ảnh bìa (`/uploads/...`) |
| `description` | Mô tả ngắn |
| `link` | Link mua/đọc sách |
| `categoryIds` | Danh sách id category (nhiều category cho 1 cuốn sách) |

## Format CSV import/export

Cột: `id, title, author, publisher, thumbnail, description, link, categories`

- `categories`: tên các category, cách nhau bằng dấu chấm phẩy `;` (vd: `Lịch sử; Mỹ thuật`). Category chưa tồn tại sẽ được tự động tạo.
- `id`: để trống khi thêm sách mới; nếu điền đúng id của sách đã có (lấy từ file export), import sẽ **cập nhật** sách đó thay vì tạo bản mới — tiện cho việc sửa hàng loạt qua CSV.
