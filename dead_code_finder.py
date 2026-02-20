import os
import re

def get_all_files(directory, extensions):
    files = []
    for root, _, filenames in os.walk(directory):
        if 'node_modules' in root or '.git' in root or '__pycache__' in root:
            continue
        for filename in filenames:
            if any(filename.endswith(ext) for ext in extensions):
                files.append(os.path.join(root, filename))
    return files

def check_unused():
    with open('unused.txt', 'w', encoding='utf-8') as out_file:
        out_file.write("--- DEAD CODE SCANNING ---\n")
        
        frontend_dir = r"c:\Uni\Projekte\f1-predictions\src"
        backend_dir = r"c:\Uni\Projekte\f1-predictions\api"
        
        ts_files = get_all_files(frontend_dir, ['.ts', '.tsx'])
        css_files = get_all_files(frontend_dir, ['.css'])
        py_files = get_all_files(backend_dir, ['.py'])
        
        all_ts_content = ""
        for f in ts_files:
            try:
                with open(f, 'r', encoding='utf-8') as file:
                    all_ts_content += file.read() + "\n"
            except Exception:
                pass
                
        out_file.write("\n[FRONTEND] Potentially unused TS/TSX files:\n")
        for f in ts_files:
            basename = os.path.basename(f)
            name_no_ext = os.path.splitext(basename)[0]
            if name_no_ext in ['main', 'App', 'vite-env.d', 'f1-presets']:
                continue
            if all_ts_content.count(name_no_ext) < 2:
                out_file.write(f"- {f}\n")

        out_file.write("\n[CSS] Potentially unused CSS files:\n")
        for f in css_files:
            basename = os.path.basename(f)
            if basename not in all_ts_content:
                out_file.write(f"- {f}\n")
                
        out_file.write("\n[CSS] Checking for unused CSS classes in F1Footer and F1Header:\n")
        for css_file in css_files:
            if 'F1Footer.css' in css_file or 'F1Header.css' in css_file:
                try:
                    with open(css_file, 'r', encoding='utf-8') as file:
                        content = file.read()
                        classes = re.findall(r'\.([a-zA-Z0-9_-]+)\s*\{', content)
                        for c in set(classes):
                            if c not in all_ts_content:
                                out_file.write(f"- Unused class '{c}' in {os.path.basename(css_file)}\n")
                except Exception:
                    pass
                    
        out_file.write("\n[BACKEND] Potentially unused Python files:\n")
        all_py_content = ""
        for f in py_files:
            try:
                with open(f, 'r', encoding='utf-8') as file:
                    all_py_content += file.read() + "\n"
            except Exception:
                pass
                
        for f in py_files:
            basename = os.path.basename(f)
            name_no_ext = os.path.splitext(basename)[0]
            if name_no_ext in ['index', 'dev_server', '__init__']:
                continue
            if all_py_content.count(name_no_ext) < 2:
                out_file.write(f"- {f}\n")

if __name__ == "__main__":
    check_unused()
