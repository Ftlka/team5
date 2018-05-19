/* eslint-disable no-undef */
console.info('Service Worker Loaded...');

self.addEventListener('push', e => {
    const data = e.data.json();
    console.info('Push Recieved...');

    e.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(clients => {
            if (!clients[0] || !clients[0].focused) {
                return self.registration.showNotification(data.title, {
                    body: data.body
                });
            }
        })
    );
});
