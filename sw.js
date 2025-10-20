// ========================================
// Service Worker para App de Tareas PWA
// ========================================

// Nombre del caché y versión
const CACHE_NAME = 'app-shell-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

// Archivos del App Shell para cachear
const APP_SHELL_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/data.json',
    '/icons/icon-72.png',
    '/icons/icon-96.png',
    '/icons/icon-128.png',
    '/icons/icon-144.png',
    '/icons/icon-152.png',
    '/icons/icon-192.png',
    '/icons/icon-384.png',
    '/icons/icon-512.png'
];

// ========================================
// Evento INSTALL - Cachear App Shell
// ========================================
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando Service Worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cacheando App Shell');
                return cache.addAll(APP_SHELL_FILES);
            })
            .then(() => {
                console.log('[Service Worker] ✓ App Shell cacheado correctamente');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] ✗ Error al cachear App Shell:', error);
            })
    );
});

// ========================================
// Evento ACTIVATE - Limpiar cachés antiguos
// ========================================
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activando Service Worker...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Eliminar cachés antiguos
                        if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
                            console.log('[Service Worker] Eliminando caché antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] ✓ Service Worker activado y cachés actualizados');
                return self.clients.claim();
            })
    );
});

// ========================================
// Evento FETCH - Estrategia de caché
// ========================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Manejar solicitudes de datos (data.json) con estrategia Network First
    if (request.url.includes('data.json')) {
        event.respondWith(
            networkFirstStrategy(request)
        );
        return;
    }
    
    // Manejar solicitudes del App Shell con estrategia Cache First
    event.respondWith(
        cacheFirstStrategy(request)
    );
});

// ========================================
// Estrategia Cache First (para App Shell)
// ========================================
async function cacheFirstStrategy(request) {
    try {
        // Intentar obtener del caché primero
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            console.log('[Service Worker] Sirviendo desde caché:', request.url);
            return cachedResponse;
        }
        
        // Si no está en caché, intentar obtener de la red
        console.log('[Service Worker] Obteniendo de red:', request.url);
        const networkResponse = await fetch(request);
        
        // Cachear la respuesta de red para futuras solicitudes
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('[Service Worker] Error en Cache First:', error);
        
        // Si falla todo, retornar página offline (opcional)
        return new Response('Offline - No se pudo cargar el recurso', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

// ========================================
// Estrategia Network First (para datos dinámicos)
// ========================================
async function networkFirstStrategy(request) {
    try {
        // Intentar obtener de la red primero
        console.log('[Service Worker] Obteniendo datos de red:', request.url);
        const networkResponse = await fetch(request);
        
        // Cachear la respuesta exitosa
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(DATA_CACHE_NAME);
            cache.put(request, networkResponse.clone());
            console.log('[Service Worker] ✓ Datos actualizados en caché');
        }
        
        return networkResponse;
        
    } catch (error) {
        // Si falla la red, intentar obtener del caché
        console.log('[Service Worker] Red no disponible, usando caché:', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            console.log('[Service Worker] ✓ Sirviendo datos desde caché (offline)');
            return cachedResponse;
        }
        
        // Si no hay caché, retornar datos de respaldo
        console.warn('[Service Worker] No hay datos en caché, usando respaldo');
        return new Response(JSON.stringify([
            { id: 1, task: 'Comprar víveres para la semana', completed: false, priority: 'high' },
            { id: 2, task: 'Terminar informe del proyecto', completed: false, priority: 'high' },
            { id: 3, task: 'Llamar al dentista para cita', completed: true, priority: 'medium' },
            { id: 4, task: 'Revisar correos pendientes', completed: false, priority: 'medium' },
            { id: 5, task: 'Hacer ejercicio 30 minutos', completed: true, priority: 'low' },
            { id: 6, task: 'Leer libro por 20 minutos', completed: false, priority: 'low' }
        ]), {
            status: 200,
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
    }
}

// ========================================
// Mensajes desde la aplicación
// ========================================
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// ========================================
// Log inicial
// ========================================
console.log('[Service Worker] Service Worker cargado y listo');
