const fs = require('fs');
const path = require('path');

const envFilePath = path.resolve(__dirname, '.env');
if (fs.existsSync(envFilePath)) {
  const envContent = fs.readFileSync(envFilePath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const apiUrl = process.env['API_URL'] || 'http://localhost:8080';

const environmentContent = `// Este archivo es generado automáticamente por create-env.js
// NO lo edites manualmente ni lo subas al repositorio

export const environment = {
  apiUrl: '${apiUrl}'
};
`;

const targetDir = path.resolve(__dirname, 'SquadUp-Frontend/environments');
const targetPath = path.join(targetDir, 'environment.ts');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(targetPath, environmentContent);
console.log(`environment.ts generado en: ${targetPath}`);