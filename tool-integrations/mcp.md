# MCP (Model Context Protocol) 集成

🔵 官方文档 | 🟡 个人实践

## 什么是 MCP

MCP 是 Anthropic 推出的开放协议，让 Claude 能够连接到外部服务和工具。通过 MCP 服务器，Claude 可以访问：

- **Slack** - 读取/发送消息
- **GitHub** - 读取 PR、issues、代码
- **数据库** - 查询执行
- **文件系统** - 扩展访问权限
- 以及任何自定义实现的服务

## 何时使用 MCP

> 如果你总是在复制粘贴信息给 Claude，可能有 MCP 服务器能帮你自动化这个过程。

**典型场景：**
- 让 Claude 直接查看你的 GitHub PR，而不是粘贴 diff
- 让 Claude 查询数据库获取实际数据，而不是手动提供样本
- 让 Claude 读取 Slack 线程，而不是总结复制

## 配置 MCP 服务器

在 `~/.claude/settings.json` 或项目级 `.claude/settings.json` 中配置：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

## 自定义 MCP 服务器

任何能通过 stdio 通信的程序都可以成为 MCP 服务器。官方提供了多种语言的 SDK。

> 建设中：自定义服务器开发指南
