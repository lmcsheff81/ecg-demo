import "@testing-library/jest-dom/extend-expect";

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}

window.matchMedia = (query: string) => {
  return {
    media: query,
    matches: false,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

console.warn = jest.fn();
console.error = jest.fn();
