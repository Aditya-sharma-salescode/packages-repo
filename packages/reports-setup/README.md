# @aditya-sharma-salescode/reports-setup

Reports setup package (provider/config + config/preview/portal pages + voice prompt helpers).

## Install

```bash
npm i @aditya-sharma-salescode/reports-setup
```

## Peer dependencies

Your app must provide:
- `react`
- `react-dom`
- `react-router-dom`

## Basic setup

Wrap your app (or a route subtree) with `ReportsProvider`, then render one of the pages.

```tsx
import { ReportsProvider, ReportsPage } from "@aditya-sharma-salescode/reports-setup";

export function ReportsScreen() {
  return (
    <ReportsProvider>
      <ReportsPage />
    </ReportsProvider>
  );
}
```

## Exports

Common exports include:
- `ReportsProvider`, `useReportsConfig`
- `ReportConfigPage`, `ReportPreviewPage`, `ReportsPage`
- `loadReportConfig`, `saveReportConfigLocal`
- `buildReportConfigStaticPrompt`, `buildReportConfigContextUpdate`

