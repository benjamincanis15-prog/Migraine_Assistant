/* Migraine Assistant — Service Worker (v3.2)
   Rôle : rendre l'app installable et 100 % utilisable hors connexion,
   et afficher les notifications de rappel. Aucune donnée n'est envoyée nulle part. */
const CACHE = "migraine-assistant-v3.2";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(ASSETS.map((a) => c.add(new Request(a, { cache: "reload" })).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k.startsWith("migraine-assistant-")).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* La page demande elle-même sa mise en cache (utile si le fichier ne s'appelle pas index.html). */
self.addEventListener("message", (e) => {
  if (e.data && e.data.cache) e.waitUntil(caches.open(CACHE).then((c) => c.add(e.data.cache)).catch(() => {}));
});

self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return; /* ex. météo : jamais mise en cache */
  if (r.mode === "navigate") {
    /* Cache d'abord (instantané, même sans réseau), mise à jour en arrière-plan. */
    e.respondWith(
      caches.match(r, { ignoreSearch: true }).then((hit) => {
        const net = fetch(r)
          .then((res) => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); } return res; })
          .catch(() => null);
        if (hit) return hit;
        return net.then((res) => res || caches.match("./index.html") || caches.match("./"));
      })
    );
    return;
  }
  e.respondWith(
    caches.match(r).then((hit) => hit || fetch(r).then((res) => {
      if (res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); }
      return res;
    }).catch(() => hit))
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  /* data.m = moment du journal (matin, midi, soir) ; data.med = identifiant du rappel de médicament */
  const d = e.notification.data || {}, msg = d.m ? { j: d.m } : d.med ? { med: d.med } : null;
  const hash = d.m ? "#j=" + d.m : d.med ? "#med=" + d.med : "";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
      if (cs.length) { const c = cs[0]; if (msg) c.postMessage(msg); return c.focus(); }
      return self.clients.openWindow("./" + hash);
    })
  );
});
