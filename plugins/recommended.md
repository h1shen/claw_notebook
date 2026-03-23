# 优秀插件与工具推荐

> 经过实际验证的 Claude 生态插件与配套工具，按使用场景分类。

## MCP Server 精选

MCP（Model Context Protocol）是 Claude 连接外部工具的标准协议。以下是最值得安装的 MCP Server。

### 文件与搜索

| 名称 | 用途 | 推荐理由 |
|------|------|----------|
| `@anthropic/mcp-server-filesystem` | 文件读写 | 🔵 官方维护，让 Claude 直接操作指定目录 |
| `@anthropic/mcp-server-memory` | 持久化记忆 | 🔵 跨会话记忆存储，用 JSON 知识图谱 |
| `brave-search` | 网络搜索 | 🟢 免费额度充足，搜索质量好 |

**配置示例：**

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
      "env": {
        "BRAVE_API_KEY": "your-key"
      }
    }
  }
}
```

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

> 🟡 **个人实践：** 日常开发中 `filesystem` + `github` + `brave-search` 三件套覆盖 80% 场景，不需要装太多。MCP Server 越多，Claude 选择工具时的决策负担越重。

---

## Claude Code 插件（Plugin）

Claude Code v2.1+ 支持通过 `/plugin` 命令安装社区插件，扩展 Skills、Commands、Agents、Hooks 等能力。

### Everything Claude Code (ECC)

| 项目 | 详情 |
|------|------|
| 作者 | Affaan Mustafa |
| 仓库 | [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) |
| 定位 | 完整的 Agent Harness 性能优化体系 |
| 推荐理由 | 🟢 50K+ stars，覆盖 Skills / Commands / Agents / Hooks / Rules / Memory 六大维度 |

**核心数字（v1.8.0）：** 65+ Skills、40+ Commands、12+ 专职子 Agent，支持 TS/JS/Python/Go/Java/C++/Rust。

**常用命令：**

```
/plan           实现策略规划
/tdd            测试驱动开发
/code-review    质量评估
/build-fix      错误修复
/refactor-clean 代码清理
```

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

### Superpowers

| 项目 | 详情 |
|------|------|
| 作者 | obra |
| 仓库 | [obra/superpowers](https://github.com/obra/superpowers) |
| 定位 | 精练的 Skills 工作流库，专注开发纪律 |
| 推荐理由 | 🟢 覆盖 TDD、调试、计划、代码审查等关键流程，每个 Skill 聚焦一件事 |

**Skills 一览：**

| 类别 | Skills |
|------|--------|
| 测试 | `test-driven-development` — RED-GREEN-REFACTOR 循环 |
| 调试 | `systematic-debugging` — 4 阶段根因分析；`verification-before-completion` — 完成前验证 |
| 协作 | `brainstorming`、`writing-plans`、`executing-plans`、`dispatching-parallel-agents`、`requesting-code-review`、`receiving-code-review` |
| 开发 | `using-git-worktrees` — 并行开发分支；`finishing-a-development-branch` — 合并/PR 决策；`subagent-driven-development` — 子 Agent 迭代 |
| 元技能 | `writing-skills` — 创建新 Skill；`using-superpowers` — 技能系统入门 |

**安装：**

```bash
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

> 🟡 **个人实践：** ECC 适合想要全面「开箱即用」的用户，Superpowers 适合追求精简纪律的用户。两者可以共存，但建议先选一个跑熟再叠加，避免 Skill 冲突。

### Chrome CDP Skill

| 项目 | 详情 |
|------|------|
| 作者 | Petr Baudiš (pasky) |
| 仓库 | [pasky/chrome-cdp-skill](https://github.com/pasky/chrome-cdp-skill) |
| 定位 | 让 AI Agent 直接连接你正在使用的 Chrome 浏览器 |
| 推荐理由 | 🟢 2.6K+ stars，无需启动独立浏览器实例，直接操作已登录的标签页 |

**核心特点：**

- **连接活跃会话** — 不像 Puppeteer 等工具启动全新浏览器，chrome-cdp 直接通过 Chrome DevTools Protocol (CDP) WebSocket 连接你已经打开的 Chrome，Agent 可以读取你已登录的 Gmail、GitHub、内部工具等页面
- **轻量守护进程** — 每个标签页一个后台 daemon 保持 WebSocket 连接，20 分钟无活动自动退出，避免反复弹出 "Allow debugging" 确认框
- **零依赖** — 需要 Node.js 22+（使用内置 WebSocket），无需 `npm install`
- **支持多种 Chromium 内核浏览器** — Chrome、Chromium、Brave、Edge、Vivaldi

**命令速查：**

| 命令 | 说明 |
|------|------|
| `list` | 列出所有打开的标签页 |
| `shot <target>` | 截取视口截图，输出 DPR |
| `snap <target>` | 获取无障碍树快照（推荐用 `--compact`） |
| `eval <target> <expr>` | 在页面上下文中执行 JavaScript |
| `click <target> <selector>` | 通过 CSS 选择器点击元素 |
| `clickxy <target> <x> <y>` | 按 CSS 像素坐标点击 |
| `type <target> <text>` | 向当前焦点输入文本（支持跨域 iframe） |
| `nav <target> <url>` | 导航到指定 URL |
| `html <target> [selector]` | 获取页面或元素 HTML |
| `open [url]` | 打开新标签页 |

**安装：**

```bash
# 方式一：pi 包管理器
pi install git:github.com/pasky/chrome-cdp-skill@v1.0.2

# 方式二：手动安装（适用于其他 Agent 框架）
# 将 skills/chrome-cdp/ 目录复制到你的项目中即可
```

**前置步骤：**

1. 需要 Node.js 22+
2. 在 Chrome 地址栏打开 `chrome://inspect/#remote-debugging`，开启远程调试开关
3. 首次连接每个标签页时会弹出一次 "Allow debugging" 确认

**使用技巧：**

- 优先用 `snap --compact` 而非 `html` 来理解页面结构，输出更精简
- 跨域 iframe 中无法使用 `eval`，改用 `click`/`clickxy` 聚焦后 `type` 输入
- `shot` 只截取视口范围，需要截取下方内容先用 `eval` 滚动页面
- 避免跨多次 `eval` 调用使用索引选择器（如 `querySelectorAll(...)[i]`），DOM 可能在调用间变化

> 🟡 **个人实践：** 这个工具最大的价值在于**免登录**——连接你已有的浏览器会话，Agent 可以直接操作需要认证的内部系统、后台管理页面，省去处理登录流程的麻烦。适合需要 Agent 帮你在网页上执行操作（抓数据、填表、测试）的场景。

---

## 选择插件的原则

1. **少即是多** — 每多一个 MCP Server，Claude 决策时就多一层干扰
2. **官方优先** — `@anthropic/` 前缀的 MCP Server 维护质量最可靠
3. **先跑通再扩展** — 先用 `filesystem` + `github` 把基础流程跑通，再按需加
4. **定期清理** — 一个月没用过的插件果断移除

---

> **工具是手段，不是目的。最好的配置是你不需要想就能用的配置。**
