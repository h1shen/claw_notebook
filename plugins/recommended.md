# 优秀插件与工具推荐

> 经过实际验证的 Claude 生态插件与配套工具，按使用场景分类。
> 标注说明：🔵 官方文档 / 🟢 社区经验 / 🟡 个人实践

---

## MCP Server 精选

MCP（Model Context Protocol）是 Claude 连接外部工具的标准协议。以下是最值得安装的 MCP Server。

### 文件与搜索

| 名称 | 用途 | 推荐理由 |
|------|------|----------|
| `@anthropic/mcp-server-filesystem` | 文件读写 | 🔵 官方维护，让 Claude 直接操作指定目录 |
| `@anthropic/mcp-server-memory` | 持久化记忆 | 🔵 跨会话记忆存储，用 JSON 知识图谱 |
| `brave-search` | 网络搜索 | 🟢 免费额度充足，搜索质量好 |

### 开发与 DevOps

| 名称 | 用途 | 推荐理由 |
|------|------|----------|
| `@anthropic/mcp-server-github` | GitHub 操作 | 🔵 PR、Issue、代码搜索，团队协作必备 |
| `@anthropic/mcp-server-postgres` | 数据库查询 | 🔵 只读模式安全查库，调试利器 |
| `mcp-server-sqlite` | SQLite 操作 | 🟢 轻量数据库操作，适合本地项目 |
| `docker-mcp` | Docker 管理 | 🟢 容器生命周期管理，免切终端 |

### 知识与内容

| 名称 | 用途 | 推荐理由 |
|------|------|----------|
| `mcp-server-fetch` | 网页抓取 | 🟢 将网页转为 Markdown 喂给 Claude |
| `mcp-server-notion` | Notion 集成 | 🟢 读写 Notion 页面，知识库联动 |

### 配置示例

```json
// .claude/settings.json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem", "/path/to/allowed/dir"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-brave-search"],
      "env": { "BRAVE_API_KEY": "your-key" }
    }
  }
}
```

> 🟡 **个人实践：** 日常开发中 `filesystem` + `github` + `brave-search` 三件套覆盖 80% 场景，不需要装太多。MCP Server 越多，Claude 选择工具时的决策负担越重。

---

## Claude Code 插件（Plugin）

Claude Code v2.1+ 支持通过 `/plugin` 命令安装社区插件，扩展 Skills、Commands、Agents、Hooks 等能力。

### 插件速览

| 插件 | 定位 | Stars | 一句话推荐 |
|------|------|-------|-----------|
| [Everything Claude Code](#everything-claude-code-ecc) | 全能 Agent Harness | 50K+ | 开箱即用，覆盖开发全流程 |
| [Superpowers](#superpowers) | Skills 工作流库 | — | 精练纪律，每个 Skill 聚焦一件事 |
| [Claude HUD](#claude-hud) | 实时 Statusline | 12K+ | 上下文/工具/Agent 可视化监控 |
| [Chrome CDP Skill](#chrome-cdp-skill) | 浏览器操控 | 2.6K+ | 连接已登录 Chrome，免认证操作 |

---

### Everything Claude Code (ECC)

> **完整的 Agent Harness 性能优化体系** — 🟢 50K+ stars
> 作者：Affaan Mustafa | 仓库：[affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)

**核心能力：** 65+ Skills、40+ Commands、12+ 专职子 Agent，支持 TS/JS/Python/Go/Java/C++/Rust（v1.8.0）。

**常用命令：**

| 命令 | 说明 |
|------|------|
| `/plan` | 实现策略规划 |
| `/tdd` | 测试驱动开发 |
| `/code-review` | 质量评估 |
| `/build-fix` | 错误修复 |
| `/refactor-clean` | 代码清理 |

**安装：**

```bash
# 方式一：Plugin（快速）
/plugin marketplace add affaan-m/everything-claude-code
/plugin install everything-claude-code@everything-claude-code

# 方式二：手动安装（推荐，Rules 只能手动分发）
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code
./install.sh typescript                        # 单语言
./install.sh typescript python golang          # 多语言
```

> ⚠️ Claude Code v2.1+ 会自动加载 `hooks/hooks.json`，手动声明会报重复错误。

---

### Superpowers

> **精练的 Skills 工作流库，专注开发纪律** — 🟢 覆盖 TDD、调试、计划、代码审查等关键流程
> 作者：obra | 仓库：[obra/superpowers](https://github.com/obra/superpowers)

**Skills 一览：**

| 类别 | Skills |
|------|--------|
| 测试 | `test-driven-development` — RED-GREEN-REFACTOR 循环 |
| 调试 | `systematic-debugging` — 4 阶段根因分析 |
|      | `verification-before-completion` — 完成前验证 |
| 协作 | `brainstorming`、`writing-plans`、`executing-plans` |
|      | `dispatching-parallel-agents`、`requesting-code-review`、`receiving-code-review` |
| 开发 | `using-git-worktrees` — 并行开发分支 |
|      | `finishing-a-development-branch` — 合并/PR 决策 |
|      | `subagent-driven-development` — 子 Agent 迭代 |
| 元技能 | `writing-skills` — 创建新 Skill；`using-superpowers` — 技能系统入门 |

**安装：**

```bash
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

> 🟡 **个人实践：** ECC 适合想要全面「开箱即用」的用户，Superpowers 适合追求精简纪律的用户。两者可以共存，但建议先选一个跑熟再叠加，避免 Skill 冲突。

---

### Claude HUD

> **实时 statusline HUD，终端内可视化监控** — 🟢 12K+ stars
> 作者：Jarrod Watts | 仓库：[jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud)

利用 Claude Code 原生 statusline API，在终端输入区下方实时显示会话状态，无需 tmux 或额外窗口。

**核心功能：**

| 模块 | 说明 |
|------|------|
| Context health | 上下文窗口进度条（绿→黄→红），支持 1M 上下文 |
| Usage limits | 订阅用户速率限制消耗（5h/7d 窗口） |
| Tool activity | 实时显示 Read/Edit/Grep 等工具调用 |
| Agent tracking | 子代理运行状态及耗时 |
| Todo progress | 任务完成进度 |
| Git status | 分支、dirty 标记、ahead/behind、文件变更统计 |

**显示效果：**

```
[Opus] │ my-project git:(main*)
Context █████░░░░░ 45% │ Usage ██░░░░░░░░ 25% (1h 30m / 5h)
◐ Edit: auth.ts | ✓ Read ×3 | ✓ Grep ×2
◐ explore [haiku]: Finding auth code (2m 15s)
▸ Fix authentication bug (2/5)
```

**安装：**

```bash
/plugin marketplace add jarrodwatts/claude-hud
/plugin install claude-hud
/claude-hud:setup    # 配置 statusline，完成后重启 Claude Code
```

**配置：** 运行 `/claude-hud:configure` 选择预设（Full / Essential / Minimal），或手动编辑 `~/.claude/plugins/claude-hud/config.json`。

> ⚠️ **Windows**：setup 后需完全重启 Claude Code。若提示找不到 JS 运行时，先 `winget install OpenJS.NodeJS.LTS`。
>
> 🟡 **个人实践：** 上下文用量可视化是最实用的功能——避免在不知情时撞到上下文上限。建议先用 Essential 预设，按需开启 tools/agents/todos 行。

---

### Chrome CDP Skill

> **让 AI Agent 直接操控你正在使用的 Chrome 浏览器** — 🟢 2.6K+ stars
> 作者：Petr Baudiš (pasky) | 仓库：[pasky/chrome-cdp-skill](https://github.com/pasky/chrome-cdp-skill)

通过 Chrome DevTools Protocol (CDP) WebSocket 连接已打开的浏览器，Agent 可直接操作已登录的页面，无需启动新浏览器实例。

**核心特点：**

- **连接活跃会话** — 直接操作已登录的 Gmail、GitHub、内部工具等页面
- **轻量守护进程** — 每标签页一个 daemon，20 分钟无活动自动退出
- **零依赖** — 仅需 Node.js 22+（内置 WebSocket）
- **多浏览器支持** — Chrome、Chromium、Brave、Edge、Vivaldi

**命令速查：**

| 命令 | 说明 |
|------|------|
| `list` | 列出所有打开的标签页 |
| `shot <target>` | 截取视口截图 |
| `snap <target>` | 获取无障碍树快照（推荐 `--compact`） |
| `eval <target> <expr>` | 在页面上下文执行 JavaScript |
| `click <target> <selector>` | CSS 选择器点击 |
| `clickxy <target> <x> <y>` | 坐标点击 |
| `type <target> <text>` | 输入文本（支持跨域 iframe） |
| `nav <target> <url>` | 导航到 URL |
| `html <target> [selector]` | 获取 HTML |
| `open [url]` | 打开新标签页 |

**安装：**

```bash
# 方式一：pi 包管理器
pi install git:github.com/pasky/chrome-cdp-skill@v1.0.2

# 方式二：手动安装
# 将 skills/chrome-cdp/ 目录复制到你的项目中即可
```

**前置步骤：**

1. 安装 Node.js 22+
2. Chrome 地址栏打开 `chrome://inspect/#remote-debugging`，开启远程调试
3. 首次连接每个标签页时会弹出一次 "Allow debugging" 确认

> 🟡 **个人实践：** 最大价值在于**免登录**——连接已有浏览器会话，Agent 可直接操作需要认证的内部系统、后台管理页面。适合需要 Agent 在网页上抓数据、填表、测试的场景。优先用 `snap --compact` 而非 `html` 理解页面结构。

---

## 选择建议

1. **少即是多** — 每多一个插件，Claude 决策时就多一层干扰
2. **官方优先** — `@anthropic/` 前缀的 MCP Server 维护质量最可靠
3. **先跑通再扩展** — 先用基础套件把流程跑通，再按需叠加
4. **定期清理** — 一个月没用过的插件果断移除

> **工具是手段，不是目的。最好的配置是你不需要想就能用的配置。**
