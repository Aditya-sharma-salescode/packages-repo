import { useCallback } from 'react'
import type { PlaygroundNavigate, PlaygroundAction, PlaygroundPing } from './AppPwaPreview'

export function useAppPwaPreviewActions(iframeRef: React.RefObject<HTMLIFrameElement | null>, pwaUrl: string) {
  const navigate = useCallback(
    (route: string) => {
      const iframe = iframeRef.current
      if (!iframe?.contentWindow) return
      const msg: PlaygroundNavigate = { type: 'playground:navigate', route }
      iframe.contentWindow.postMessage(JSON.stringify(msg), new URL(pwaUrl).origin)
    },
    [iframeRef, pwaUrl],
  )

  const action = useCallback(
    (actionName: string, payload: Record<string, unknown> = {}) => {
      const iframe = iframeRef.current
      if (!iframe?.contentWindow) return
      const msg: PlaygroundAction = { type: 'playground:action', action: actionName, payload }
      iframe.contentWindow.postMessage(JSON.stringify(msg), new URL(pwaUrl).origin)
    },
    [iframeRef, pwaUrl],
  )

  const ping = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return
    const msg: PlaygroundPing = { type: 'playground:ping' }
    iframe.contentWindow.postMessage(JSON.stringify(msg), new URL(pwaUrl).origin)
  }, [iframeRef, pwaUrl])

  return { navigate, action, ping }
}
