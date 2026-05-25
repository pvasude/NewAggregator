// In Jest's ESM mode (--experimental-vm-modules), `jest` is not automatically
// injected as a global the way CJS test files expect. Import it explicitly and
// attach it to globalThis so test files can reference `jest.spyOn(...)` etc.
// without needing to import from '@jest/globals' themselves.
import { jest } from '@jest/globals';
(globalThis as unknown as { jest: typeof jest }).jest = jest;
