export function isRunningStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.navigator.standalone === true ||
    window.matchMedia?.('(display-mode: standalone)').matches === true
  )
}

export function isIOSDevice() {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export function isSafariBrowser() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|mercury/.test(ua)
}

export function isIOSSafariBrowser() {
  return isIOSDevice() && isSafariBrowser()
}

export function isIOSNonSafariBrowser() {
  return isIOSDevice() && !isSafariBrowser()
}

export function shouldOfferIOSInstallPrompt() {
  return isIOSSafariBrowser() && !isRunningStandalone()
}

export function shouldOfferSwitchToSafariPrompt() {
  return isIOSNonSafariBrowser() && !isRunningStandalone()
}
