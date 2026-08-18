const CACHE_VERSION = 'goscore-v2'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('goscore-') && key !== STATIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') return
  if (!request.url.startsWith(self.location.origin)) return

  event.respondWith(handleRequest(request))
})

async function handleRequest(request) {
  const cached = await caches.match(request)

  if (cached) {
    updateCacheInBackground(request)
    return cached
  }

  try {
    const networkResponse = await fetch(request)
    if (canCache(networkResponse)) {
      await putInCache(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/index.html')
      if (fallback) return fallback
    }
    throw error
  }
}

async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request)
    if (canCache(networkResponse)) {
      await putInCache(request, networkResponse.clone())
    }
  } catch {
    // Ignora falhas de atualização em segundo plano
  }
}

async function putInCache(request, response) {
  const cache = await caches.open(STATIC_CACHE)
  await cache.put(request, response)
}

function canCache(response) {
  return response && response.status === 200 && response.type === 'basic'
}
