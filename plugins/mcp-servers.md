# MCP Server 精选

> MCP（Model Context Protocol）是 Claude 连接外部工具的标准协议。以下是经过实际验证、最值得安装的 MCP Server。
> 标注说明：🔵 官方文档 / 🟢 社区经验 / 🟡 个人实践

---

## 文件与搜索

| 名称 | 用途 | 推荐理由 |
|------|------|----------|
| `@anthropic/mcp-server-filesystem` | 文件读写 | 🔵 官方维护，让 Claude 直接操作指定目录 |
| `@anthropic/mcp-server-memory` | 持久化记忆 | 🔵 跨会话记忆存储，用 JSON 知识图谱 |
| `brave-search` | 网络搜索 | 🟢 免费额度充足，搜索质量好 |

## 开发与 DevOps

| 名称 | 用途 | 推荐理由 |
|------|------|----------|
| `@anthropic/mcp-server-github` | GitHub 操作 | 🔵 PR、Issue、代码搜索，团队协作必备 |
| `@anthropic/mcp-server-postgres` | 数据库查询 | 🔵 只读模式安全查库，调试利器 |
| `mcp-server-sqlite` | SQLite 操作 | 🟢 轻量数据库操作，适合本地项目 |
| `docker-mcp` | Docker 管理 | 🟢 容器生命周期管理，免切终端 |

## 知识与内容

| 名称 | 用途 | 推荐理由 |
|------|------|----------|
| `mcp-server-fetch` | 网页抓取 | 🟢 将网页转为 Markdown 喂给 Claude |
| `mcp-server-notion` | Notion 集成 | 🟢 读写 Notion 页面，知识库联动 |

---

## 配置示例

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

---

## 选择建议

1. **少即是多** — MCP Server 越多，Claude 选择工具时的决策负担越重
2. **官方优先** — `@anthropic/` 前缀的维护质量最可靠
3. **先跑通再扩展** — 先用基础套件把流程跑通，再按需叠加
4. **定期清理** — 一个月没用过的果断移除

> 🟡 **个人实践：** 日常开发中 `filesystem` + `github` + `brave-search` 三件套覆盖 80% 场景，不需要装太多。
