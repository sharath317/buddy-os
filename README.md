# 🤖 Buddy OS

> **Role-Aware Autonomous Engineering OS for Cursor IDE**

[![npm version](https://img.shields.io/npm/v/buddy-os)](https://www.npmjs.com/package/buddy-os)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

Transform your Cursor IDE into an intelligent, context-aware development environment. Buddy OS connects your AI coding assistant to real-world signals from GitHub, Slack, Jira, and more — making it truly understand your engineering workflow.

```bash
npx buddy-os
```

---

## ✨ Features

### 🎭 Role-Based Intelligence
Buddy OS adapts to your engineering level:

| Role | Autonomy | Description |
|------|----------|-------------|
| SDE1/SDE2 | L1-L2 | Code quality, accessibility, form patterns |
| SDE3/Senior | L2-L3 | Full Buddy + ideation engine + context pre-fetch |
| Staff/Principal | L3-L4 | Complete autonomy + role permissions + audit logging |
| Enterprise | Custom | Team visibility + compliance + custom rules |

### 📡 MCP Integrations (Model Context Protocol)
Connect Buddy to your real engineering context:

| Integration | Description | Priority |
|-------------|-------------|----------|
| 🐙 **GitHub** | PR reviews, CI status, code search | ⭐ Recommended |
| 💬 **Slack** | Channel monitoring, @mentions, team signals | ⭐ Recommended |
| 📋 **Jira** | Ticket context, sprint data, blockers | ⭐ Recommended |
| 📅 **Google Calendar** | Meeting load, focus time detection | Optional |
| 👥 **Microsoft Teams** | Teams chat, channels, meetings | Optional |
| 📚 **Confluence** | Documentation, wiki pages, knowledge base | Optional |

### 📜 Intelligent Rules
Pre-configured rules that enhance your AI assistant:

- **Accessibility Standards** — WCAG compliance, ARIA patterns
- **Component Structure** — React/TypeScript best practices
- **Form Patterns** — Validation, error handling
- **Async/Effect Patterns** — Proper cleanup, race conditions
- **Styling Rules** — CSS-in-JS, design system alignment
- **Web Standards** — Performance, security, SEO
- **Ideation Engine** — Auto-generate improvement ideas
- **Role Permissions** — Context-aware autonomy levels

---

## 🚀 Quick Start

### 1. Install Buddy OS

```bash
# Interactive installation (recommended)
npx buddy-os

# Or with specific options
npx buddy-os --bundle techlead --role staff
```

### 2. Configure MCP Integrations

```bash
# Run the interactive MCP wizard
npx buddy-os mcp-setup
```

### 3. Start Using in Cursor

Type `/buddy` in Cursor to see your daily snapshot!

---

## 📦 Installation Options

### Interactive Mode (Recommended)
```bash
npx buddy-os
```
Guides you through bundle selection, role setup, and MCP configuration.

### Non-Interactive Mode
```bash
# Full tech lead setup with all defaults
npx buddy-os --bundle techlead --role staff -y

# Skip MCP configuration
npx buddy-os --bundle advanced --skip-mcp -y
```

### Bundles

| Bundle | Includes | Best For |
|--------|----------|----------|
| `starter` | Core code quality rules | Junior developers |
| `advanced` | + Buddy, ideation, context | Mid-senior ICs |
| `techlead` | + Role permissions, full autonomy | Staff+ engineers |
| `enterprise` | + Audit logging, compliance | Team-wide deployment |

---

## 🛠️ Commands

| Command | Description |
|---------|-------------|
| `npx buddy-os` | Install or upgrade (interactive) |
| `npx buddy-os mcp-setup` | Configure MCP integrations |
| `npx buddy-os status` | Show current configuration |
| `npx buddy-os cleanup` | Remove Buddy OS installation |
| `npx buddy-os --help` | Show all options |

---

## 📁 Project Structure

After installation, Buddy OS creates:

```
.cursor/
└── buddy/
    ├── state.json          # Configuration & session tracking
    ├── audit.log           # Action audit trail
    ├── rules/              # Active rule files (.mdc)
    ├── ideas/              # Ideation pipeline
    │   ├── backlog/
    │   ├── ready/
    │   ├── in-progress/
    │   └── archive/
    └── drafts/             # Work-in-progress content
```

> **Note:** The `.cursor/buddy/` folder is automatically added to `.gitignore`

---

## 🔐 MCP Setup Guide

### GitHub
```
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: repo, read:org, read:user
4. Copy token (starts with ghp_)
```

### Slack
```
1. Open Slack in browser (not desktop app)
2. Open DevTools (F12) → Network tab
3. Send any message in Slack
4. Find xoxc- and xoxd- tokens in cookies
```

### Jira/Confluence
```
1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Create API token with label "Cursor MCP"
3. Note your site name (e.g., "mycompany" from mycompany.atlassian.net)
```

### Google Calendar
- Uses OAuth — no manual tokens needed!
- Authorize via browser on first use

---

## 🎯 Usage in Cursor

Once installed, you can use these commands in Cursor:

| Command | Description |
|---------|-------------|
| `/buddy` | Show daily snapshot with context |
| `/buddy ideas` | View improvement suggestions |
| `/buddy plan` | Generate task breakdown |
| `/buddy review` | Code review current changes |

---

## 🔧 Configuration

### Autonomy Levels

| Level | Description |
|-------|-------------|
| L1 | Ask before any action |
| L2 | Ask before file changes |
| L3 | Ask before breaking changes |
| L4 | Full autonomy (audit logged) |

### Environment Variables

MCP credentials are stored in `~/.cursor/mcp.json` (local only, never committed).

---

## 📖 Rules Included

| Rule | Description |
|------|-------------|
| `web-standards` | HTML5, performance, security |
| `component-structure` | React patterns, file organization |
| `a11y-standards` | WCAG 2.1, ARIA, keyboard nav |
| `form-patterns` | Validation, error handling |
| `async-effect-patterns` | useEffect cleanup, race conditions |
| `styling-rules` | CSS-in-JS, design tokens |
| `buddy` | Core Buddy AI assistant |
| `buddy-guard` | Safety checks, permissions |
| `ideation-engine` | Auto-generate improvement ideas |
| `context-warm` | Pre-fetch relevant context |
| `role-permissions` | Role-based autonomy |
| `stale-branch-intel` | Branch cleanup suggestions |
| `system-manifest` | Full system configuration |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📄 License

MIT © [Sharath Chandra](https://github.com/sharath317)

---

## 🔗 Links

- [GitHub Repository](https://github.com/sharath317/buddy-os)
- [npm Package](https://www.npmjs.com/package/buddy-os)
- [Cursor IDE](https://cursor.sh)
- [Model Context Protocol](https://modelcontextprotocol.io)

---

<div align="center">

**Made with ❤️ for the Cursor community**

</div>
