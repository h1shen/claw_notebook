# Claude 完整教程与使用指南 — 设计文档

**日期**：2026-03-04
**状态**：已批准，待实施

---

## 项目目标

构建一套面向**技术开发者**的、最为完整的 Claude 教程与使用指南，聚合官方文档、社区经验与个人实践心得，以多文件结构组织，未来可升级为静态网站。

---

## 目录结构设计

```
claw_notebook/
├── README.md                        # 导航首页，所有模块的目录索引
├── notebook.md                      # 保留现有内容（待迁移/归档）
│
├── claude-code/                     # 模块一：Claude Code 深度使用（优先）
│   ├── overview.md                  # 概览与核心理念
│   ├── cli-workflows.md             # CLI 工作流与常用命令
│   ├── claude-md.md                 # CLAUDE.md 编写法则
│   ├── plan-mode.md                 # 计划模式深度指南
│   ├── hooks.md                     # Hooks 配置与使用
│   ├── skills.md                    # Skills 系统
│   ├── context-management.md        # 上下文管理策略
│   └── token-optimization.md        # Token 节省技巧与方案
│
├── prompt-engineering/              # 模块二：提示词工程
├── ai-dev-mindset/                  # 模块三：AI 辅助编程思维
├── tool-integrations/               # 模块四：工具生态集成
│
└── resources/
    └── references.md                # 参考资料、链接、来源汇总
```

---

## 模块一内容框架（claude-code/）

| 文件 | 核心内容 |
|------|---------|
| `overview.md` | Claude Code 是什么、核心设计哲学、与普通 AI 对话的本质区别 |
| `cli-workflows.md` | 启动方式、常用命令、快捷键、slash commands、模式切换 |
| `claude-md.md` | 四大编写法则、项目级 vs 全局配置、实际案例模板 |
| `plan-mode.md` | 何时用计划模式、如何引导出高质量计划、计划执行技巧 |
| `hooks.md` | hooks 类型、配置语法、实用场景（自动提交、格式检查等）|
| `skills.md` | skills 是什么、如何调用、如何编写自定义 skill |
| `context-management.md` | 上下文衰减规律、/compact 使用时机、多会话拆分策略 |
| `token-optimization.md` | token 计费逻辑、prompt caching、减少冗余、批量任务效率方案 |

---

## 内容构建工作流

### 阶段一：迁移与奠基
- 将 `notebook.md` 现有内容拆解，分配到对应新文件
- 建立 `README.md` 导航目录

### 阶段二：Claude Code 模块深耕（当前优先）
- 按文件逐一完善
- 每个文件统一结构：概念解释 → 实用技巧 → 真实案例 → 常见误区
- 素材来源：官方文档 + 社区帖子 + 自身实践

### 阶段三：扩展其他模块
- 提示词工程、AI 开发思维、工具集成
- 视内容体量决定是否升级为静态网站（MkDocs / VitePress）

---

## 内容质量标准

- 每个技巧必须有**可操作的示例**，不写空泛原则
- 标注来源（官方 / 社区 / 实践）
- 定期 review，过时内容及时更新
