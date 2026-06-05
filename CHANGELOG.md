# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed
- **Frontend**: Fixed infinite rendering loop and API call spam on the Private Feedback Inbox page ([page.tsx](file:///home/ducdat/IT/CNPM/LT-Web-ASP.Net-Core/reviewloom/frontend/app/dashboard/inbox/page.tsx)).
  - Isolated the `selectedFeedback` dependency from the `handleMarkStatus` callback by using a functional state updater: `setSelectedFeedback(prev => ...)`.
  - Introduced `selectedFeedbackRef` using React `useRef` to securely access the latest selected feedback inside the `loadFeedback` callback without triggering a callback recreation and subsequent `useEffect` trigger.
