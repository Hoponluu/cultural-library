# Thư viện sách khảo cứu văn hoá

Web app hiển thị và quản lý các đầu sách khảo cứu văn hoá, xây bằng Next.js (App Router), dữ liệu lưu trên Supabase (Postgres + Storage), deploy trên Vercel.

## Tính năng

- **Trang public** (`/`): grid thumbnail sách (tên + tác giả), filter theo nhiều category, click vào sách để xem chi tiết (NXB, mô tả, category, link mua/đọc).
- **Trang admin** (`/ChatVietCMS`, có bảo vệ bằng mật khẩu):
  - Thêm / sửa / xoá sách, upload ảnh bìa.
  - Thêm / xoá category (xoá category sẽ tự gỡ khỏi các sách đang gán).
  - Export toàn bộ dữ liệu ra CSV.
  - Import hàng loạt từ CSV (tự tạo category mới nếu chưa có; nếu cột `id` khớp sách đã có sẽ cập nhật thay vì tạo mới).
  - **Cài đặt** (`/ChatVietCMS/settings`): upload/thay/xoá ảnh header hiển thị ở đầu trang public.

Admin thao tác trực tiếp trên bản deploy ở Vercel — dữ liệu ghi thẳng vào Supabase nên **không cần** workflow sửa local rồi deploy lại.

## Kiến trúc lưu trữ

- Sách + category: bảng Postgres (`books`, `categories`) trên Supabase.
- Cấu hình trang (ảnh header): bảng `site_settings` (luôn chỉ có 1 dòng `default`).
- Ảnh bìa sách: Supabase Storage, bucket `covers` (public).
- Ảnh giao diện trang (header...): Supabase Storage, bucket `site-assets` (public).
- Không dùng filesystem cục bộ nữa — phù hợp để chạy trên môi trường serverless như Vercel (filesystem ở đó read-only/ephemeral).

Ứng dụng chỉ dùng **service role key** của Supabase, luôn gọi ở phía server (route handlers/server components), không bao giờ lộ ra client — nên không cần bật Row Level Security cho các bảng.

## Setup Supabase (làm 1 lần)

1. Tạo project mới tại [supabase.com](https://supabase.com) (free tier).
2. Vào **SQL Editor** → New query → dán toàn bộ nội dung file [`supabase/schema.sql`](./supabase/schema.sql) → Run. File này tạo bảng `books`, `categories`, `site_settings`, function `remove_category_from_books`, và 2 storage bucket `covers`, `site-assets` (đều public). File chạy lại nhiều lần vẫn an toàn (idempotent) — nếu project của bạn đã setup từ trước, chạy lại file này để có thêm phần `site_settings`/`site-assets`.
3. Vào **Project Settings → API**, lấy:
   - `Project URL` → dùng làm `SUPABASE_URL`.
   - `service_role` key (mục "Project API keys", **không phải** `anon` key) → dùng làm `SUPABASE_SERVICE_ROLE_KEY`. Key này có toàn quyền ghi, tuyệt đối không để lộ ra frontend/client.
4. (Tuỳ chọn) Đưa dữ liệu sách mẫu có sẵn trong `data/*.json` vào Supabase:
   ```bash
   npm run seed
   ```

## Cài đặt & chạy local

1. Cài dependencies:

   ```bash
   npm install
   ```

2. Tạo file `.env.local` từ mẫu:

   ```bash
   cp .env.example .env.local
   ```

   Điền:
   - `ADMIN_PASSWORD`: mật khẩu đăng nhập `/ChatVietCMS`.
   - `SESSION_SECRET`: chuỗi bí mật bất kỳ, dùng để ký session cookie.
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: lấy từ bước Setup Supabase ở trên.

3. Chạy dev server:

   ```bash
   npm run dev
   ```

   Mở [http://localhost:3000](http://localhost:3000) cho trang public, [http://localhost:3000/ChatVietCMS](http://localhost:3000/ChatVietCMS) cho trang quản trị.

## Deploy lên Vercel

1. Import repo này vào Vercel (New Project → chọn repo).
2. Ở bước cấu hình project (hoặc sau đó trong **Project Settings → Environment Variables**), thêm 4 biến môi trường giống `.env.local`: `ADMIN_PASSWORD`, `SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
3. Deploy. Trang public và `/ChatVietCMS` hoạt động ngay, đọc/ghi trực tiếp vào Supabase.

Không cần cấu hình gì thêm cho ảnh — thumbnail upload từ admin sẽ lưu vào Supabase Storage và trả về URL public, hiển thị được ngay trên trang cả ở local lẫn trên Vercel.

## Build production (chạy local để kiểm tra trước khi deploy)

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
| `thumbnail` | URL ảnh bìa (Supabase Storage) |
| `description` | Mô tả ngắn |
| `link` | Link mua/đọc sách |
| `categoryIds` | Danh sách id category (nhiều category cho 1 cuốn sách) |

## Format CSV import/export

Cột: `id, title, author, publisher, thumbnail, description, link, categories`

- `categories`: tên các category, cách nhau bằng dấu chấm phẩy `;` (vd: `Lịch sử; Mỹ thuật`). Category chưa tồn tại sẽ được tự động tạo.
- `id`: để trống khi thêm sách mới; nếu điền đúng id của sách đã có (lấy từ file export), import sẽ **cập nhật** sách đó thay vì tạo bản mới — tiện cho việc sửa hàng loạt qua CSV.
