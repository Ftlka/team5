/* eslint-disable no-undef */

export function initVibrate(forWhat) {
    let duration = forWhat === 'message'
        ? 500
        : [200, 100, 200];
    console.info(forWhat);

    return navigator.vibrate(duration);
}
