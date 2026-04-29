import { loadPyodide, PyodideInterface } from 'pyodide';

let pyodide: PyodideInterface | null = null;

const initializePyodide = async () => {
  pyodide = await loadPyodide();
  self.postMessage({type: "ready"})
}

self.onmessage = async (event) => {
  const { type, code, files } = event.data;
  if (type === 'init') {
    await initializePyodide();
    return;
  }
  if (type === 'run') {
    const sanitizedCode = code.replace(/\t/g, '    ');
    if(!pyodide) return;
    if(files) {
      for(const[filePath, content] of Object.entries(files as Record<string, string>)) {
        const parts = filePath.split('/');
        let dir = '';
        for (const part of parts.slice(0, -1)) {
          dir = dir ? `${dir}/${part}` : part;
          try {
            pyodide.FS.mkdir(dir);
          } catch {} // ignore if exists
        }
        pyodide.FS.writeFile(filePath, (content as string).replace(/\t/g, '    '));
      }
    }
    try {
      const stdout: string[] = [];
      pyodide.setStdout({ batched: (line) => stdout.push(line) });
      await pyodide.runPythonAsync(sanitizedCode);

      self.postMessage({
        type: 'result',
        stdout: stdout.join('\n')
      });


    } catch (error) {
      self.postMessage({type: "error", message: (error as Error).message});
    }
  }
}