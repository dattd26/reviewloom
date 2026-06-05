# ReviewLoom Frontend Architecture Context

Tài liệu này đặc tả chi tiết bối cảnh hệ thống, cấu trúc thư mục, kiến trúc giao tiếp API, cơ chế xác thực và cách thức hoạt động của các module giao diện ứng dụng Next.js (Frontend) của **ReviewLoom**.

---

## 1. Công nghệ cốt lõi (Tech Stack)

Ứng dụng Frontend được xây dựng dựa trên các công nghệ hiện đại nhằm đảm bảo trải nghiệm người dùng mượt mà và tối ưu hóa hiệu năng:

- **Framework**: **Next.js 16 (React 19, TypeScript)** sử dụng mô hình **App Router** để tối ưu hóa việc định tuyến và tải trang.
- **Styling**: **Tailwind CSS v4** kết hợp với `@tailwindcss/postcss` để xây dựng hệ thống CSS Utility-first hiện đại, mượt mà.
- **Biểu tượng**: Thư viện **Material Symbols Outlined** (`material-symbols`) làm bộ icon đồng nhất cho toàn hệ thống.
- **Authentication**: **Clerk (`@clerk/nextjs`)** làm giải pháp xác thực (Sign in, Sign up, Session Management) cho cả phần ứng dụng và tự động tạo JSON Web Token (JWT) để gọi API sang Backend.
- **Hiệu ứng & Chuyển động (Animations)**: **GSAP & `@gsap/react`** phục vụ cho các hiệu ứng chuyển động cao cấp, mượt mà ở trang Landing Page và Dashboard.
- **Công cụ sinh QR & Xuất ảnh**: 
  - `qrcode`: Dùng để tạo mã QR dạng Data URL trực tiếp trên trình duyệt.
  - `html-to-image`: Chuyển đổi cây DOM (như thẻ standee thiết kế trực tuyến) thành ảnh PNG độ phân giải cao phục vụ cho việc in ấn của chủ doanh nghiệp.
- **Toast Notifications**: `react-hot-toast` cung cấp các thông báo trạng thái nhẹ nhàng, trực quan cho người dùng.

---

## 2. Cấu trúc thư mục dự án (`frontend/`)

Thư mục chứa mã nguồn chính tuân thủ cấu trúc Next.js App Router chuẩn hóa:

```
frontend/
├── app/                             # Định tuyến ứng dụng (App Router)
│   ├── layout.tsx                   # Layout gốc (Root Layout) định nghĩa font, Clerk Provider và HTML shell
│   ├── globals.css                  # Cấu hình CSS chung và các custom CSS variables của Tailwind
│   ├── page.tsx                     # Landing Page chính giới thiệu ReviewLoom
│   ├── r/                           # Các route liên quan đến thu thập ý kiến khách hàng (Public)
│   │   └── [slug]/                  # Landing page riêng của từng chiến dịch QR (Campaign)
│   └── dashboard/                   # Toàn bộ giao diện quản trị của chủ doanh nghiệp (Private)
│       ├── layout.tsx               # Layout Dashboard chứa sidebar điều hướng, header và kiểm tra Auth
│       ├── page.tsx                 # Trang chủ Dashboard (Overview metrics, chart, recent activity)
│       ├── campaigns/               # Module quản lý chiến dịch QR
│       │   ├── page.tsx             # Danh sách chiến dịch & thống kê tổng quát
│       │   ├── new/                 # Tạo mới chiến dịch
│       │   └── [id]/                # Trình thiết kế & chỉnh sửa chiến dịch (Live Preview, Designer)
│       ├── inbox/                   # Hộp thư xem và xử lý các ý kiến phản hồi riêng tư từ khách hàng
│       └── settings/                # Quản lý tài khoản và thông tin nâng cấp gói cước/hóa đơn
├── components/                      # UI Components dùng chung trong ứng dụng
│   ├── ui/                          # Các thành phần giao diện nguyên tử cơ bản (Button, Input, Modal, v.v.)
│   ├── layout/                      # Layout components (Sidebar, TopAppBar)
│   ├── campaign/                    # Các component đặc thù phục vụ tạo và cấu hình chiến dịch
│   └── home/                        # Các thành phần động cho trang chủ giới thiệu sản phẩm
├── lib/                             # Các cấu hình/thư viện cốt lõi hệ thống
│   └── api-client.ts                # Client gọi API chung (Wrapper quanh fetch)
├── services/                        # Lớp giao tiếp API đến ASP.NET Core Backend
│   ├── campaign-service.ts          # Thao tác CRUD chiến dịch QR
│   ├── dashboard-service.ts         # Lấy số liệu tổng hợp (Scans growth, conversion rate, activity)
│   ├── inbox-service.ts             # Quản lý feedback riêng tư (Đọc, lọc, đổi trạng thái, phản hồi email)
│   ├── scan-service.ts              # Log lượt quét QR của khách hàng
│   ├── media-service.ts             # Upload logo doanh nghiệp lên cloud/backend storage
│   └── billing-service.ts           # Quản lý thông tin gói cước và thanh toán
└── public/                          # Tài sản tĩnh (Hình ảnh, favicon, logos)
```

---

## 3. Kiến trúc giao tiếp API & Xác thực

### A. API Client (`lib/api-client.ts`)
Tất cả các dịch vụ đều sử dụng hàm wrapper `apiClient` được cấu hình sẵn trên nền **Native Fetch API** thay vì Axios để tối ưu dung lượng gói build và hỗ trợ Next.js Caching tối đa:
- Tự động lấy URL từ biến môi trường `NEXT_PUBLIC_API_URL` (mặc định trỏ về `http://localhost:5165/api/v1`).
- Hỗ trợ truyền `token` trực tiếp. Khi có token, client tự động đính kèm header `Authorization: Bearer <token>`.
- Chuẩn hóa việc xử lý lỗi HTTP và trả về JSON chuẩn hoặc object trống nếu mã trạng thái là `204 No Content`.

### B. Tích hợp Xác thực (Clerk & JWT Token)
- **Dashboard Security**: Dashboard sử dụng Clerk đệm ngoài để bảo vệ các tuyến private.
- **Session Tokens**: Trong mỗi trang thuộc `/dashboard`, token Clerk được lấy thông qua hàm hook `const { getToken } = useAuth();`. Hàm này sinh JWT để Backend ASP.NET Core giải mã và xác định người dùng.

---

## 4. Chi tiết các Module chính

### A. Landing Page Thu thập Ý kiến (`app/r/[slug]`) - Public
- **Mục tiêu**: Đây là trang khách hàng sẽ truy cập sau khi quét mã QR tại bàn hoặc standee của cửa hàng.
- **Hành vi**:
  - Gửi yêu cầu API đến Backend để tải cấu hình hiển thị của chiến dịch dựa trên `slug`.
  - Ghi nhận sự kiện quét QR (Scan Event) qua `ScanService.trackScan`.
  - Hiển thị giao diện tùy biến theo thiết kế của chủ cửa hàng (màu sắc, logo, font chữ, câu chào).
  - Khách hàng có thể chọn mức đánh giá từ 1 đến 5 sao:
    - **Ý kiến tốt (4 - 5 sao)**: Tự động chuyển hướng khách hàng sang link đánh giá Google Reviews của doanh nghiệp (giúp tăng lượt đánh giá thật trên Google).
    - **Ý kiến không tốt (1 - 3 sao)**: Mở biểu mẫu thu thập góp ý riêng tư trực tiếp trên trang. Góp ý này sẽ được gửi về Backend và nằm gọn trong Inbox riêng tư của chủ cửa hàng để họ xử lý thay vì bị đăng công khai lên mạng xã hội hay Google Maps.

### B. Dashboard Overview (`app/dashboard`)
- Tích hợp biểu đồ thống kê tăng trưởng dạng SVG tùy biến vẽ bằng thẻ `polyline` thay vì sử dụng thư viện nặng như Chart.js để tăng hiệu suất tải trang.
  - Hỗ trợ tương tác rê chuột (hover interaction) để hiển thị chi tiết số liệu ngày cụ thể qua tooltip kính mờ (glassmorphic tooltip), hiển thị các đường căn chỉnh dọc (vertical alignment line) và chấm định vị điểm giá trị (data point markers).
- Hiển thị 3 chỉ số quan trọng nhất của doanh nghiệp:
  1. Tổng số lượt quét (Total Scans)
  2. Tỉ lệ phản hồi tốt (Positive Feedback %)
  3. Góp ý riêng tư mới nhận (New Private Feedback)

### C. Quản lý & Thiết kế Chiến dịch (`app/dashboard/campaigns`)
- **Danh sách chiến dịch**: Liệt kê toàn bộ chiến dịch QR kèm trạng thái (Draft / Published), ngày tạo, và số lượt quét riêng lẻ của từng chiến dịch.
- **Trình chỉnh sửa & Live Preview (`[id]/page.tsx` và `LivePreview.tsx`)**:
  - Cung cấp bảng điều khiển trực quan để thay đổi câu chào, màu sắc thương hiệu, kiểu logo (soft, circle, square), có thu thập thông tin liên hệ hay tặng mã coupon giảm giá (Incentives) để kích thích khách hàng đánh giá hay không.
  - Render mockup điện thoại động cập nhật tức thời theo cấu hình.
  - Sử dụng cơ chế **Debounced QR Code Generation** (độ trễ 150ms) nhằm ngăn chặn việc tạo lại mã QR liên tục khi người dùng đang kéo chỉnh bảng màu, tránh tình trạng giật lag giao diện.
  - Tích hợp **Standee Designer** hỗ trợ chọn mẫu biển để bàn (Table Standee) và xuất file PNG 300 DPI sẵn sàng mang đi in ấn.

### D. Hộp thư Góp ý riêng tư (`app/dashboard/inbox`)
- Quản lý tất cả góp ý tiêu cực nhận được qua luồng riêng tư.
- Bố cục bất đối xứng hiện đại với danh sách hộp thư bên trái và chi tiết nội dung phản hồi bên phải.
- Cho phép chủ doanh nghiệp viết thư điện tử phản hồi xin lỗi hoặc giải thích trực tiếp, hệ thống sẽ tự động cập nhật trạng thái feedback sang `resolved` (Đã xử lý).

---

## 5. Quy tắc phát triển Frontend (Guidelines)

Khi thực hiện thay đổi trên Frontend, các AI Agent cần tuân thủ nghiêm ngặt các quy tắc sau:

1. **Next.js & React 19 Best Practices**:
   - Sử dụng các hook `useClient` chỉ khi component cần tương tác của người dùng, state, hoặc client-side APIs (như Clerk, GSAP, html-to-image).
   - Tận dụng `useCallback` và `useMemo` đối với các hàm truyền qua props hoặc hàm đóng vai trò là dependency của `useEffect` để tránh lỗi cascading render không đáng có.
2. **Tailwind CSS v4 Conventions**:
   - Sử dụng hệ màu semantic tích hợp trong hệ thống design token của ReviewLoom (ví dụ: `primary`, `on-primary`, `surface-container-low`, `outline-variant`, v.v.) thay vì hardcode các mã màu ngẫu nhiên.
3. **Quy tắc SaaS thân thiện với khách hàng**:
   - Mọi bản sao giao diện hiển thị cho người dùng (Chủ doanh nghiệp) phải viết bằng tiếng Anh rõ ràng, dễ hiểu.
   - Không sử dụng các từ ngữ kỹ thuật lập trình như API, Database, Endpoint, Webhook trên giao diện Dashboard mà thay bằng ngôn ngữ kinh doanh gần gũi (ví dụ: *Private feedback*, *Scan rate*, *Google review link*).
