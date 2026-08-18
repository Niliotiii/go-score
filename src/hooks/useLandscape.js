import { useEffect, useMemo, useState } from 'react'

export function useLandscape() {
  const mq = useMemo(
    () => window.matchMedia('(orientation: landscape) and (max-height: 500px)'),
    []
  )
  const [isLandscape, setIsLandscape] = useState(mq.matches)

  useEffect(() => {
    const handler = (e) => setIsLandscape(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mq])

  return isLandscape
}
