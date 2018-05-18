/* eslint-disable no-undef */

export function initVibrate(forWhat) {
    let duration = forWhat === 'message'
        ? 500
        : [200, 100, 200];

    return navigator.vibrate(duration);
}
