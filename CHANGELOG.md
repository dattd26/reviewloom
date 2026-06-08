# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Refactored
- **Clean Architecture & Layering Enforcement**:
  - Removed direct dependencies on `IUnitOfWork` and repositories from all API Controllers (`RController`, `CampaignsController`, `InboxController`, `DashboardController`, `BillingController`, `ClerkWebhookController`).
  - Created `IUserService` and `UserService` in the Application layer to centralize user management and Clerk synchronization logic, avoiding duplicate user lookups in controllers.
  - Encapsulated business rules (monthly scan/feedback limits, free plan campaign caps) within Application Services (`ScanService.LogScanAsync`, `CampaignService.CreateCampaignAsync`).
  - Created a formal architecture rules document at [clean_architecture_rules.md](file:///home/ducdat/IT/CNPM/LT-Web-ASP.Net-Core/reviewloom/docs/architecture/clean_architecture_rules.md) to define coding standards and layering constraints.

### Fixed
- **Frontend**: Fixed infinite rendering loop and API call spam on the Private Feedback Inbox page ([page.tsx](file:///home/ducdat/IT/CNPM/LT-Web-ASP.Net-Core/reviewloom/frontend/app/dashboard/inbox/page.tsx)).
  - Isolated the `selectedFeedback` dependency from the `handleMarkStatus` callback by using a functional state updater: `setSelectedFeedback(prev => ...)`.
  - Introduced `selectedFeedbackRef` using React `useRef` to securely access the latest selected feedback inside the `loadFeedback` callback without triggering a callback recreation and subsequent `useEffect` trigger.

### Added
- **Subscription & Stripe Integration**:
  - Implemented logic to limit Free accounts to 1 location, 1 campaign, 100 scans/month, and 50 feedback/month.
  - Implemented 7-day analytics limitation for Free accounts in `DashboardService`.
  - Added `showWatermark` response flag in `RController` and implemented watermark rendering logic in `LandingClient` and `StandeeTemplate`.
  - Integrated `BillingService` across `Settings` and `CampaignList` to fetch limits and adjust UI accordingly.
  - Added `createPortalSession` and `createCheckoutSession` to frontend `billing-service.ts`.
  - Built independent `UpgradePage` (`/dashboard/upgrade`) allowing users to view Free/Pro plans and initiate checkout using Stripe Customer Portal.
  - Locked Premium Standee Templates with a lock icon and tooltip if the user's plan enforces a watermark.
