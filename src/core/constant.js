window.imageWidth = 400;
window.imageHeight = 486;
export const gl = (() => {
    const canvas = document.getElementById('webgl');
    canvas.setAttribute('width', String(window.imageWidth));
    canvas.setAttribute('height', String(window.imageHeight));
    return canvas.getContext('experimental-webgl', { premultipliedAlpha: false });
})();
