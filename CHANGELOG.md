# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Async Feedback Reply via Email**:
  - Installed `MailKit` and `Microsoft.Extensions.Hosting.Abstractions` packages.
  - Implemented `IEmailService` and `IEmailQueue` in the Application layer.
  - Implemented `SmtpEmailService` (MailKit-based SMTP client), `EmailQueue` (System.Threading.Channels), and `EmailBackgroundService` (IHostedService background queue worker) in the Infrastructure layer.
  - Registered email services in `DependencyInjection.cs`.
  - Updated `InboxService.SendFeedbackReplyAsync` to asynchronously queue response emails to reviewers using the `Reply-To` header configured to the business owner's email address.
  - Added SMTP configuration block to `appsettings.json`.
- **Dynamic Standee Template Catalog**:
  - Migrated the standee template catalog definitions from frontend hardcoding to the PostgreSQL database under the new `standee_templates` table.
  - Added ModelBuilder seed data to initialize 16 templates (12 new industry-specific templates grouped by Restaurant, Coffee Shop, Salon & Spa, Home Services, plus 4 original templates for backward compatibility).
  - Created `IStandeeTemplateRepository`, `IStandeeTemplateService`, and `StandeeTemplateService` to manage templates.
  - Exposed GET `/api/v1/StandeeTemplates` endpoint via `StandeeTemplatesController` to serve template metadata to the client.
  - Refactored `CampaignService` to dynamically query the database for premium/pro template validation instead of using a hardcoded template ID list.
  - Updated the Next.js frontend to retrieve template catalogs from the API, group them by category in the Standee Designer sidebar, show dynamic loading states, and dynamically resolve layouts/styling styles for all 16 template configurations.

### Refactored
- **Backend Directory Structure Refactoring (Enterprise Standard)**:
  - Created `src/` and `tests/` directories inside the `backend` folder to segregate production code and test suites.
  - Moved production projects (`ReviewLoom.Api`, `ReviewLoom.Application`, `ReviewLoom.Domain`, `ReviewLoom.Infrastructure`) into `backend/src/`.
  - Moved the test project (`ReviewLoom.Infrastructure.Tests`) into `backend/tests/`.
  - Updated project references in `ReviewLoom.Infrastructure.Tests.csproj` and project paths in the solution file `ReviewLoom.slnx`.
  - Adjusted VS Code launch configurations (`launch.json`) and build/publish/watch tasks (`tasks.json`) to target the new project paths.
  - Updated workspace documentation (`README.md`, `PROJECT_CONTEXT.md`) with the new layout and updated database setup/migration CLI commands.
- **Clean Architecture & Layering Enforcement**:
  - Removed direct dependencies on `IUnitOfWork` and repositories from all API Controllers (`RController`, `CampaignsController`, `InboxController`, `DashboardController`, `BillingController`, `ClerkWebhookController`).
  - Created `IUserService` and `UserService` in the Application layer to centralize user management and Clerk synchronization logic, avoiding duplicate user lookups in controllers.
  - Encapsulated business rules (monthly scan/feedback limits, free plan campaign caps) within Application Services (`ScanService.LogScanAsync`, `CampaignService.CreateCampaignAsync`).
  - Created a formal architecture rules document at [clean_architecture_rules.md](file:///home/ducdat/IT/CNPM/LT-Web-ASP.Net-Core/reviewloom/docs/architecture/clean_architecture_rules.md) to define coding standards and layering constraints.
  - **Frontend Architecture Restructuring**:
    - Restructured campaign configuration types into `@/types/campaign` and mappers into `@/lib/campaign-mappers`.
    - Made types self-contained by moving `StandeeTemplateId` and `StandeeUserConfig` directly to `types/campaign.ts`, avoiding cross-directory UI component references and circular dependency risks.
    - Standardized type and helper imports across the entire frontend project.

### Fixed
- **QR Code Routing Target**: Fixed the QR code URL generation in the Live Preview component (`LivePreview.tsx`) to target the correct campaign routing path (`/r/[slug]`) rather than routing users directly to Google Maps. Also mapped the campaign `slug` to the frontend state configuration model to allow resolving URLs in the client builder.
- **Backend**: Fixed `Campaign` mapping logic in `CampaignMappingExtensions.ToDto()` where the `IsActive` property on `CampaignDto` was not initialized, resulting in the campaign list page in the dashboard always showing campaigns as "Paused" even if their database status was `1` (Published).
- **Frontend**: Fixed infinite rendering loop and API call spam on the Private Feedback Inbox page ([page.tsx](file:///home/ducdat/IT/CNPM/LT-Web-ASP.Net-Core/reviewloom/frontend/app/dashboard/inbox/page.tsx)).
  - Isolated the `selectedFeedback` dependency from the `handleMarkStatus` callback by using a functional state updater: `setSelectedFeedback(prev => ...)`.
  - Introduced `selectedFeedbackRef` using React `useRef` to securely access the latest selected feedback inside the `loadFeedback` callback without triggering a callback recreation and subsequent `useEffect` trigger.

### Added
- **Stripe Subscription Checkout**: Added config-driven Stripe Hosted Checkout, Billing Portal sessions, four primary webhook handlers, subscription Stripe ID mapping, and Free/Pro enforcement aligned to 3 free active campaigns.
- **Subscription & Stripe Integration**:
  - Implemented logic to limit Free accounts to 1 location, 1 campaign, 100 scans/month, and 50 feedback/month.
  - Implemented 7-day analytics limitation for Free accounts in `DashboardService`.
  - Added `showWatermark` response flag in `RController` and implemented watermark rendering logic in `LandingClient` and `StandeeTemplate`.
  - Integrated `BillingService` across `Settings` and `CampaignList` to fetch limits and adjust UI accordingly.
  - Added `createPortalSession` and `createCheckoutSession` to frontend `billing-service.ts`.
  - Built independent `UpgradePage` (`/dashboard/upgrade`) allowing users to view Free/Pro plans and initiate checkout using Stripe Customer Portal.
  - Locked Premium Standee Templates with a lock icon and tooltip if the user's plan enforces a watermark.
