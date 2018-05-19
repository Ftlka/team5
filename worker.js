/* eslint-disable no-undef */

self.addEventListener('push', e => {
    const data = e.data.json();

    e.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(clients => {
            if (!clients[0] || !clients[0].focused) {
                return self.registration.showNotification(data.title, {
                    body: data.body,
                    icon: '/static/images/logo.png'
                });
            }
        })
    );
});
