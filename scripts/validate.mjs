import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const fail = (message) => {
  console.error(`[validate] ${message}`);
  process.exitCode = 1;
};

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (pkg.name !== 'dsh-zhixun') fail('package name must be dsh-zhixun');
if (pkg.private === true) fail('package must not be private');
if (pkg.dsh?.bundle?.patch !== './cordis.patch.yml') fail('dsh.bundle.patch is missing');
if (pkg.dsh?.client?.platform !== 'web') fail('dsh.client.platform must be web');

for (const file of ['index.js', 'client.js', 'cordis.patch.yml', 'icon.svg', 'locale/zh.json', 'locale/en.json']) {
  if (!fs.existsSync(path.join(root, file))) fail(`missing ${file}`);
}

const forbidden = [
  ['DEEPSEEK_API_KEY', /DEEPSEEK_API_KEY/],
  ['api.deepseek.com', /api\.deepseek\.com/],
  ['OpenAI key', /sk-[A-Za-z0-9]{16,}/],
  ['match-service', /match-service/],
  ['127.0.0.1:50777', /50777/],
];

for (const file of ['index.js', 'client.js', 'README.md']) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const [label, pattern] of forbidden) {
    if (pattern.test(text)) fail(`${file} contains forbidden ${label}`);
  }
}

if (!process.exitCode) {
  console.log(`[validate] ${pkg.name}@${pkg.version} is structurally valid`);
}
