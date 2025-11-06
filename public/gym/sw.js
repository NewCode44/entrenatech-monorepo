// Entrenatech Service Worker
const CACHE_NAME = 'entrenatech-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - Cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Entrenatech SW: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Entrenatech SW: Cache install failed', error);
      })
  );
  self.skipWaiting();
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Entrenatech SW: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response for cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
          });
      })
  );
});

// Background sync for workout data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-workout-data') {
    event.waitUntil(syncWorkoutData());
  }
});

function syncWorkoutData() {
  return fetch('/api/sync-workouts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Entrenatech SW: Workout data synced', data);
  })
  .catch(error => {
    console.error('Entrenatech SW: Workout sync failed', error);
  });
}

// Push notifications for workout reminders and motivational messages
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || '¡Es hora de entrenar! 💪 Tu rutina te está esperando',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'entrenatech-notification',
    image: data.image || '/images/workout-motivation.jpg',
    actions: [
      {
        action: 'start-workout',
        title: '🔥 Empezar Ahora',
        icon: '/icons/start-icon.png'
      },
      {
        action: 'view-schedule',
        title: '📅 Ver Horario',
        icon: '/icons/schedule-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Después',
        icon: '/icons/dismiss-icon.png'
      }
    ],
    data: {
      url: data.url || '/workouts',
      timestamp: Date.now(),
      workoutId: data.workoutId
    },
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification('Entrenatech Fitness', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'start-workout') {
    event.waitUntil(
      clients.openWindow('/workouts/current')
    );
  } else if (event.action === 'view-schedule') {
    event.waitUntil(
      clients.openWindow('/schedule')
    );
  } else {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Handle periodic background sync for fitness tracking
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'fitness-data-sync') {
    event.waitUntil(syncFitnessData());
  }
});

function syncFitnessData() {
  return fetch('/api/sync-fitness-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Entrenatech SW: Fitness data synced', data);
    // Update local cache with latest fitness data
    return updateFitnessCache(data);
  })
  .catch(error => {
    console.error('Entrenatech SW: Fitness data sync failed', error);
  });
}

function updateFitnessCache(data) {
  return caches.open(CACHE_NAME)
    .then(cache => {
      return cache.put('/api/fitness-data', new Response(JSON.stringify(data)));
    });
}