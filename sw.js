// importScripts('js/sw-utils.js');


const CACHE_STATIC_NAME = 'static-v6';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

const CACHE_DYNAMIC_LIMIT = 50;


function limpiarCache(cacheName, numeroItems) {


    caches.open(cacheName)
        .then(cache => {

            return cache.keys()
                .then(keys => {

                    if (keys.length > numeroItems) {
                        cache.delete(keys[0])
                            .then(limpiarCache(cacheName, numeroItems));
                    }
                });


        });
}




self.addEventListener('install', e => {


    const cacheProm = caches.open(CACHE_STATIC_NAME)
        .then(cache => {

            return cache.addAll([
                // '/',
                'index.html',
                'css/font-awesome.min.css',
                'css/estilos.css',
                'css/bootstrap.css',
                'images/fondo-bienvenido-grande.jpg',
                'images/fondo-bienvenidos.jpg',
                'images/nosotros.svg',
                'js/app.js',
                'js/sw-utils.js'
            ]);


        });

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME)
        .then(cache => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
            'js/bootstrap.min.js',
            'js/jquery.js'));


    e.waitUntil(Promise.all([cacheProm, cacheInmutable]));

});

// Borra los caches que no me sirven borran los static que sean diferentes a la version que indico
self.addEventListener('activate', e => {


    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            // static-v4
            if (key !== CACHE_STATIC_NAME && key.includes('static')) {
                return caches.delete(key);
            }

        });

    });



    e.waitUntil(respuesta);

});





self.addEventListener('fetch', e => {


    // 2- Cache with Network Fallback
    const respuesta = caches.match(e.request)
        .then(res => {

            if (res) return res;

            // No existe el archivo

            return fetch(e.request).then(newResp => {

                    caches.open(CACHE_DYNAMIC_NAME)
                        .then(cache => {
                            cache.put(e.request, newResp);
                            limpiarCache(CACHE_DYNAMIC_NAME, 50);
                        });

                    return newResp.clone();
                })
                .catch(err => {

                    // detecta si es una pagina web
                    if (e.request.headers.get('accept').includes('text/html')) {
                        return caches.match('/pages/offline.html');
                    }


                });


        });




    e.respondWith(respuesta);



});