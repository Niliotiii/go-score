const INSTALL_PROMPT_DISMISSED_KEY = 'goscore_install_prompt_dismissed'

export function getInstallPromptDismissed() {
  return new Promise((resolve) => {
    try {
      resolve(localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY) === '1')
    } catch {
      resolve(false)
    }
  })
}

export function setInstallPromptDismissed() {
  try {
    localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, '1')
  } catch {}
}
