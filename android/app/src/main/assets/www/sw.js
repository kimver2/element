const CACHE_NAME = 'element-explorer-v2.8.2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/elements-data.js',
  './js/temperature-slider.js',
  './js/atom-model.js',
  './js/molecule-lab.js',
  './js/card-battle.js',
  './js/achievements.js',
  './js/periodic-table.js',
  './js/future-lab.js',
  './js/quiz.js',
  './js/app.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon.png',
  './assets/icon.svg'
];

// 설치 단계: 핵심 정적 애셋 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Some assets failed to precache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 활성화 단계: 구버전 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch 이벤트: 네트워크 우선, 오프라인 시 캐시 반환 (PWA 핵심 요구 조건)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 로컬 애셋 및 위키 이미지 요청 처리
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // 성공적인 응답일 경우 캐시에 복사본 저장
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // 네트워크 연결 실패(오프라인) 시 캐시에서 제공
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
