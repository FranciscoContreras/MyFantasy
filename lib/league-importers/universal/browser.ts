let chromiumModule: typeof import("playwright") | null = null

export async function getChromium() {
  if (!chromiumModule) {
    try {
      chromiumModule = await import("playwright-core")
    } catch {
      try {
        chromiumModule = await import("playwright")
      } catch {
        throw new Error(
          "Playwright is not installed. Install either 'playwright-core' or 'playwright' to run league importers.",
        )
      }
    }
  }
  return chromiumModule.chromium
}
