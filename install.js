#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const prompts = require('prompts');
const yaml = require('yaml');

const CWD = process.cwd();
const MODULE_DIR = __dirname;

const BMAD_FOLDER_NAME = '_bmad';

// ─── BMAD Discovery ────────────────────────────────────────────────────────────────

async function findBmadDir(projectDir) {
  if (fs.existsSync(path.join(projectDir, BMAD_FOLDER_NAME, '_config', 'manifest.yaml'))) {
    return path.join(projectDir, BMAD_FOLDER_NAME);
  }
  const globalPath = path.join(os.homedir(), '.bmad');
  if (fs.existsSync(path.join(globalPath, '_config', 'manifest.yaml'))) {
    return globalPath;
  }
  return null;
}

async function getInstalledIdes(bmadDir) {
  const manifestPath = path.join(bmadDir, '_config', 'manifest.yaml');
  if (!fs.existsSync(manifestPath)) return [];
  const content = fs.readFileSync(manifestPath, 'utf8');
  const manifest = yaml.parse(content);
  return manifest?.ides || [];
}

function loadPlatformCodes() {
  const platformCodesPath = path.join(MODULE_DIR, 'platform-codes.yaml');
  if (!fs.existsSync(platformCodesPath)) {
    const fallbackPath = path.join(MODULE_DIR, '..', 'BMAD-METHOD', 'tools', 'installer', 'ide', 'platform-codes.yaml');
    if (fs.existsSync(fallbackPath)) {
      return yaml.parse(fs.readFileSync(fallbackPath, 'utf8'));
    }
    return null;
  }
  return yaml.parse(fs.readFileSync(platformCodesPath, 'utf8'));
}

function getTargetDirForIde(platformCodes, ide) {
  return platformCodes?.platforms?.[ide]?.installer?.target_dir || '.agents/skills';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`  ✅ ${path.relative(CWD, dest)}`);
}

function copyDirContents(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirContents(srcPath, destPath);
    else copyFile(srcPath, destPath);
  }
}

function mergeAgentFile(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(path.dirname(dest));
  const extension = fs.readFileSync(src, 'utf8');
  const marker = '## BMAD Coding Standards Extension';
  if (fs.existsSync(dest)) {
    const existing = fs.readFileSync(dest, 'utf8');
    if (existing.includes(marker)) {
      console.log(`  ⏭  ${path.relative(CWD, dest)} (already extended)`);
      return;
    }
    fs.writeFileSync(dest, `${existing}\n\n---\n\n${extension}`);
    console.log(`  🔀 ${path.relative(CWD, dest)} (merged)`);
  } else {
    fs.writeFileSync(dest, extension);
    console.log(`  ✅ ${path.relative(CWD, dest)} (created)`);
  }
}

// ─── Discover providers and their languages ──────────────────────────────────

function getProviders() {
  const guidesDir = path.join(MODULE_DIR, 'data', 'style-guides');
  if (!fs.existsSync(guidesDir)) return [];
  return fs.readdirSync(guidesDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => {
      const providerDir = path.join(guidesDir, e.name);
      const languages = fs.readdirSync(providerDir, { withFileTypes: true })
        .filter(l => l.isDirectory())
        .map(l => l.name);
      return { name: e.name, languages };
    });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Check for local installation first
  const bmadDir = await findBmadDir(CWD);

  if (!bmadDir) {
    console.error('\n❌ No BMAD installation found.');
    console.error('   No _bmad/ in current directory and no global installation (~/.bmad/).');
    console.error('   Run `npx bmad-method install` first, then re-run:\n');
    console.error('   npx @flothemaker/bmad-coding-standards\n');
    process.exit(1);
  }

  // Get installed IDEs and determine target directory
  const ides = await getInstalledIdes(bmadDir);
  const platformCodes = loadPlatformCodes();

  console.log('\n📐 BMAD Coding Standards — Installer\n');
  console.log(`   BMAD location: ${bmadDir}`);
  console.log(`   Installed IDEs : ${ides.join(', ')}\n`);

  if (ides.length === 0) {
    console.error('   ⚠ No IDEs configured in this BMAD installation.');
    console.error('   Please run bmad-method install with IDE selection first.\n');
    process.exit(1);
  }

  const providers = getProviders();
  if (providers.length === 0) {
    console.error('\n❌ No providers found in data/style-guides/.\n');
    process.exit(1);
  }

  // Read currently active provider
  const projectDataDir = path.join(CWD, '_bmad', 'data');
  const projectActiveProviderFile = path.join(projectDataDir, 'active-coding-standards.md');
  let currentProvider = null;
  if (fs.existsSync(projectActiveProviderFile)) {
    const match = fs.readFileSync(projectActiveProviderFile, 'utf8').match(/^provider:\s*(\S+)/m);
    if (match) currentProvider = match[1];
  }

  console.log('\n📐 BMAD Coding Standards — Installer\n');
  if (currentProvider) {
    console.log(`   Currently active provider: ${currentProvider}\n`);
  }

  const providerChoices = providers.map(p => ({
    title: p.name.charAt(0).toUpperCase() + p.name.slice(1),
    value: p.name,
    description: `Languages: ${p.languages.join(', ')}` +
                 (currentProvider === p.name ? ' (currently active)' : '')
  }));

  const response = await prompts([
    {
      type: 'select',
      name: 'provider',
      message: 'Which style guide provider do you want to use?',
      choices: providerChoices,
      initial: currentProvider
        ? Math.max(0, providers.findIndex(p => p.name === currentProvider))
        : 0
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: prev => `Install "${prev}" coding standards into _bmad/?`,
      initial: true
    }
  ]);

  if (!response.confirm) {
    console.log('\n⏹  Cancelled.\n');
    process.exit(0);
  }

  const selectedProvider = response.provider;
  const selectedMeta = providers.find(p => p.name === selectedProvider);

  console.log(`\n🚀 Installing ${selectedProvider} coding standards...\n`);
  console.log(`   Languages: ${selectedMeta.languages.join(', ')}\n`);

  // 1. Write active-coding-standards.md
  //    This file stores the selected provider name.
  //    Agents read this file to locate the correct style guide path:
  //    _bmad/data/style-guides/{provider}/{language}/
  ensureDir(projectDataDir);
  fs.writeFileSync(
    projectActiveProviderFile,
    `# Active Coding Standards / Style Guide\n\nprovider: ${selectedProvider}\n\n` +
    `# Managed by bmad-coding-standards. Re-run installer to switch provider.\n` +
    `# Agents read this file to find style guides at:\n` +
    `#   _bmad/data/style-guides/{provider}/{language}/\n`
  );
  console.log(`  ✅ ${path.relative(CWD, projectActiveProviderFile)}`);

  // 2. Copy global preferences
  copyFile(
    path.join(MODULE_DIR, 'data', 'technical-preferences-global.md'),
    path.join(projectDataDir, 'technical-preferences-global.md')
  );

  // 3. Copy all language subdirectories for selected provider
  //    Each language dir contains SKILL.md + {language}.md
  console.log(`\n   Copying style guide files:\n`);
  const providerSrc = path.join(MODULE_DIR, 'data', 'style-guides', selectedProvider);
  const providerDest = path.join(projectDataDir, 'style-guides', selectedProvider);
  copyDirContents(providerSrc, providerDest);

  // 4. Merge agent extension blocks for each IDE
  console.log(`\n   Extending agents:\n`);
  const agentExtensions = fs.readdirSync(path.join(MODULE_DIR, 'agents'))
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));

  const extendedIdeDirs = new Set();
  for (const ide of ides) {
    const targetDir = getTargetDirForIde(platformCodes, ide);
    if (extendedIdeDirs.has(targetDir)) continue;
    extendedIdeDirs.add(targetDir);

    for (const skillName of agentExtensions) {
      const srcPath = path.join(MODULE_DIR, 'agents', `${skillName}.md`);
      const skillDest = path.join(CWD, targetDir, skillName, 'SKILL.md');
      mergeAgentFile(srcPath, skillDest);
    }
  }

console.log(`
✅ Done!

   Provider   : ${selectedProvider}
   Languages : ${selectedMeta.languages.join(', ')}
   IDEs      : ${ides.join(', ')}
   Extended  : ${agentExtensions.join(', ')}

   BMAD skills: {targetDir}/{skill}/ (per IDE)

   Add project-specific rules to:
   _bmad/data/technical-preferences-local.md

   To switch provider: npx @flothemaker/bmad-coding-standards
`);
}

main().catch(err => { console.error(err); process.exit(1); });
