self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim()
});

self.addEventListener('fetch', event => {
  if (event.request.url.endsWith("svg")) {
    // Redirect all `svg` files to the IC logo.
    let request = new Request("https://internetcomputer.org/img/IC_logo_horizontal.svg", event.request);
    console.log(request.url);
    event.respondWith(fetch(request));
  }
});
