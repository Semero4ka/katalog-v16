var CACHE_NAME = 'catalog-v16';
var ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE_NAME).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  e.respondWith(caches.match(e.request).then(function(r){ return r || fetch(e.request).then(function(res){
    return caches.open(CACHE_NAME).then(function(c){ c.put(e.request, res.clone()); return res; });
  }).catch(function(){ return caches.match('./index.html'); })); });
});
