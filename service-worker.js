console.log('Service worker registration');

const excludeFromCache = [
  'https://www.google.com/images/phd/px.gif',
  'http://localhost:3000/todos',
];

const filesCached = [
  '/',
  '/index.html',
  '/styles/tailwind.css',
  '/js/network.js',
  '/js/api/todo.js',
  '/js/idb.js',
  '/web_modules/idb.js',
  '/web_modules/lit-html.js',
  '/web_modules/page.js',
  '/web_modules/lit-icon.js',
  '/config.json'
];

const cacheVersion = 'v33';

self.addEventListener('install', (event) => {
  console.log('Service Worker has been installed')
  event.waitUntil(
    caches.open(cacheVersion)
      .then((cache) => {
        return cache.addAll(filesCached);
      })
      .catch(() => console.log('erreur'))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => {
    return Promise.all(keys
      .filter(key => key !== cacheVersion)
      .map(key => caches.delete(key))
    )
  }));
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const link = `${url.origin}${url.pathname}`;

  if (event.request.method === 'GET' && !excludeFromCache.includes(link)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .then((response) => {
              const responseClone = response.clone();
              caches.open(cacheVersion)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
                return response;
            })
        })
        .catch(() => {
          return caches.match('index.html');
        })
    )
  }
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

