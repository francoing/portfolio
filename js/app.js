var url = window.location.href;
var swLocation = '/portfolio/sw.js'

if (navigator.serviceWorker) {

    if (url.includes('localhost')) {
        swLocation = '/sw.js';
    }
    navigator.serviceWorker.register(swLocation);
}
// if (navigator.serviceWorker) {
//     navigator.serviceWorker.register('/sw.js');
// }