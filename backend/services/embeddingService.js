const { spawn } = require('child_process');
const path = require('path');

const PYTHON_SCRIPT_PATH = path.join(__dirname, '..', 'utils', 'embedding_model.py');
const PYTHON_EXECUTABLE = process.env.PYTHON || 'python';

function runPythonEmbeddingModel(text) {
  return new Promise((resolve, reject) => {
    const child = spawn(PYTHON_EXECUTABLE, [PYTHON_SCRIPT_PATH], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: false,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });

    child.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python embedding model exited with code ${code}. ${stderr.trim()}`));
      }

      try {
        const parsed = JSON.parse(stdout);
        if (!Array.isArray(parsed)) {
          return reject(new Error('Python embedding model returned invalid JSON'));}
        return resolve(parsed);
      } catch (parseError) {
        return reject(new Error(`Unable to parse Python embedding model output: ${parseError.message}. Output: ${stdout.trim()}`));
      }
    });

    child.stdin.write(text);
    child.stdin.end();
  });
}

async function generateEmbedding(text) {
  const normalizedText = typeof text === 'string' ? text.trim() : '';
  if (!normalizedText) {
    return [];
  }

  try {
    const embedding = await runPythonEmbeddingModel(normalizedText);
    if (!Array.isArray(embedding)) {
      return [];
    }
    return embedding.map((value) => Number(value) || 0);
  } catch (error) {
    console.warn('Embedding generation failed:', error.message);
    return [];
  }
}

module.exports = {
  generateEmbedding,
};