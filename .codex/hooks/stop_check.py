from pathlib import Path

required = [
    Path("AGENTS.md"),
    Path("docs/harness/verification-gates.md"),
    Path("docs/harness/prompt-log.md"),
]

missing = [str(path) for path in required if not path.exists()]
if missing:
    raise SystemExit(f"Missing harness files: {', '.join(missing)}")

print("Harness files present.")

