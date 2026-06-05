# ReviewLoom Dashboard Context (Backend & Frontend)

Tài liệu này đặc tả chi tiết kiến trúc, luồng dữ liệu, cấu trúc database và cách thức tích hợp giữa Backend và Frontend của module Dashboard (Bảng điều khiển quản trị) phục vụ cho các AI agent trong tương lai.

---

## 1. Backend Context (Bối cảnh Backend)

Kiến trúc Backend của ReviewLoom tuân thủ **Clean Architecture** và sử dụng mẫu thiết kế **Repository & Unit of Work** kết hợp linh hoạt giữa **Entity Framework Core** và **Dapper**.

### A. Thực thể & Cơ sở dữ liệu (Database Schema)
Bảng `scans` đã được nâng cấp qua Migration để hỗ trợ lưu trữ trạng thái xử lý góp ý riêng tư:
- `status` (VARCHAR(20), NOT NULL, DEFAULT 'unread'): Nhận các giá trị `unread`, `pending`, `resolved`.
- `reply_message` (TEXT, NULL): Nội dung phản hồi qua email mà chủ cửa hàng gửi cho khách.
- `replied_at` (TIMESTAMP, NULL): Thời điểm gửi phản hồi.

Bảng `subscriptions` ghi nhận trạng thái thanh toán và giới hạn sử dụng gói cước của User.

### B. Tầng Repository (Data Access Layer)
Chúng tôi sử dụng Dapper để thực hiện các truy vấn gộp (aggregate) và lọc tìm kiếm để tối ưu hiệu năng:
1. **ISubscriptionRepository & SubscriptionRepository**: Quản lý truy vấn bảng `subscriptions`. Được đăng ký trong `IUnitOfWork`.
2. **IStatsRepository & StatsRepository**:
   - `GetOverallStatsAsync`: Tính toán tổng số scans, số scans positive, và số scans negative của tất cả chiến dịch thuộc sở hữu của User.
   - `GetScansGrowthAsync`: Truy vấn lịch sử số lượng scans (Tổng, Positive, Negative) theo từng ngày trong 30 ngày gần nhất (sử dụng mệnh đề `GROUP BY DATE(scanned_at)`).
     - *Lưu ý*: PostgreSQL trả về cột ngày kiểu `DATE` ánh xạ thành `DateOnly` trong C#. Chúng tôi đã xử lý ép kiểu an toàn: `r.date is DateOnly dateOnly ? dateOnly.ToDateTime(TimeOnly.MinValue) : (DateTime)r.date`.
   - `GetRecentActivityAsync`: Lấy 10 tương tác (scans) mới nhất của User trên tất cả chiến dịch.
3. **IScanRepository & ScanRepository**:
   - Kế thừa từ generic `IRepository<Scan>` để hỗ trợ thao tác cập nhật trạng thái scan.
   - `GetPrivateFeedbackListAsync`: Lấy danh sách góp ý tiêu cực (`action = 'negative'`), hỗ trợ lọc theo chiến dịch (`campaignId`), trạng thái xử lý (`status`) và tìm kiếm tương đối (`search` khớp với name, email, hoặc message).

### C. Tầng Nghiệp vụ (Application Layer)
Các DTO chính nằm tại `ReviewLoom.Application/DTOs/`:
- `DashboardOverviewDto`: Tổng hợp số liệu thống kê, tăng trưởng và danh sách hoạt động mới.
- `PrivateFeedbackDto`: Dữ liệu hiển thị chi tiết góp ý tiêu cực trong hộp thư.
- `SubscriptionOverviewDto`: Trạng thái gói cước, số lượng campaigns đang dùng (so với limit) và lịch sử subscription.

Các Service chính:
- `DashboardService`: Tính toán phần trăm hài lòng, gọi repository tổng hợp thông tin.
- `InboxService`: Xử lý cập nhật trạng thái góp ý và lưu trữ phản hồi thư.
- `BillingOverviewService`: Đếm số chiến dịch thực tế, lấy thông tin subscription hiện hành và lịch sử.

### D. Tầng API Controllers (ReviewLoom.Api)
Tất cả các API yêu cầu xác thực JWT qua Clerk (`[Authorize]`):
- **`DashboardController`**: `GET /api/v1/dashboard/overview` -> Trả về DTO tổng quan.
- **`InboxController`**:
  - `GET /api/v1/inbox` -> Trả về danh sách góp ý riêng tư.
  - `PUT /api/v1/inbox/{id}/status` -> Cập nhật trạng thái xử lý.
  - `POST /api/v1/inbox/{id}/reply` -> Gửi phản hồi góp ý.
- **`BillingController`**: `GET /api/v1/billing/subscription` -> Trả về DTO chi tiết gói cước.

---

## 2. Frontend Context (Bối cảnh Frontend)

Ứng dụng Next.js sử dụng App Router, xác thực người dùng bằng Clerk SDK và giao tiếp qua axios/fetch client tại `@/lib/api-client`.

### A. Tầng Client Services (`frontend/services/`)
- `dashboard-service.ts`: Gọi API `/dashboard/overview` kèm token.
- `inbox-service.ts`: Gọi các API `/inbox` để lấy danh sách thư, cập nhật trạng thái và lưu reply.
- `billing-service.ts`: Gọi API `/billing/subscription` để quản lý gói cước.

### B. Các Trang Giao diện Chính (`frontend/app/dashboard/`)

1. **Dashboard Overview (`/dashboard/page.tsx`)**:
   - Lấy token qua `const { getToken } = useAuth();` và fetch dữ liệu tổng quan.
   - Hiển thị động các Metric Cards (Total Scans, Positive Feedback %, New Private Feedback).
   - Vẽ biểu đồ tăng trưởng động bằng SVG (sử dụng `polyline` vẽ các đường Scans, Positive, Negative).
   - Render bảng hoạt động gần đây (Recent Activity), tự động tính toán thời gian tương đối ("X hours ago", "Yesterday"...) bằng code JS.

2. **Hộp thư góp ý (`/dashboard/inbox/page.tsx`)**:
   - Sử dụng bố cục Asymmetric (Cột trái chiếm 35% danh sách thư, cột phải chiếm 65% chi tiết).
   - Đồng bộ tìm kiếm (`searchQuery` có debounce 400ms) và lọc theo tab trạng thái (All, Unread, Pending, Resolved) cùng filter Campaign.
   - Hỗ trợ đổi trạng thái xử lý trực tiếp (Mark as Resolved) hoặc viết nội dung phản hồi (Send Reply) cập nhật tức thì xuống database.

3. **Gói cước & Cài đặt (`/dashboard/settings/page.tsx`)**:
   - Hiển thị tên gói cước (Pro hoặc Free), trạng thái dùng thử/thực tế, và hạn gia hạn.
   - Thể hiện thanh đo giới hạn sử dụng chiến dịch (ví dụ: 5 / 10 campaigns).
   - Render bảng lịch sử hóa đơn nạp tiền/đăng ký dựa trên lịch sử subscription trong database.
