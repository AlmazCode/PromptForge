import os
from pathlib import Path

PROJECT_DIR = Path(__file__).parent
OUTPUT_FILE = PROJECT_DIR / "project_dump.txt"

INCLUDE_EXTENSIONS = {".html", ".css", ".js", ".md", ".json", ".py", ".svg"}
EXCLUDE_DIRS = {".git", ".vscode", "node_modules", "__pycache__"}
EXCLUDE_FILES = {"project_dump.txt", ".gitignore"}


def collect_files():
    files = []
    for root, dirs, filenames in os.walk(PROJECT_DIR):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for name in sorted(filenames):
            if name in EXCLUDE_FILES:
                continue
            path = Path(root) / name
            if path.suffix in INCLUDE_EXTENSIONS:
                files.append(path)
    return sorted(files, key=lambda p: (p.suffix, str(p.relative_to(PROJECT_DIR))))


def build_dump(files):
    lines = []
    lines.append(f"{'=' * 60}")
    lines.append(f"PromptForge — project source dump")
    lines.append(f"Files: {len(files)}")
    lines.append(f"{'=' * 60}")
    lines.append("")

    for f in files:
        rel = f.relative_to(PROJECT_DIR)
        try:
            content = f.read_text(encoding="utf-8")
        except Exception as e:
            content = f"[ERROR reading file: {e}]"

        lines.append(f"{'─' * 60}")
        lines.append(f"FILE: {rel}")
        lines.append(f"{'─' * 60}")
        lines.append(content)
        lines.append("")

    return "\n".join(lines)


def main():
    files = collect_files()
    dump = build_dump(files)
    OUTPUT_FILE.write_text(dump, encoding="utf-8")
    print(f"Dumped {len(files)} files → {OUTPUT_FILE.name}")


if __name__ == "__main__":
    main()
