import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Claude 使用指南',
  description: '面向技术开发者的完整 Claude 教程与实践知识库',

  srcDir: '.',
  srcExclude: ['archived/**', '.claude/**', 'node_modules/**', 'docs/**', 'resources/**', 'tmp/**'],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'Claude Code', link: '/claude-code/overview' },
      { text: '提示词工程', link: '/prompt-engineering/input-quality' },
      { text: 'AI 编程思维', link: '/ai-dev-mindset/architecture' },
      { text: '工具集成', link: '/tool-integrations/mcp' },
      { text: '插件推荐', link: '/plugins/recommended' },
    ],

    sidebar: {
      '/claude-code/': [
        {
          text: 'Claude Code 深度使用',
          items: [
            { text: '概览与核心理念', link: '/claude-code/overview' },
            { text: 'CLI 工作流与常用命令', link: '/claude-code/cli-workflows' },
            { text: 'CLAUDE.md 编写法则', link: '/claude-code/claude-md' },
            { text: '计划模式深度指南', link: '/claude-code/plan-mode' },
            { text: 'Hooks 配置与使用', link: '/claude-code/hooks' },
            { text: 'Skills 系统', link: '/claude-code/skills' },
            { text: '上下文管理策略', link: '/claude-code/context-management' },
            { text: 'Token 节省技巧与方案', link: '/claude-code/token-optimization' },
          ],
        },
      ],
      '/prompt-engineering/': [
        {
          text: '提示词工程',
          items: [
            { text: '输入质量优化', link: '/prompt-engineering/input-quality' },
          ],
        },
      ],
      '/ai-dev-mindset/': [
        {
          text: 'AI 辅助编程思维',
          items: [
            { text: '架构思维', link: '/ai-dev-mindset/architecture' },
          ],
        },
      ],
      '/tool-integrations/': [
        {
          text: '工具生态集成',
          items: [
            { text: 'MCP 集成', link: '/tool-integrations/mcp' },
            { text: '自动化工作流', link: '/tool-integrations/automation' },
          ],
        },
      ],
      '/plugins/': [
        {
          text: '插件推荐',
          items: [
            { text: '优秀插件与工具推荐', link: '/plugins/recommended' },
          ],
        },
      ],
    },

    search: {
      provider: 'local',
    },

    socialLinks: [],

    outline: {
      label: '本页目录',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
})
