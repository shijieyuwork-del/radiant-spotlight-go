import "@testing-library/jest-dom";

const storage = new Map<string, string>();
const localStorageMock: Storage = {
  get length() { return storage.size; },
  clear: () => storage.clear(),
  getItem: (key) => storage.get(key) ?? null,
  key: (index) => [...storage.keys()][index] ?? null,
  removeItem: (key) => { storage.delete(key); },
  setItem: (key, value) => { storage.set(key, String(value)); },
};
Object.defineProperty(window, "localStorage", { configurable: true, value: localStorageMock });
Object.defineProperty(globalThis, "localStorage", { configurable: true, value: localStorageMock });

Object.defineProperty(HTMLMediaElement.prototype, "play", {
  configurable: true,
  value: () => Promise.resolve(),
});
Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  configurable: true,
  value: () => undefined,
});

// jsdom 缺少 IntersectionObserver（TikTokWall 等懒加载组件依赖）
class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});
Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
