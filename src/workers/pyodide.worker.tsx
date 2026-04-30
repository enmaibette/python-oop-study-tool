import setupPy from '@/python/setup.py?raw';

const initializePyodide = async () => {
  pyodide = await loadPyodide();
  await pyodide.runPythonAsync(setupPy);
  isReady = true;
  self.postMessage({ type: 'ready' });
};

import { loadPyodide, PyodideInterface } from 'pyodide';
let pyodide: PyodideInterface | null = null;

let isReady = false;

self.onmessage = async (event) => {
  const { type, code, files, activeFilePath } = event.data;
  if (type === 'init') {
    await initializePyodide();
    return;
  }
  if (type === 'run') {
    const sanitizedCode = code.replace(/\t/g, '    ');
    console.log('isReady: ' + isReady);
    if (!pyodide || !isReady) return;

    const dir = activeFilePath?.split('/').slice(0, -1).join('/') ?? '';
    try {
      pyodide.globals.get('_setup')(
        pyodide.toPy((files ?? {}) as Record<string, string>),
        dir ? `/${dir}` : ''
      );
      const stdout: string[] = [];
      pyodide.setStdout({ batched: (line) => stdout.push(line) });
      await pyodide.runPythonAsync(sanitizedCode);
      self.postMessage({ type: 'result', stdout: stdout.join('\n') });
    } catch (error) {
      self.postMessage({ type: 'error', message: (error as Error).message });
    }
  }
};
