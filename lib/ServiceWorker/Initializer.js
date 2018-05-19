/* eslint-disable no-undef */
import axios from 'axios';

const publicVapidKey =
    'BGMX07EnIjwBnnFWt9_qFOKF3rfGKY-MTrJO_iqILUwX4I_QreLZlOc98TpQYa30sSsiN5H-A_qas5YCTL1DSN0';

export async function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        const status = await Notification.requestPermission();
        if (status !== 'granted') {
            return;
        }

        register();
    }
}

function register() {

    navigator.serviceWorker.register('worker.js');

    navigator.serviceWorker.ready.then(async (reg) => {
        const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        await axios.post('/api/subscribe', subscription,
            { withCredentials: true, responseType: 'json' });
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+') // eslint-disable-line
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}
