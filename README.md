# ReviewLoom - Nền tảng SaaS Tối ưu hóa Phản hồi & Đánh giá Google Maps

**ReviewLoom** là một giải pháp phần mềm dạng dịch vụ (SaaS) được thiết kế đặc biệt nhằm giúp các doanh nghiệp địa phương (như nhà hàng, quán cà phê, spa, tiệm làm móng, phòng khám nha khoa, khách sạn...) dễ dàng thu thập phản hồi từ khách hàng và nâng cao thứ hạng đánh giá trên Google Maps một cách bền vững.

Hệ thống cho phép các chủ doanh nghiệp tạo các chiến dịch quét mã QR tùy chỉnh, áp dụng cơ chế điều hướng phản hồi thông minh, thu thập thông tin khách hàng và tự động xuất các bộ ấn phẩm thiết kế Standee để bàn (4x6 inch) chất lượng cao sẵn sàng in ấn.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### Backend (Clean Architecture)
*   **Framework:** .NET 8.0 ASP.NET Core Web API.
*   **Truy cập Cơ sở dữ liệu:** Entity Framework Core (PostgreSQL Provider) kết hợp **Dapper** để thực thi Stored Procedures (`sp_log_scan`) và Database Functions (`fn_get_campaign_stats`) nhằm tối ưu hiệu năng.
*   **Kiến trúc:** Clean Architecture (Onion Architecture) chia thành 4 tầng riêng biệt: `Domain`, `Application`, `Infrastructure`, và `Api`.
*   **Xác thực & Định danh:** Tích hợp Clerk JWT Bearer Authentication.
*   **Xử lý bất đồng bộ:** Sử dụng hàng đợi trong bộ nhớ (`System.Threading.Channels` kết hợp `IHostedService` background worker) để gửi email phản hồi phản hồi khách hàng (feedback reply) qua SMTP mà không chặn API chính.

### Frontend
*   **Framework:** Next.js 15 (App Router, React 19).
*   **Ngôn ngữ:** TypeScript.
*   **Thư viện giao diện:** Tailwind CSS (áp dụng phong cách *Modern Glassmorphism & Structural Silence* sang trọng và hiện đại).
*   **Quản lý trạng thái & Xác thực:** React Hooks & Clerk SDK.

### Dịch vụ bên thứ ba (External Integrations)
*   **Clerk:** Đồng bộ thông tin người dùng thông qua Clerk Webhooks (sử dụng Svix signatures verification).
*   **Stripe:** Tích hợp cổng thanh toán quốc tế và quản lý gói đăng ký định kỳ (Pro Plan).
*   **Cloudinary:** CDN lưu trữ và tối ưu hóa logo doanh nghiệp tải lên (`reviewloom/logos`).
*   **MailKit / SMTP:** Hệ thống gửi email phản hồi tự động.

---

## ✨ Các Tính Năng Nổi Bật (Features)

*   **Bộ dựng chiến dịch thông minh (Smart Campaign Builder):** Cho phép chủ doanh nghiệp thiết lập màu sắc chủ đạo, font chữ, tải lên logo riêng và tùy chỉnh cấu hình Landing Page hiển thị trên thiết bị di động.
*   **Điều hướng phản hồi thông minh (Smart Feedback Routing):**
    *   Khách hàng quét mã QR và chọn số sao đánh giá.
    *   **Đánh giá tích cực (Sao $\ge$ Ngưỡng thiết lập - Threshold):** Hệ thống tự động chuyển hướng khách hàng sang trang đánh giá Google Maps của doanh nghiệp để viết đánh giá công khai.
    *   **Đánh giá chưa tốt (Sao < Ngưỡng thiết lập):** Giữ khách hàng ở lại Landing Page nội bộ để điền Form góp ý riêng tư. Phản hồi này sẽ được gửi trực tiếp đến hộp thư của chủ doanh nghiệp kèm theo việc gửi email phản hồi tự động và tặng mã giảm giá (Coupon) để giữ chân khách hàng.
*   **Thiết kế Standee động (Standee Designer):** Hỗ trợ thiết kế trực quan các standee để bàn từ danh mục 16 template đa dạng thuộc nhiều nhóm ngành hàng (Nhà hàng, Quán cà phê, Spa & Salon, Dịch vụ gia đình, Cổ điển). Toàn bộ danh mục được quản lý động ở cơ sở dữ liệu. Xuất file ảnh PNG độ phân giải cao chuẩn in ấn (chạy qua thư viện `html-to-image`).
*   **Hộp thư góp ý & Phản hồi (Inbox & Feedback Reply):** Chủ doanh nghiệp quản lý các phản hồi tiêu cực, thay đổi trạng thái xử lý và gửi email phản hồi trực tiếp tới khách hàng ngay từ trang Dashboard.
*   **Báo cáo & Thống kê (Review Performance Dashboard):** Thống kê số lượt quét mã QR, tỷ lệ chuyển đổi đánh giá tốt/xấu theo thời gian thực.
*   **Phân quyền gói cước (Free & Pro Plan Limits):**
    *   **Gói Free (Miễn phí):** Giới hạn tối đa 1 chiến dịch hoạt động, 100 lượt quét/tháng, 50 góp ý/tháng, dữ liệu thống kê trong vòng 7 ngày và đính kèm watermark của ReviewLoom trên standee/landing page.
    *   **Gói Pro (Trả phí):** Không giới hạn chiến dịch, không giới hạn lượt quét, xem toàn bộ lịch sử thống kê, ẩn watermark và mở khóa các standee template cao cấp (Premium).

---

## 🏗️ Cấu Trúc Thư Mục Dự Án

```text
reviewloom/
├── backend/                             # Giải pháp backend ASP.NET Core
│   ├── src/                             # Mã nguồn chạy ứng dụng (Production Code)
│   │   ├── ReviewLoom.Domain/           # Tầng Domain (Entities, Enums, Interfaces)
│   │   ├── ReviewLoom.Application/      # Tầng Application (Services, DTOs, Mappings, Interfaces)
│   │   ├── ReviewLoom.Infrastructure/   # Tầng Infrastructure (Data Context, Repositories, Stripe, Cloudinary)
│   │   └── ReviewLoom.Api/              # Tầng Api (Controllers, Configs, Middlewares, Program.cs)
│   ├── tests/                           # Thư mục chứa các dự án Unit Test / Integration Test
│   │   └── ReviewLoom.Infrastructure.Tests/ # Test cases cho tầng hạ tầng & email
│   └── database/                        # Thư mục lưu schema.sql khởi tạo cơ sở dữ liệu gốc
├── frontend/                            # Mã nguồn ứng dụng Next.js 15
│   ├── app/                             # Next.js App Router (Dashboard, Public Landing Page r/[slug], Upgrade)
│   ├── components/                      # UI Components dùng chung (UI chung, Campaign, Standee...)
│   ├── services/                        # API Client Services gọi sang Backend API
│   ├── types/                           # Định nghĩa kiểu dữ liệu TypeScript dùng chung
│   └── public/                          # Tài nguyên tĩnh (Hình ảnh, Icons, Watermark...)
├── docs/                                # Tài liệu đặc tả hệ thống
│   ├── architecture/                    # Quy tắc kiến trúc & coding standards
│   └── reference/                       # Phân tích thiết kế hệ thống
└── README.md                            # Tài liệu hướng dẫn dự án (Tiếng Việt)
```

*Chi tiết quy định và layering của Backend vui lòng xem tại tài liệu [Clean Architecture Coding Rules](file:///home/ducdat/IT/CNPM/LT-Web-ASP.Net-Core/reviewloom/docs/architecture/clean_architecture_rules.md).*

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu hệ thống
*   [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0) hoặc mới hơn.
*   [Node.js 20+](https://nodejs.org/).
*   Cơ sở dữ liệu [PostgreSQL](https://www.postgresql.org/).
*   Tài khoản [Clerk](https://clerk.com/) để xác thực người dùng.
*   Tài khoản [Stripe](https://stripe.com/) và [Cloudinary](https://cloudinary.com/) (tùy chọn cho thanh toán và upload logo).

---

### Hướng dẫn chạy Backend API

1.  **Di chuyển vào thư mục backend:**
    ```bash
    cd backend
    ```

2.  **Cấu hình biến môi trường:**
    Mở file `backend/src/ReviewLoom.Api/appsettings.Development.json` (hoặc tạo file mới nếu chưa có) và cập nhật các cấu hình:
    ```json
    {
      "ConnectionStrings": {
        "DefaultConnection": "Host=localhost;Database=reviewloom_db;Username=your_user;Password=your_password"
      },
      "Clerk": {
        "Authority": "https://your-clerk-issuer-url.clerk.accounts.dev",
        "Audience": ""
      },
      "Cloudinary": {
        "CloudName": "your_cloudinary_name",
        "ApiKey": "your_cloudinary_key",
        "ApiSecret": "your_cloudinary_secret"
      },
      "Stripe": {
        "SecretKey": "sk_test_...",
        "WebhookSecret": "whsec_...",
        "ProMonthlyPriceId": "price_...",
        "ProYearlyPriceId": "price_..."
      },
      "Smtp": {
        "Host": "sandbox.smtp.mailtrap.io",
        "Port": 2525,
        "Username": "your_smtp_username",
        "Password": "your_smtp_password",
        "SenderEmail": "no-reply@reviewloom.com",
        "SenderName": "ReviewLoom Team"
      }
    }
    ```

3.  **Cập nhật Cơ sở dữ liệu (Database Migrations):**
    Thực hiện lệnh sau để tạo và cập nhật các bảng cơ sở dữ liệu cũng như nạp dữ liệu mẫu ban đầu (Seed Data cho Standee Templates):
    ```bash
    dotnet ef database update --project src/ReviewLoom.Infrastructure --startup-project src/ReviewLoom.Api
    ```

4.  **Khởi chạy API:**
    ```bash
    dotnet run --project src/ReviewLoom.Api
    ```
    API sẽ chạy mặc định tại địa chỉ `http://localhost:5165` hoặc `https://localhost:7165`. Bạn có thể truy cập tài liệu Swagger UI tại đường dẫn `http://localhost:5165/swagger/index.html`.

---

### Hướng dẫn chạy Frontend Next.js

1.  **Di chuyển vào thư mục frontend:**
    ```bash
    cd ../frontend
    ```

2.  **Cài đặt các thư viện phụ thuộc:**
    ```bash
    npm install
    ```

3.  **Cấu hình biến môi trường:**
    Tạo file `.env.local` tại thư mục gốc của frontend với nội dung:
    ```env
    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...

    # API Backend Endpoint
    NEXT_PUBLIC_API_URL=http://localhost:5165/api/v1
    ```

4.  **Khởi chạy máy chủ phát triển:**
    ```bash
    npm run dev
    ```
    Mở trình duyệt và truy cập trang quản trị tại địa chỉ: `http://localhost:3000`.

---

## 🧪 Chạy Kiểm Thử (Unit Tests)

Dự án sử dụng **xUnit** và **Moq** để viết unit test cho các thành phần quan trọng (ví dụ như dịch vụ gửi Email). Để chạy toàn bộ test suite ở backend:

```bash
cd backend
dotnet test
```

---

## 🚀 CI/CD & Triển khai (Deployment)

### Frontend (Next.js)
Ứng dụng frontend được thiết kế để triển khai trực tiếp lên **Vercel** một cách dễ dàng:
1. Kết nối kho lưu trữ GitHub của bạn với Vercel.
2. Thiết lập các biến môi trường cấu hình tại Vercel (ví dụ: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_API_URL`).
3. Vercel sẽ tự động build và deploy mỗi khi có thay đổi trên nhánh được liên kết.

### Backend (.NET API)
Dự án được cấu hình quy trình triển khai tự động (CD) lên máy chủ **Somee ASP.NET Hosting** thông qua GitHub Actions (`.github/workflows/deploy.yml`):
1. **Kích hoạt:** Khi có hành động push hoặc merge PR vào nhánh `main`.
2. **Quy trình hoạt động:**
   * Hệ thống tự động tạo file cấu hình `appsettings.Production.json` từ GitHub Secrets.
   * Biên dịch và đóng gói ứng dụng với cấu hình Release.
   * Khởi chạy đoạn mã Python tự động tạo file `app_offline.htm` để dừng tạm thời ứng dụng trên IIS nhằm tránh xung đột khóa file DLL.
   * Đồng bộ mã nguồn đã biên dịch lên FTP Server của Somee qua FTP-Deploy-Action.
   * Tự động xóa file `app_offline.htm` để đưa hệ thống hoạt động online trở lại.
3. **Cấu hình Secrets cần thiết trên GitHub Repository:**
   * `APPSETTINGS_PRODUCTION_JSON`: Nội dung tệp cấu hình production của dự án.
   * `SOMEE_FTP_SERVER`: Địa chỉ host FTP của Somee.
   * `SOMEE_FTP_USERNAME`: Tên tài khoản FTP.
   * `SOMEE_FTP_PASSWORD`: Mật khẩu tài khoản FTP.

---

## 📈 Lộ Trình Phát Triển (Roadmap)

*   [ ] **AI Phân Tích Sắc Thái (Sentiment Analysis):** Tự động phân tích nội dung góp ý tiêu cực của khách hàng để cảnh báo các vấn đề khẩn cấp cho chủ cửa hàng.
*   [ ] **Thông báo đa kênh:** Hỗ trợ nhận thông báo góp ý mới qua Telegram, SMS hoặc Zalo.
*   [ ] **Báo cáo chuyên sâu bằng PDF:** Cho phép tải báo cáo định kỳ tháng/quý về hiệu suất đánh giá và xếp hạng.
*   [ ] **Hỗ trợ đa ngôn ngữ (i18n):** Cho phép Landing page hiển thị nhiều ngôn ngữ khác nhau dựa trên vị trí/trình duyệt của khách hàng.

---

## 📄 Bản quyền (License)

Bản quyền thuộc về **ReviewLoom Team © 2026**. Mọi quyền được bảo lưu.