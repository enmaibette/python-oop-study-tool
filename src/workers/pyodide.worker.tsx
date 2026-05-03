import { loadPyodide, PyodideInterface } from 'pyodide';
import { version } from 'pyodide/package.json';
import setupPy from '@/python/setup.py?raw';
import runnerPy from '@/python/runner.py?raw';

let pyodide: PyodideInterface | null = null;
let isReady = false;

const canvas = {
  draw_line: (x1: number, y1: number, x2: number, y2: number, color = 'black') => {
    self.postMessage({ type: 'gfx', cmd: 'drawLine', args: [x1, y1, x2, y2, color] });
  },
};
const initializePyodide = async () => {
  pyodide = await loadPyodide({
    indexURL: `https://cdn.jsdelivr.net/pyodide/v${version}/full/`,
  });
  await pyodide.runPythonAsync(setupPy);
  pyodide.FS.writeFile('/runner.py', runnerPy);
  await pyodide.runPythonAsync(`import sys\nif '/' not in sys.path: sys.path.insert(0, '/')`);
  pyodide!.registerJsModule('python_oop_canvas', canvas);
  await pyodide!.runPythonAsync(
    'import python_oop_canvas, builtins; builtins.python_oop_canvas = python_oop_canvas'
  );
  isReady = true;
  self.postMessage({ type: 'ready' });
};



const runCode = async (
  code: string,
  activeFilePath: string | null,
  files: Record<string, string>
) => {
  self.postMessage({ type: 'gfx', cmd: 'clear', args: [] });
  const sanitizedCode = code.replace(/\t/g, '    ');
  const dir = activeFilePath?.split('/').slice(0, -1).join('/') ?? '';

  pyodide!.globals.get('_setup')(
    pyodide!.toPy(files ?? {}),
    dir ? `/${dir}` : ''
  );
  const stdout: string[] = [];
  pyodide!.setStdout({ batched: (line: string) => stdout.push(line) });
  await pyodide!.runPythonAsync(sanitizedCode);

  self.postMessage({ type: 'result', stdout: stdout.join('\n') });
};

self.onmessage = async (event) => {
  const { type, code, files, activeFilePath, testcasePy } = event.data;
  if (type === 'init') {
    await initializePyodide();
    return;
  }
  if (!pyodide || !isReady) return;

  if (type === 'run') {
    try {
      await runCode(code, activeFilePath, files);
    } catch (error) {
      self.postMessage({ type: 'error', message: (error as Error).message });
    }
  }

  if (type === 'submit') {
    try {
      await runCode(code, activeFilePath, files);

      const testStdout: string[] = [];
      pyodide.setStdout({ batched: (line: string) => testStdout.push(line) });
      await pyodide.runPythonAsync(testcasePy);

      const results = JSON.parse(testStdout[testStdout.length - 1] ?? '[]');
      self.postMessage({ type: 'submit_result', results });
    } catch (error) {
      self.postMessage({ type: 'submit_error', message: (error as Error).message });
    }
  }
};
