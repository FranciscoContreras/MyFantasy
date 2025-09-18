let chromiumModule: typeof import("playwright") | null = null

export async function getChromium() {
  if (!chromiumModule) {
    chromiumModule = await import("playwright")
  }
  return chromiumModule.chromium
}
