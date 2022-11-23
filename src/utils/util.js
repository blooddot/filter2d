var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function loadFile(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield fetch(url)
            .then(response => response.text());
        return content;
    });
}
export function loadJson(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const obj = yield fetch(url).then(response => response.json());
        return obj;
    });
}
export function loadGLSL(vertexPath, fragmentPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = [
            loadFile(vertexPath),
            loadFile(fragmentPath),
        ];
        const [vertex, fragment] = yield Promise.all(promises);
        return { vertex, fragment };
    });
}
export function clamp(low, value, height) {
    return Math.max(low, Math.min(value, height));
}
