const { spawn } = require('child_process');
const path = require('path');

const PYTHON_SCRIPT_PATH = path.join(__dirname, '..', 'utils', 'emotion_model.py');

function runPythonEmotionModel(text) {
  return new Promise((resolve, reject) => {
    const python = process.env.PYTHON || 'python';
    const child = spawn(python, [PYTHON_SCRIPT_PATH, text], {
      stdio: ['ignore', 'pipe', 'pipe'],
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
        return reject(new Error(`Python emotion model exited with code ${code}. ${stderr.trim()}`));
      }

      try {
        const parsed = JSON.parse(stdout);
        if (!Array.isArray(parsed)) {
          return reject(new Error('Python emotion model returned invalid JSON'));}
        return resolve(parsed);
      } catch (parseError) {
        return reject(new Error(`Unable to parse Python emotion model output: ${parseError.message}. Output: ${stdout.trim()}`));
      }
    });
  });
}

async function detectEmotion(text) {
  const normalizedText = typeof text === 'string' ? text.trim() : '';

  if (!normalizedText) {
    return [];
  }

  try {
    const result = await runPythonEmotionModel(normalizedText);
    return result.map((item) => ({
      label: String(item.label || '').trim(),
      score: Number(item.score || 0),
    })).slice(0, 3);
  } catch (error) {
    console.warn('Emotion detection failed:', error.message);
    return [];
  }
}

module.exports = {
  detectEmotion,
};