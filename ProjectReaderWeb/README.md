# ProjectReader Web

## API文档生成说明

### 安装依赖
```bash
npm install
```

### 生成文档
```bash
# 生成HTML文档
npm run docs

# 构建并生成文档
npm run build:docs
```

### 查看文档
```bash
# 开发服务器预览
npm run preview
```

生成的文档位置：`dist/api-docs/index.html`

## API文档结构
1. 通用说明
   - 认证方式
   - 错误处理
   - 请求/响应格式

2. 接口模块
   - 小说列表
   - 小说详情
   - 阅读功能
   - 书架管理

3. 开发规范
   - 命名规范
   - 版本控制
   - 安全规范
   - 性能优化建议

## 开发指南

### 项目结构
```
ProjectReaderWeb/
├── src/
│   ├── views/          # 页面组件
│   ├── components/     # 通用组件
│   ├── stores/        # 状态管理
│   └── router/        # 路由配置
├── scripts/           # 工具脚本
│   └── generate-docs.js  # 文档生成脚本
├── api-doc.md         # API文档源文件
└── api-doc.html       # 文档模板
```

### 技术栈
- Vue 3
- TypeScript
- Element Plus
- Axios
- Vite

### 开发命令
```bash
# 开发环境
npm run dev

# 构建
npm run build

# 类型检查
npm run type-check

# 代码格式化
npm run format

# 代码检查
npm run lint
```

### 接口调用示例
```typescript
import { novelApi } from '@/apis/novel'

// 获取小说列表
const getNovelList = async () => {
  try {
    const { data } = await novelApi.getList(1, 10)
    return data.novels
  } catch (error) {
    console.error('获取小说列表失败:', error)
    return []
  }
}

// 获取章节内容
const getChapterContent = async (novelId: number, chapterId: number) => {
  try {
    const { data } = await novelApi.getChapter(novelId, chapterId)
    return data
  } catch (error) {
    console.error('获取章节内容失败:', error)
    return null
  }
}
```

### 最佳实践
1. API调用
   - 使用统一的错误处理
   - 实现请求重试机制
   - 合理使用缓存
   - 添加加载状态

2. 性能优化
   - 图片懒加载
   - 分页加载
   - 组件按需加载
   - 状态管理优化

3. 用户体验
   - 添加加载提示
   - 错误友好提示
   - 支持离线阅读
   - 保存阅读进度

### 问题反馈
如有问题，请通过以下方式反馈：
1. 提交Issue
2. 发送邮件到support@reader.com
3. 在项目内部论坛讨论

## 团队
- 前端开发: @frontend-team
- 后端开发: @backend-team
- 产品设计: @product-team
- 技术文档: @doc-team
