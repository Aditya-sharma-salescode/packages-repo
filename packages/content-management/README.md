# @aditya-sharma-salescode/content-management

Content management package (banner/bucket/basket/block flows) with pages, providers, and config hooks.

## Install

```bash
npm i @aditya-sharma-salescode/content-management
```

## Peer dependencies

Your app must provide:
- `react`
- `react-dom`
- `react-router-dom`

## Basic setup

Wrap your app (or a route subtree) with `ContentManagementProvider`, then render a page.

```tsx
import {
  ContentManagementProvider,
  BannerPage,
} from "@aditya-sharma-salescode/content-management";

export function BannerManagementScreen() {
  return (
    <ContentManagementProvider>
      <BannerPage />
    </ContentManagementProvider>
  );
}
```

## Exports

Common exports include:
- `ContentManagementProvider`, `useContentManagementConfig`
- Pages: `BannerPage`, `BucketPage`, `BasketPage`, `BlockPage`, `UnifiedManagementPage`
- Context helpers: `BannerProvider`/`useBanner`, `BucketProvider`/`useBucket`, `BasketProvider`/`useBasket`, `BlockProvider`/`useBlock`

