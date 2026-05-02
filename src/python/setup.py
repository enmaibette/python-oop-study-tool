import os, sys

def _setup(files, module_dir):
    for path in list(files):
        sys.modules.pop(path.split('/')[-1].replace('.py', ''), None)
    for path, content in files.items():
        dir_ = '/'.join(path.split('/')[:-1])
        if dir_:
            os.makedirs(f'/{dir_}', exist_ok=True)
        with open(f'/{path}', 'w') as f:
            f.write(content.replace('\t', '    '))
    if module_dir not in sys.path:
        sys.path.insert(0, module_dir)

    os.chdir(module_dir)