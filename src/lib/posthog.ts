const posthogKey = import.meta.env.VITE_POSTHOG_KEY
const posthogHost = import.meta.env.VITE_POSTHOG_HOST

type PostHogClient = typeof import('posthog-js').default

let client: PostHogClient | null = null
let loading: Promise<PostHogClient | null> | null = null

const loadPostHog = () => {
  if (client) return Promise.resolve(client)
  if (loading) return loading
  if (!posthogKey || !posthogHost) return Promise.resolve(null)

  loading = import('posthog-js').then(({ default: posthog }) => {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      defaults: '2026-05-30',
    })
    posthog.startExceptionAutocapture({
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    })
    client = posthog
    return posthog
  })
  return loading
}

if (!posthogKey || !posthogHost) {
  if (import.meta.env.DEV) {
    const missingVariable = !posthogKey ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST'
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    )
  }
} else if ('requestIdleCallback' in window) {
  window.requestIdleCallback(() => void loadPostHog(), { timeout: 3000 })
} else {
  window.setTimeout(() => void loadPostHog(), 2500)
}

const call = (method: 'capture' | 'captureException' | 'identify' | 'reset', args: unknown[]) => {
  if (client) {
    ;(client[method] as (...values: unknown[]) => unknown)(...args)
    return
  }
  void loadPostHog().then((posthog) => {
    if (posthog) (posthog[method] as (...values: unknown[]) => unknown)(...args)
  })
}

// A small async facade keeps analytics out of the critical rendering bundle.
// Existing callers retain the same API while events wait for initialization.
const posthog = {
  capture: (...args: unknown[]) => call('capture', args),
  captureException: (...args: unknown[]) => call('captureException', args),
  identify: (...args: unknown[]) => call('identify', args),
  reset: (...args: unknown[]) => call('reset', args),
}

export default posthog
