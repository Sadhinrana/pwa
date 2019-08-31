'use strict';

// Static Files as version
var staticCache = 'v0.01';

// Files to cache
var files = [
    './',
    './index.html',
    './img/icons/icon-72X72.png',
    './img/icons/icon-96X96.png',
    './img/icons/icon-128X128.png',
    './img/icons/icon-144X144.png',
    './img/icons/icon-152X152.png',
    './img/about-bg.jpg',
    './img/banner_bg.jpg',
    './img/blog-bg.jpg',
    './img/blog_item_01.jpg',
    './img/blog_item_02.jpg',
    './img/blog_item_03.jpg',
    './img/blog_item_04.jpg',
    './img/close.png',
    './img/loading.gif',
    './img/next.png',
    './img/portfolio_big_item_01.jpg',
    './img/portfolio_big_item_02.jpg',
    './img/portfolio_big_item_03.jpg',
    './img/portfolio_big_item_04.jpg',
    './img/portfolio_big_item_05.jpg',
    './img/portfolio_big_item_06.jpg',
    './img/portfolio_item_01.jpg',
    './img/portfolio_item_02.jpg',
    './img/portfolio_item_03.jpg',
    './img/portfolio_item_04.jpg',
    './img/portfolio_item_05.jpg',
    './img/portfolio_item_06.jpg',
    './img/prev.png',
    './img/service_icon_01.png',
    './img/service_icon_02.png',
    './img/service_icon_03.png',
    './img/service_icon_04.png',
    './js/vendor/bootstrap.js',
    './js/vendor/bootstrap.min.js',
    './js/vendor/jquery-1.11.2.min.js',
    './js/vendor/modernizr-2.8.3-respond-1.4.2.min.js',
    './js/vendor/npm.js',
    './js/main.js',
    './js/plugins.js',
    './css/fonts/flexslider-icon.eot',
    './css/fonts/flexslider-icon.svg',
    './css/fonts/flexslider-icon.ttf',
    './css/fonts/flexslider-icon.wotf',
    './css/bootstrap.css',
    './css/bootstrap.css.map',
    './css/bootstrap.min.css',
    './css/bootstrap-theme.min.css',
    './css/bootstrap-theme.css.map',
    './css/fontAwesome.css',
    './css/hero-slider.css',
    './css/lightbox.css',
    './css/owl-carousel.css',
    './css/templatemo-style.css',
];

// Install for service worker
self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(staticCache).then(cache => {
            return cache
                .addAll(files)
                .then(() => console.log('App Version: ' + staticCache))
                .catch(err => console.error('Error adding files to cache', err));
        }),
    );
});

// Activate for Delete old cache & store new cache
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== staticCache) {
                        console.info('Deleting Old Cache', cache);
                        return caches.delete(cache);
                    }
                }),
            );
        }),
    );
    return self.clients.claim();
});

// Fetch network cache first asynchronization
self.addEventListener('fetch', e => {
    const req = e.request;
    const url = new URL(req.url);
    if (url.origin === location.origin)
        return e.respondWith(cacheFirst(req));
    else
        return e.respondWith(networkFirst(req));
});

async function cacheFirst(req) {
    let cacheRes = await caches.match(req);
    return cacheRes || fetch(req);
}

async function networkFirst(req) {
    const dynamicCache = await caches.open('dynamic');
    try {
        const networkResponse = await fetch(req);
        if (req.method !== 'POST') dynamicCache.put(req, networkResponse.clone());
        return networkResponse;
    } catch (err) {
        const cacheResponse = await caches.match(req); return cacheResponse;
    }
}