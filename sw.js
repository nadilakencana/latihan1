const CACHE_NAME = "latihan1_2";
var urlsToCache = [
    "/", 
    "/index.html",
    "/article.html", 
    "/img/icon5.png",
    "/img/icon2.png",
    "/img/icon1.jpg",
    "/img/kontent1.jpg",
    "/img/kontent2.jpg",
    "/img/kontent3.jpg",
    "/pages/about.html",
    "/pages/home.html",
    "/pages/contact.html",
    "/js/materialize.min.js",
    "/css/materialize.min.css",
    "/manifest.json",
    "/js/nav.js",
    "/js/api.js"

];
 
self.addEventListener("install", function(event) {
  console.log("ServiceWorker: Menginstall..");
 
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("ServiceWorker: Membuka cache..");
      return cache.addAll(urlsToCache);
    })
  );
});
self.addEventListener("fetch", function(event) {
  var base_url = "https://readerapi.codepolitan.com/";

  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(function(response) {
        return response || fetch (event.request);
      })
    )
  }
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});