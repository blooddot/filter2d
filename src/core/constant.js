export const gl = (() => {
    const canvas = document.getElementById('webgl');
    canvas.setAttribute('width', '400');
    canvas.setAttribute('height', '486');
    return canvas.getContext('experimental-webgl', { premultipliedAlpha: false });
})();
