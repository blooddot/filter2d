export async function loadFile(url: string): Promise<string> {
    const content = await fetch(url).then(response => response.text());

    return content;
}

export async function loadJson(url: string): Promise<Record<string, unknown>> {
    const obj = await fetch(url).then(response => response.json());

    return obj;
}

export async function loadGLSL(name: string): Promise<{ vertex: string, fragment: string }> {
    const promises = [
        loadFile(`${name}.vs`),
        loadFile(`${name}.fs`),
    ];

    const [vertex, fragment] = await Promise.all(promises);
    return { vertex, fragment };
}