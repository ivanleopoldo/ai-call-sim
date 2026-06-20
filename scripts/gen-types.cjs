const { spawn } = require("child_process");
const path = require("path");

const OPENAPI_URL = "http://localhost:8000/openapi.json";
const OUTPUT = "packages/types/src/api.ts";

async function isBackendRunning() {
  try {
    const response = await fetch(OPENAPI_URL);
    return response.ok;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForBackend(timeoutMs = 30000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (await isBackendRunning()) {
      return;
    }
    await sleep(500);
  }

  throw new Error("Timed out waiting for backend.");
}

async function main() {
  let backendProcess = null;

  if (!(await isBackendRunning())) {
    console.log("Backend not running. Starting it...");

    const python =
      process.platform === "win32"
        ? path.join("backend", ".venv", "Scripts", "python.exe")
        : path.join("backend", ".venv", "bin", "python");

    backendProcess = spawn(python, ["-m", "uvicorn", "main:app"], {
      cwd: "backend",
      stdio: "inherit",
    });

    await waitForBackend();
  } else {
    console.log("Backend already running.");
  }

  console.log("Generating types...");

  const openapiTypescript = spawn(
    process.platform === "win32" ? "pnpm.cmd" : "pnpm",
    ["exec", "openapi-typescript", OPENAPI_URL, "-o", OUTPUT],
    {
      stdio: "inherit",
    },
  );

  await new Promise((resolve, reject) => {
    openapiTypescript.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`openapi-typescript exited with ${code}`));
    });
  });

  if (backendProcess) {
    console.log("Stopping temporary backend...");
    backendProcess.kill();
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
