//imports
importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v2';

// Corazon de mi aplicacion
const APP_SHELL = [

    // En produccion tengo que comentar esta linea por que me genera problemas
    '/',
    'index.html',
    'js/app.js',
    'js/sw-utils.js',
    'css/font-awesome.min.css',
    'css/estilos.css',
    'css/bootstrap.css',
    'images/fondo-bienvenido-grande.jpg',
    'images/fondo-bienvenidos.jpg',
    'images/nosotros.svg'



];

const APP_SHELL_INMUTABLE = [


    'js/bootstrap.min.js',
    'js/jquery.js',

];

self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL)
    );

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE)
    );





    // mando las dos promesas 

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});

self.addEventListener('activate', e => {

    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            // static-v4
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }

        });

    });



    e.waitUntil(respuesta);



})

self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request).then(res => {

        if (res) {
            return res;
        } else {
            console.log('no existe:', e.request.url);
            return fetch(e.request).then(newRes => {
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes)
            })

        }
    })


    e.respondWith(respuesta);
    // event.waitUntil();
});