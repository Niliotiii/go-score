import { useEffect, useState } from 'react'
import { getInstallPromptDismissed } from '../lib/storage'
import { shouldOfferIOSInstallPrompt, shouldOfferSwitchToSafariPrompt } from '../lib/pwa'

export function useInstallPrompt() {
  const [variant, setVariant] = useState(null)
  const [androidPrompt, setAndroidPrompt] = useState(null)

  useEffect(() => {
    if (navigator.webdriver) return

    const iosVariant = shouldOfferIOSInstallPrompt()
      ? 'install'
      : shouldOfferSwitchToSafariPrompt()
        ? 'switch-to-safari'
        : null

    if (iosVariant) {
      getInstallPromptDismissed().then((dismissed) => {
        if (!dismissed) setVariant(iosVariant)
      })
      return
    }

    const onBeforeInstallPrompt = (event) => {
      event.preventDefault()
      getInstallPromptDismissed().then((dismissed) => {
        if (dismissed) return
        setAndroidPrompt(event)
        setVariant('android')
      })
    }

    const onAppInstalled = () => {
      setVariant(null)
      setAndroidPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  async function promptInstall() {
    if (!androidPrompt) return
    androidPrompt.prompt()
    await androidPrompt.userChoice
    setAndroidPrompt(null)
    setVariant(null)
  }

  return { variant, androidPrompt, promptInstall, setVariant }
}
