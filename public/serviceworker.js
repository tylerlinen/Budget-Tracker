const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/db.js',
    '/index.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
];

const PRECACHE = 'precache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(PRECACHE)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
    );
});



self.addEventListener('fetch', (event) => {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then((cache) => {
                return fetch(event.request).then((response) => {
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                })
                    .catch(err => {

                        return cache.match(event.request);
                    });
            }).catch(err => console.log(err))
        );

        return;
    }
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request).then(function (response) {
                if (response) {
                    return response;
                } else if (event.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/");
                }
            });
        })
    );
});
