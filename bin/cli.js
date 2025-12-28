#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const os = require('os');

const VERSION = '5.2.0';
const CURSOR_DIR = '.cursor';
const BUDDY_DIR = '.cursor/buddy';
const GITIGNORE_MARKER = '# Buddy OS (auto-generated)';
const GLOBAL_MCP_PATH = path.join(os.homedir(), '.cursor', 'mcp.json');

// ANSI colors
const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
    underline: '\x1b[4m',
};

const log = {
    info: msg => console.log(`${c.blue}ℹ${c.reset} ${msg}`),
    success: msg => console.log(`${c.green}✅${c.reset} ${msg}`),
    warn: msg => console.log(`${c.yellow}⚠️${c.reset} ${msg}`),
    error: msg => console.log(`${c.red}❌${c.reset} ${msg}`),
    header: msg => console.log(`\n${c.bold}${c.cyan}${msg}${c.reset}\n`),
    step: msg => console.log(`${c.dim}   ${msg}${c.reset}`),
    link: (text, url) => console.log(`   ${c.cyan}${c.underline}${url}${c.reset}`),
};

const BUNDLES = {
    starter: {
        name: 'Starter (SDE1/SDE2)',
        autonomy: 'L1-L2',
        rules: ['web-standards', 'component-structure', 'a11y-standards', 'form-patterns', 'async-effect-patterns'],
        description: 'Basic code quality and accessibility enforcement',
        features: ['Code quality rules', 'Accessibility checks', 'Form patterns'],
    },
    advanced: {
        name: 'Advanced IC (SDE3/Senior)',
        autonomy: 'L2-L3',
        rules: ['web-standards', 'component-structure', 'a11y-standards', 'form-patterns', 'async-effect-patterns',
            'buddy', 'buddy-guard', 'ideation-engine', 'context-warm', 'styling-rules'],
        description: 'Full Buddy capabilities with intelligent assistance',
        features: ['All Starter features', 'Daily planning', 'Ideation engine', 'Context pre-fetch'],
    },
    techlead: {
        name: 'Tech Lead (Staff/Principal)',
        autonomy: 'L3-L4',
        rules: ['*'],
        description: 'Complete Buddy OS with role-based permissions',
        features: ['All Advanced features', 'Role permissions', 'Stale branch intel', 'Full autonomy'],
    },
    enterprise: {
        name: 'Enterprise',
        autonomy: 'Configurable',
        rules: ['*'],
        description: 'Full system with audit logging and compliance',
        features: ['All Tech Lead features', 'Audit logging', 'Team visibility', 'Compliance'],
    },
};

// Enhanced MCP configs with setup guides
const MCP_CONFIGS = {
    github: {
        name: 'GitHub',
        icon: '🐙',
        description: 'PR reviews, CI status, code search',
        priority: 'recommended',
        package: '@modelcontextprotocol/server-github',
        envVars: ['GITHUB_PERSONAL_ACCESS_TOKEN'],
        guide: {
            title: 'Get GitHub Personal Access Token',
            steps: [
                'Go to: https://github.com/settings/tokens',
                'Click "Generate new token (classic)"',
                'Select scopes: repo, read:org, read:user',
                'Copy the token (starts with ghp_)',
            ],
            url: 'https://github.com/settings/tokens',
        },
    },
    slack: {
        name: 'Slack',
        icon: '💬',
        description: 'Channel monitoring, @mentions, team signals',
        priority: 'recommended',
        package: 'slack-mcp-server@latest',
        args: ['--transport', 'stdio'],
        envVars: ['SLACK_MCP_XOXC_TOKEN', 'SLACK_MCP_XOXD_TOKEN'],
        guide: {
            title: 'Get Slack Tokens (Browser Method)',
            steps: [
                'Open Slack in your browser (not desktop app)',
                'Open DevTools (F12) → Network tab',
                'Send any message in Slack',
                'Filter by "api" and find a request',
                'Look in cookies for xoxc- and xoxd- tokens',
            ],
            url: 'https://slack.com',
            note: 'Tokens start with xoxc- and xoxd-',
        },
    },
    jira: {
        name: 'Jira/Atlassian',
        icon: '📋',
        description: 'Ticket context, sprint data, blockers',
        priority: 'recommended',
        package: '@aashari/mcp-server-atlassian-jira',
        envVars: ['ATLASSIAN_SITE_NAME', 'ATLASSIAN_USER_EMAIL', 'ATLASSIAN_API_TOKEN'],
        guide: {
            title: 'Get Atlassian API Token',
            steps: [
                'Go to: https://id.atlassian.com/manage-profile/security/api-tokens',
                'Click "Create API token"',
                'Give it a label (e.g., "Cursor MCP")',
                'Copy the token',
                'Site name is your Jira subdomain (e.g., "mycompany" from mycompany.atlassian.net)',
            ],
            url: 'https://id.atlassian.com/manage-profile/security/api-tokens',
        },
    },
    'google-calendar': {
        name: 'Google Calendar',
        icon: '📅',
        description: 'Meeting load, focus time detection',
        priority: 'optional',
        package: 'mcp-remote',
        args: ['https://gcal.mintmcp.com/mcp'],
        envVars: [],
        guide: {
            title: 'Google Calendar Setup',
            steps: [
                'This uses mintmcp.com for OAuth',
                'No manual tokens needed!',
                'You\'ll authorize via browser on first use',
            ],
            url: 'https://gcal.mintmcp.com',
            note: 'Zero-config setup via OAuth',
        },
    },
    teams: {
        name: 'Microsoft Teams',
        icon: '👥',
        description: 'Teams chat, channels, meetings',
        priority: 'optional',
        package: '@anthropic/teams-mcp@latest',
        envVars: [],
        guide: {
            title: 'Microsoft Teams Setup',
            steps: [
                'Uses Azure AD authentication',
                'You\'ll be prompted to sign in on first use',
                'Grant permissions when prompted',
            ],
            url: 'https://teams.microsoft.com',
            note: 'OAuth-based, no manual tokens needed',
        },
    },
    confluence: {
        name: 'Confluence',
        icon: '📚',
        description: 'Documentation, wiki pages, knowledge base',
        priority: 'optional',
        package: '@aashari/mcp-server-atlassian-confluence',
        envVars: ['ATLASSIAN_SITE_NAME', 'ATLASSIAN_USER_EMAIL', 'ATLASSIAN_API_TOKEN'],
        guide: {
            title: 'Confluence uses same Atlassian token as Jira',
            steps: [
                'If you configured Jira, the same token works!',
                'Otherwise: https://id.atlassian.com/manage-profile/security/api-tokens',
            ],
            url: 'https://id.atlassian.com/manage-profile/security/api-tokens',
            note: 'Reuses Jira credentials',
        },
    },
};

async function prompt(question, defaultValue = '') {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const suffix = defaultValue ? ` [${defaultValue}]` : '';
    return new Promise(resolve => {
        rl.question(`${question}${suffix}: `, answer => {
            rl.close();
            resolve(answer.trim() || defaultValue);
        });
    });
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function detectExistingMcp() {
    if (fs.existsSync(GLOBAL_MCP_PATH)) {
        try {
            const config = JSON.parse(fs.readFileSync(GLOBAL_MCP_PATH, 'utf8'));
            return config.mcpServers || {};
        } catch {
            return {};
        }
    }
    return {};
}

function addToGitignore(targetDir) {
    const gitignorePath = path.join(targetDir, '.gitignore');
    const buddyIgnore = `\n${GITIGNORE_MARKER}\n.cursor/buddy/\n`;

    if (fs.existsSync(gitignorePath)) {
        const content = fs.readFileSync(gitignorePath, 'utf8');
        if (!content.includes(GITIGNORE_MARKER)) {
            fs.appendFileSync(gitignorePath, buddyIgnore);
            return 'updated';
        }
        return 'exists';
    } else {
        fs.writeFileSync(gitignorePath, `${buddyIgnore.trim()}\n`);
        return 'created';
    }
}

function removeFromGitignore(targetDir) {
    const gitignorePath = path.join(targetDir, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
        let content = fs.readFileSync(gitignorePath, 'utf8');
        const lines = content.split('\n');
        const filtered = [];
        let skip = false;

        for (const line of lines) {
            if (line.includes(GITIGNORE_MARKER)) {
                skip = true;
                continue;
            }
            if (skip && line.includes('.cursor/buddy/')) {
                skip = false;
                continue;
            }
            if (!skip) {
                filtered.push(line);
            }
        }

        fs.writeFileSync(gitignorePath, filtered.join('\n'));
    }
}

function copyRules(bundle, targetDir) {
    const rulesDir = path.join(__dirname, '..', 'rules');
    const targetRulesDir = path.join(targetDir, 'rules');
    ensureDir(targetRulesDir);

    if (!fs.existsSync(rulesDir)) {
        return 0;
    }

    const files = fs.readdirSync(rulesDir);
    let copied = 0;

    files.forEach(file => {
        if (file.endsWith('.mdc')) {
            const ruleName = file.replace('.mdc', '');
            if (bundle.rules.includes('*') || bundle.rules.includes(ruleName)) {
                fs.copyFileSync(
                    path.join(rulesDir, file),
                    path.join(targetRulesDir, file)
                );
                copied++;
            }
        }
    });

    return copied;
}

function createStateFile(targetDir, role, bundle, mcpStatus) {
    const state = {
        version: VERSION,
        installed_at: new Date().toISOString(),
        last_run: null,
        session_count: 0,
        yolo_mode: false,
        role_system: {
            current_role: role,
            bundle,
            autonomy_level: BUNDLES[bundle].autonomy,
            role_detected_from: 'cli_install',
            onboarding_completed: false,
        },
        mcp_status: mcpStatus,
        audit_log: {
            enabled: true,
            log_file: '.cursor/buddy/audit.log',
            retention_days: 30,
        },
    };

    fs.writeFileSync(
        path.join(targetDir, 'state.json'),
        JSON.stringify(state, null, 2)
    );
}

function createAuditLog(targetDir) {
    const header = `# Buddy OS v${VERSION} Audit Log
# Created: ${new Date().toISOString()}
# Format: JSON lines
# Retention: 30 days

`;
    fs.writeFileSync(path.join(targetDir, 'audit.log'), header);
}

function createStructure(targetDir) {
    const dirs = [
        'ideas/backlog',
        'ideas/ready',
        'ideas/in-progress',
        'ideas/archive',
        'drafts',
        'rules',
    ];

    dirs.forEach(dir => {
        ensureDir(path.join(targetDir, dir));
        fs.writeFileSync(path.join(targetDir, dir, '.gitkeep'), '');
    });
}

function parseFlags(args) {
    const flags = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--bundle' && args[i + 1]) {
            flags.bundle = args[++i];
        } else if (args[i] === '--role' && args[i + 1]) {
            flags.role = args[++i];
        } else if (args[i] === '-y' || args[i] === '--yes') {
            flags.yes = true;
        } else if (args[i] === '--skip-mcp') {
            flags.skipMcp = true;
        }
    }
    return flags;
}

async function mcpSetupWizard(existingConfig = {}) {
    console.log(`
${c.bold}${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 MCP CONFIGURATION WIZARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}
`);

    // Check for existing config
    const existingServers = Object.keys(existingConfig);
    if (existingServers.length > 0) {
        console.log(`${c.green}✓ Found existing MCP configuration:${c.reset}`);
        existingServers.forEach(server => {
            const config = MCP_CONFIGS[server];
            const icon = config?.icon || '🔌';
            console.log(`   ${icon} ${config?.name || server}: ${c.green}Configured${c.reset}`);
        });
        console.log('');

        const useExisting = await prompt('Use existing configuration? (Y/n)', 'y');
        if (useExisting.toLowerCase() !== 'n') {
            log.success('Using existing MCP configuration');
            return { existing: true, servers: existingServers };
        }
        console.log('');
    }

    console.log(`MCPs connect Buddy to external services for richer context.`);
    console.log(`${c.dim}Tokens are stored in ~/.cursor/mcp.json (local only)${c.reset}\n`);

    const mcpSetup = {};
    const newConfig = { mcpServers: {} };

    for (const [key, config] of Object.entries(MCP_CONFIGS)) {
        const priorityLabel = config.priority === 'recommended' 
            ? `${c.yellow}⭐ Recommended${c.reset}` 
            : `${c.dim}○ Optional${c.reset}`;

        console.log(`${config.icon} ${c.bold}${config.name}${c.reset} ${priorityLabel}`);
        console.log(`   ${c.dim}${config.description}${c.reset}`);

        // Check if already configured
        if (existingConfig[key]) {
            console.log(`   ${c.green}✓ Already configured${c.reset}\n`);
            mcpSetup[key] = { enabled: true, existing: true };
            newConfig.mcpServers[key] = existingConfig[key];
            continue;
        }

        const answer = await prompt(`   Configure ${config.name}? (y/N)`, 'n');

        if (answer.toLowerCase() === 'y') {
            // Show setup guide
            console.log(`\n   ${c.bold}${config.guide.title}${c.reset}`);
            config.guide.steps.forEach((step, i) => {
                console.log(`   ${c.cyan}${i + 1}.${c.reset} ${step}`);
            });
            if (config.guide.url) {
                console.log(`   ${c.dim}Link: ${c.underline}${config.guide.url}${c.reset}`);
            }
            if (config.guide.note) {
                console.log(`   ${c.yellow}💡 ${config.guide.note}${c.reset}`);
            }
            console.log('');

            if (config.envVars.length === 0) {
                // No tokens needed (OAuth-based)
                mcpSetup[key] = { enabled: true, noTokens: true };
                newConfig.mcpServers[key] = {
                    command: 'npx',
                    args: ['-y', config.package, ...(config.args || [])],
                };
                log.success(`${config.name} configured (OAuth-based)`);
            } else {
                // Collect tokens
                const env = {};
                let allProvided = true;

                for (const envVar of config.envVars) {
                    const value = await prompt(`   ${envVar}`);
                    if (value) {
                        env[envVar] = value;
                    } else {
                        allProvided = false;
                    }
                }

                if (allProvided && Object.keys(env).length > 0) {
                    mcpSetup[key] = { enabled: true, env };
                    newConfig.mcpServers[key] = {
                        command: 'npx',
                        args: ['-y', config.package, ...(config.args || [])],
                        env,
                    };
                    log.success(`${config.name} configured`);
                } else {
                    log.warn(`Skipped ${config.name} (missing credentials)`);
                    mcpSetup[key] = { enabled: false };
                }
            }
        } else {
            mcpSetup[key] = { enabled: false };
        }
        console.log('');
    }

    // Save to global config
    if (Object.keys(newConfig.mcpServers).length > 0) {
        const cursorDir = path.join(os.homedir(), '.cursor');
        ensureDir(cursorDir);

        // Merge with existing
        let finalConfig = { mcpServers: {} };
        if (fs.existsSync(GLOBAL_MCP_PATH)) {
            try {
                finalConfig = JSON.parse(fs.readFileSync(GLOBAL_MCP_PATH, 'utf8'));
            } catch {}
        }
        finalConfig.mcpServers = { ...finalConfig.mcpServers, ...newConfig.mcpServers };

        fs.writeFileSync(GLOBAL_MCP_PATH, JSON.stringify(finalConfig, null, 2));
        log.success(`MCP configuration saved to ~/.cursor/mcp.json`);
        log.info('Restart Cursor to activate new MCPs');
    }

    return mcpSetup;
}

async function init(flags = {}) {
    console.log(`
${c.bold}${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 BUDDY OS v${VERSION} - Role-Aware Autonomous Engineering OS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}
`);

    const projectDir = process.cwd();
    const buddyDir = path.join(projectDir, BUDDY_DIR);

    // Check if already installed
    if (fs.existsSync(path.join(buddyDir, 'state.json'))) {
        if (!flags.yes) {
            const answer = await prompt('Buddy OS already installed. Upgrade? (y/N)', 'n');
            if (answer.toLowerCase() !== 'y') {
                log.info('Installation cancelled');
                process.exit(0);
            }
        }
    }

    // Bundle selection
    let bundle;
    const bundleMap = {
        1: 'starter', 2: 'advanced', 3: 'techlead', 4: 'enterprise',
        starter: 'starter', advanced: 'advanced', techlead: 'techlead', enterprise: 'enterprise',
    };

    if (flags.bundle) {
        bundle = bundleMap[flags.bundle.toLowerCase()] || 'techlead';
        log.info(`Bundle: ${BUNDLES[bundle].name}`);
    } else {
        log.header('Select your bundle:');
        Object.entries(BUNDLES).forEach(([key, b], i) => {
            console.log(`  [${i + 1}] ${c.bold}${b.name}${c.reset}`);
            console.log(`      ${c.dim}${b.description}${c.reset}`);
            console.log(`      ${c.dim}Features: ${b.features.join(', ')}${c.reset}\n`);
        });

        const bundleChoice = await prompt('Bundle (1-4)', '3');
        bundle = bundleMap[bundleChoice] || 'techlead';
    }

    // Role selection
    let role;
    const roleMap = {
        1: 'SDE1', 2: 'SDE2', 3: 'SDE3', 4: 'Senior_SDE',
        5: 'Staff_Engineer', 6: 'Engineering_Manager', 7: 'Product_Owner',
        sde1: 'SDE1', sde2: 'SDE2', sde3: 'SDE3', senior: 'Senior_SDE',
        staff: 'Staff_Engineer', manager: 'Engineering_Manager', product: 'Product_Owner',
    };

    if (flags.role) {
        role = roleMap[flags.role.toLowerCase()] || 'Staff_Engineer';
        log.info(`Role: ${role}`);
    } else {
        log.header('Select your role:');
        console.log('  [1] SDE1 (Junior)         [5] Staff Engineer');
        console.log('  [2] SDE2 (Mid-level)      [6] Engineering Manager');
        console.log('  [3] SDE3 (Senior)         [7] Product Owner');
        console.log('  [4] Senior SDE (Lead IC)');
        console.log('');
        const roleChoice = await prompt('Role (1-7)', '5');
        role = roleMap[roleChoice] || 'Staff_Engineer';
    }

    // MCP Configuration
    let mcpStatus = { configured: 0, servers: [] };
    if (!flags.skipMcp && !flags.yes) {
        const existingMcp = detectExistingMcp();
        const existingCount = Object.keys(existingMcp).length;

        if (existingCount > 0) {
            console.log(`\n${c.green}✓ Found ${existingCount} existing MCP(s) in ~/.cursor/mcp.json${c.reset}`);
            Object.keys(existingMcp).forEach(server => {
                const config = MCP_CONFIGS[server];
                console.log(`   ${config?.icon || '🔌'} ${config?.name || server}`);
            });

            const configureMcp = await prompt('\nConfigure additional MCPs? (y/N)', 'n');
            if (configureMcp.toLowerCase() === 'y') {
                await mcpSetupWizard(existingMcp);
            }
            mcpStatus = { configured: existingCount, servers: Object.keys(existingMcp) };
        } else {
            const setupMcp = await prompt('\nConfigure MCP integrations now? (Y/n)', 'y');
            if (setupMcp.toLowerCase() !== 'n') {
                const result = await mcpSetupWizard({});
                mcpStatus = {
                    configured: Object.values(result).filter(m => m.enabled).length,
                    servers: Object.keys(result).filter(k => result[k].enabled),
                };
            }
        }
    } else if (!flags.skipMcp) {
        // Non-interactive: detect existing
        const existingMcp = detectExistingMcp();
        mcpStatus = { configured: Object.keys(existingMcp).length, servers: Object.keys(existingMcp) };
    }

    // Installation
    log.header('Installing Buddy OS...');

    ensureDir(buddyDir);
    createStructure(buddyDir);
    log.success('Directory structure created');
    log.step(`Location: ${BUDDY_DIR}/`);

    const rulesCopied = copyRules(BUNDLES[bundle], buddyDir);
    log.success(`${rulesCopied} rules installed`);
    log.step(`Location: ${BUDDY_DIR}/rules/`);

    createStateFile(buddyDir, role, bundle, mcpStatus);
    log.success('Configuration initialized');

    createAuditLog(buddyDir);
    log.success('Audit logging enabled');

    const gitignoreResult = addToGitignore(projectDir);
    if (gitignoreResult === 'updated') {
        log.success('.gitignore updated (Buddy files excluded)');
    } else if (gitignoreResult === 'created') {
        log.success('.gitignore created (Buddy files excluded)');
    } else {
        log.info('.gitignore already configured');
    }

    console.log(`
${c.bold}${c.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ BUDDY OS v${VERSION} INSTALLED SUCCESSFULLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}

${c.cyan}Bundle:${c.reset}    ${BUNDLES[bundle].name}
${c.cyan}Role:${c.reset}      ${role}
${c.cyan}Autonomy:${c.reset}  ${BUNDLES[bundle].autonomy}
${c.cyan}MCPs:${c.reset}      ${mcpStatus.configured} configured${mcpStatus.servers.length > 0 ? ` (${mcpStatus.servers.join(', ')})` : ''}
${c.cyan}Location:${c.reset}  ${BUDDY_DIR}/ ${c.dim}(gitignored)${c.reset}

${c.bold}Next Steps:${c.reset}
  1. ${mcpStatus.configured === 0 ? `Run ${c.cyan}npx buddy-os mcp-setup${c.reset} to connect services` : 'Restart Cursor to activate MCPs'}
  2. Type ${c.cyan}/buddy${c.reset} in Cursor to see your daily snapshot
  3. Explore ${c.cyan}/buddy ideas${c.reset} for improvement suggestions

${c.bold}Commands:${c.reset}
  ${c.cyan}npx buddy-os${c.reset}              Install/upgrade
  ${c.cyan}npx buddy-os mcp-setup${c.reset}    Configure MCPs
  ${c.cyan}npx buddy-os status${c.reset}       Show current config
  ${c.cyan}npx buddy-os cleanup${c.reset}      Remove installation

${c.yellow}Docs:${c.reset} https://github.com/sharath317/buddy-os

`);
}

async function mcpSetup() {
    const existingMcp = detectExistingMcp();
    await mcpSetupWizard(existingMcp);
}

async function cleanup() {
    console.log(`
${c.bold}${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧹 BUDDY OS CLEANUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}
`);

    const projectDir = process.cwd();
    const buddyDir = path.join(projectDir, BUDDY_DIR);

    if (!fs.existsSync(buddyDir)) {
        log.warn('Buddy OS not installed in this directory');
        process.exit(0);
    }

    const answer = await prompt('This will remove all Buddy OS files. Continue? (y/N)', 'n');
    if (answer.toLowerCase() !== 'y') {
        log.info('Cleanup cancelled');
        process.exit(0);
    }

    fs.rmSync(buddyDir, { recursive: true, force: true });
    log.success('Removed .cursor/buddy/');

    removeFromGitignore(projectDir);
    log.success('Updated .gitignore');

    console.log(`
${c.green}✅ Buddy OS has been removed.${c.reset}

To reinstall: ${c.cyan}npx buddy-os${c.reset}
`);
}

async function status() {
    const projectDir = process.cwd();
    const buddyDir = path.join(projectDir, BUDDY_DIR);
    const statePath = path.join(buddyDir, 'state.json');

    if (!fs.existsSync(statePath)) {
        log.warn('Buddy OS not installed. Run: npx buddy-os');
        process.exit(0);
    }

    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    const rulesDir = path.join(buddyDir, 'rules');
    const rulesCount = fs.existsSync(rulesDir) ? fs.readdirSync(rulesDir).filter(f => f.endsWith('.mdc')).length : 0;

    // Get global MCP status
    const existingMcp = detectExistingMcp();

    console.log(`
${c.bold}${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 BUDDY OS STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}

${c.cyan}Version:${c.reset}   ${state.version}
${c.cyan}Bundle:${c.reset}    ${BUNDLES[state.role_system.bundle]?.name || state.role_system.bundle}
${c.cyan}Role:${c.reset}      ${state.role_system.current_role}
${c.cyan}Autonomy:${c.reset}  ${state.role_system.autonomy_level}
${c.cyan}Rules:${c.reset}     ${rulesCount} installed
${c.cyan}Sessions:${c.reset}  ${state.session_count}
${c.cyan}Installed:${c.reset} ${new Date(state.installed_at).toLocaleDateString()}

${c.bold}MCPs Configured (${Object.keys(existingMcp).length}):${c.reset}`);

    if (Object.keys(existingMcp).length === 0) {
        console.log(`   ${c.dim}None - run: npx buddy-os mcp-setup${c.reset}`);
    } else {
        Object.keys(existingMcp).forEach(key => {
            const config = MCP_CONFIGS[key];
            console.log(`   ${config?.icon || '🔌'} ${config?.name || key}: ${c.green}✓ Active${c.reset}`);
        });
    }

    console.log(`
${c.bold}Commands:${c.reset}
  ${c.cyan}npx buddy-os mcp-setup${c.reset}    Add/update MCPs
  ${c.cyan}npx buddy-os cleanup${c.reset}      Remove installation
`);
}

function showHelp() {
    console.log(`
${c.bold}Buddy OS v${VERSION}${c.reset} - Role-Aware Autonomous Engineering OS

${c.bold}Usage:${c.reset}
  npx buddy-os                         Install/upgrade (interactive)
  npx buddy-os --bundle techlead       Non-interactive install
  npx buddy-os --role staff -y         Skip all prompts

${c.bold}Options:${c.reset}
  --bundle <type>   starter | advanced | techlead | enterprise
  --role <role>     sde1 | sde2 | sde3 | senior | staff | manager | product
  -y, --yes         Skip confirmation prompts
  --skip-mcp        Skip MCP configuration

${c.bold}Commands:${c.reset}
  init              Initialize in current directory (default)
  mcp-setup         Configure MCP integrations (interactive wizard)
  cleanup           Remove Buddy OS installation
  status            Show current configuration
  version, -v       Show version
  help, -h          Show this help

${c.bold}MCP Integrations:${c.reset}
  GitHub            PR reviews, CI status, code search
  Slack             Channel monitoring, @mentions
  Jira              Ticket context, sprint data
  Google Calendar   Meeting load, focus time
  Microsoft Teams   Teams chat, channels
  Confluence        Documentation, wiki pages

${c.bold}Learn more:${c.reset} https://github.com/sharath317/buddy-os
`);
}

// CLI entry point
const args = process.argv.slice(2);
const flags = parseFlags(args);

const validRoles = ['sde1', 'sde2', 'sde3', 'senior', 'staff', 'manager', 'product'];
const validBundles = ['starter', 'advanced', 'techlead', 'enterprise'];

const command = args.find((arg, idx) => {
    if (arg.startsWith('-')) return false;
    if (idx > 0 && (args[idx - 1] === '--bundle' || args[idx - 1] === '--role')) return false;
    if (validRoles.includes(arg.toLowerCase()) || validBundles.includes(arg.toLowerCase())) return false;
    return true;
});

switch (command) {
    case 'init':
    case undefined:
        init(flags);
        break;
    case 'cleanup':
    case 'uninstall':
    case 'remove':
        cleanup();
        break;
    case 'status':
        status();
        break;
    case 'mcp-setup':
    case 'mcp':
        mcpSetup();
        break;
    case 'version':
    case '-v':
        console.log(`Buddy OS v${VERSION}`);
        break;
    case 'help':
    case '-h':
        showHelp();
        break;
    default:
        if (command && !command.startsWith('-')) {
            log.error(`Unknown command: ${command}`);
            console.log('Run "npx buddy-os help" for usage');
            process.exit(1);
        }
        init(flags);
}
