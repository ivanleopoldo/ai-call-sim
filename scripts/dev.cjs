const { spawn } = require("child_process");
const path = require("path");

const backendDir = path.join(__dirname, "..", "backend");

const python =
  process.platform === "win32"
    ? path.join(backendDir, ".venv", "Scripts", "python.exe")
    : path.join(backendDir, ".venv", "bin", "python");

const child = spawn(
  python,
  ["-m", "uvicorn", "main:app", "--reload", "--port", "8000"],
  {
    cwd: backendDir,
    stdio: "inherit",
  },
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
