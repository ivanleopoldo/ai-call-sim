const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const backendDir = path.join(__dirname, "..", "backend");

const isWindows = process.platform === "win32";

const python = isWindows ? "python" : "python3";

console.log("Creating Python virtual environment...");

if (!fs.existsSync(path.join(backendDir, ".venv"))) {
  const result = spawnSync(python, ["-m", "venv", ".venv"], {
    cwd: backendDir,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status);
  }
} else {
  console.log("Virtual environment already exists.");
}

const pip = isWindows
  ? path.join(backendDir, ".venv", "Scripts", "pip.exe")
  : path.join(backendDir, ".venv", "bin", "pip");

console.log("Installing Python dependencies...");

const result = spawnSync(pip, ["install", "-r", "requirements.txt"], {
  cwd: backendDir,
  stdio: "inherit",
});

if (result.status !== 0) {
  process.exit(result.status);
}

console.log("Setup complete.");
