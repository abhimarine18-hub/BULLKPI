import os

search_dir = "e:/Abhi"
target = "do_person"

exclude_dirs = ["node_modules", ".git", "Dropbox", "Google Drive", "AE FILES", "DRONE BACKUP", "Astro", "Vaahan", "ERP", "Astro", "Mobile", "Recording analysis", "B2B", "FOXPOST", "CROXXPOST"]

for root, dirs, files in os.walk(search_dir):
    # filter out excluded dirs
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if file.endswith(('.sql', '.txt', '.md', '.json', '.js', '.ts', '.py')):
            filePath = os.path.join(root, file)
            try:
                with open(filePath, "r", encoding="utf-8", errors="ignore") as f:
                    for line_no, line in enumerate(f, 1):
                        if target in line:
                            print(f"Found in {filePath}:{line_no} -> {line.strip()[:150]}")
            except Exception as e:
                pass
