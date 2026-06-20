const { spawn } = require("child_process");
const path = require("path");

const python =
  process.platform === "win32"
    ? path.join("backend", ".venv", "Scripts", "python.exe")
    : path.join("backend", ".venv", "bin", "python");

spawn(python, ["-m", "uvicorn", "main:app", "--reload"], {
  cwd: "backend",
  stdio: "inherit",
});
