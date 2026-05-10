import os, sys
import builtins
from pyodide.ffi import to_js
import python_oop_canvas as _js_canvas

def _setup(files, module_dir):
    for path in files:
        sys.modules.pop(path.split('/')[-1].replace('.py', ''), None)
    for path, content in files.items():
        dir_ = '/'.join(path.split('/')[:-1])
        if dir_:
            os.makedirs(f'/{dir_}', exist_ok=True)
        with open(f'/{path}', 'w') as f:
            f.write(content.replace('\t', '    '))
    if module_dir not in sys.path:
        sys.path.insert(0, module_dir)

    if module_dir:
        os.chdir(module_dir)


class _Canvas:
    def draw_image(self, path, dx, dy, dw=None, dh=None):
        with open(path, 'rb') as f:
            data = to_js(f.read())
        _js_canvas.draw_image(data, dx, dy, dw, dh)

    def draw_line(self, x1, y1, x2, y2, color='black'):
        _js_canvas.draw_line(x1, y1, x2, y2, color)


builtins.python_oop_canvas = _Canvas()
