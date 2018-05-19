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

self.addEventListener('notificationclick', e => {
    e.notification.close();

    let path = e.target.origin + '/';
    e.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(clientList => {
            for (const client of clientList) {
                if (client.url === path && 'focus' in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
