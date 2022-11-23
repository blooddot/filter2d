export async function loadFile(url: string): Promise<string> {
    const content = await fetch(url)
        .then(response => response.text());

    return content;
}

export async function loadJson(url: string): Promise<Record<string, unknown>> {
    const obj = await fetch(url).then(response => response.json());

    return obj;
}

export async function loadGLSL(vertexPath?: string, fragmentPath?: string): Promise<{ vertex: string, fragment: string }> {
    const promises = [
        loadFile(vertexPath),
        loadFile(fragmentPath),
    ];

    const [vertex, fragment] = await Promise.all(promises);
    return { vertex, fragment };
}

export function clamp(low: number, value: number, height: number) {
    return Math.max(low, Math.min(value, height));
}