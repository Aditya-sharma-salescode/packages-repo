# @aditya-sharma-salescode/form-builder

Form builder package (provider, main `FormBuilder` component, hooks, voice agent integration), plus embedded reports pages.

## Install

```bash
npm i @aditya-sharma-salescode/form-builder
```

## Peer dependencies

Your app must provide:
- `react`
- `react-dom`
- `react-router-dom`

## Basic setup

Wrap your app (or a route subtree) with `FormBuilderProvider`, then render `FormBuilder`.

```tsx
import { FormBuilderProvider, FormBuilder } from "@aditya-sharma-salescode/form-builder";

export function FormBuilderScreen() {
  return (
    <FormBuilderProvider>
      <FormBuilder />
    </FormBuilderProvider>
  );
}
```

## Exports

Common exports include:
- `FormBuilderProvider`, `useFormBuilderConfig`
- `FormBuilder`
- `useActivityStore`
- `VoiceAgentProvider`, `useVoiceAgentContext`
- Reports pages: `ReportConfigPage`, `ReportPreviewPage`, `ReportsPage`

