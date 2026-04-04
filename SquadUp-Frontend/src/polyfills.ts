// Polyfill para librerías Node.js (stompjs, sockjs-client)
// que usan la variable global típica de Node pero no disponible en el navegador.
(window as any).global = window;
