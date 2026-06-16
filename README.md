# ReviewLoom 

**ReviewLoom** là một nền tảng SaaS giúp doanh nghiệp tối ưu hóa quy trình thu thập phản hồi và nâng cao xếp hạng trên Google Maps. Hệ thống cho phép tạo mã QR tùy chỉnh, điều hướng khách hàng thông minh (Positive feedback -> Google Maps, Negative feedback -> Private Form) và xuất các bộ công cụ marketing (Standee) in ấn chất lượng cao.

---

## 🛠 Tech Stack

### Backend (Clean Architecture)
- **Framework:** .NET 8.0/10.0 ASP.NET Core
- **Database:** PostgreSQL with Entity Framework Core
- **Architecture:** Clean Architecture (Domain, Application, Infrastructure, Api)
- **Patterns:** CQRS, Repository Pattern, DTO Mapping
- **Auth:** Clerk Authentication Integration

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (Modern Glassmorphism & Structural Silence Design)
- **Language:** TypeScript
- **State Management:** React Hooks & Server Actions
- **Auth:** Clerk SDK

---

## ✨ Key Features (Current Progress)

- [x] **Smart Campaign Builder:** Giao diện kéo thả/tùy chỉnh thương hiệu chuyên nghiệp.
- [x] **Dynamic Landing Page:** Trang đích phản hồi mobile-first, tự động thay đổi theo branding của doanh nghiệp.
- [x] **Intelligent Routing:** Tự động lọc đánh giá 4-5 sao sang Google Review URL.
- [x] **QR Code Engine:** Tạo mã QR có gắn logo doanh nghiệp với khả năng sửa lỗi cao.
- [x] **Export Kit:** Xuất file thiết kế Standee (A5/A6) chuẩn in ấn.
- [x] **Analytics:** Theo dõi lượt quét QR và tỷ lệ chuyển đổi phản hồi.

---

## 🏗 Project Structure

```text
reviewloom/
├── backend/                # ASP.NET Core Solution
│   ├── src/                # Production Code
│   │   ├── ReviewLoom.Api/          # REST API & Controllers
│   │   ├── ReviewLoom.Application/  # Business Logic & DTOs
│   │   ├── ReviewLoom.Domain/       # Entities & Enums
│   │   └── ReviewLoom.Infrastructure/ # DB Context & Services
│   └── tests/              # Test Projects
│       └── ReviewLoom.Infrastructure.Tests/
├── frontend/               # Next.js Application
│   ├── app/                # Pages & Routes
│   ├── components/         # Reusable UI Components
│   ├── services/           # API Client Services
│   └── public/             # Static Assets
└── docs/                   # Documentation & Research
```

---

## 🚀 Getting Started

### Prerequisites
- .NET SDK 10.0+ (or 8.0+)
- Node.js 20+
- PostgreSQL instance

### Backend Setup
1. `cd backend`
2. Cấu hình `src/ReviewLoom.Api/appsettings.Development.json` (ConnectionStrings, Clerk Keys).
3. Chạy migrations: `dotnet ef database update --project src/ReviewLoom.Infrastructure --startup-project src/ReviewLoom.Api`
4. Chạy dự án: `dotnet run --project src/ReviewLoom.Api`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Cấu hình `.env.local`
4. `npm run dev`

---

## 📈 Roadmap
- [ ] Tích hợp AI phân tích sắc thái phản hồi (Sentiment Analysis).
- [ ] Hệ thống Notification qua Email/Telegram cho chủ doanh nghiệp.
- [ ] Dashboard báo cáo chuyên sâu theo tháng/năm.
- [ ] Hỗ trợ đa ngôn ngữ (i18n).

---

## 📄 License
Copyright © 2026 ReviewLoom Team. All rights reserved.