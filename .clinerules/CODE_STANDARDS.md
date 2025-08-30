# 项目代码标准文档

本文档旨在为 `ProjectReader` 项目的前端代码提供统一的风格和最佳实践指南，以确保代码的可读性、可维护性和一致性。

## 1. 通用原则

*   **可读性优先：** 代码应清晰易懂，避免过度优化和复杂的逻辑。
*   **一致性：** 遵循本规范，确保所有代码风格统一。
*   **可维护性：** 编写易于理解、测试和修改的代码。
*   **模块化：** 将功能拆分为小的、独立的模块或组件。

## 2. 文件和目录结构

*   **Vue 项目根目录 (`ProjectReaderWeb/`):**
    *   `src/`: 源代码目录。
    *   `public/`: 静态资源。
    *   `components/`: 可复用的 Vue 组件和 Composable 函数。
    *   `views/`: 页面级 Vue 组件。
    *   `router/`: Vue Router 配置。
    *   `stores/`: Pinia 或 Vuex 状态管理（如果使用）。
    *   `assets/`: 静态资源，如 CSS、图片、字体。
    *   `utils/`: 通用工具函数。
    *   `api/`: API 请求相关代码（建议）。
*   **命名约定：**
    *   **目录：** 小写，使用复数形式（如 `components`, `views`）。
    *   **Vue 组件文件 (`.vue`):** 大驼峰命名法 (PascalCase)，例如 `Reader.vue`, `NovelDetail.vue`。
    *   **Composable 函数文件 (`.ts`):** 小驼峰命名法 (camelCase)，以 `use` 开头，例如 `useReaderSettings.ts`, `useChapterNavigation.ts`。
    *   **其他 TypeScript 文件 (`.ts`):** 小驼峰命名法 (camelCase)。

## 3. Vue 组件规范

### 3.1. `<script setup>` 语法

*   所有 Vue 组件都应使用 `<script setup lang="ts">` 语法，以简化组件编写和提高可读性。

### 3.2. 模板 (`<template>`)

*   **结构清晰：** 使用语义化的 HTML 标签，保持模板结构清晰，适当缩进。
*   **属性顺序：** 建议遵循以下属性顺序：
    1.  `v-if`, `v-for`, `v-show` 等指令。
    2.  `key`。
    3.  `ref`, `id`, `class`, `style`。
    4.  其他属性（如 `src`, `alt`, `placeholder`）。
    5.  事件绑定（`@click`, `v-on:submit`）。
*   **Element Plus 组件：** 统一使用 Element Plus 组件库，并遵循其官方文档的使用方式。
*   **数据绑定：** 使用 `{{ }}` 进行文本插值，`:` 或 `v-bind:` 进行属性绑定，`@` 或 `v-on:` 进行事件绑定。
*   **条件渲染和列表渲染：** 优先使用 `v-if`/`v-else-if`/`v-else` 和 `v-for`。

### 3.3. 样式 (`<style scoped lang="scss">`)

*   **SCSS 预处理器：** 使用 SCSS 编写样式。
*   **Scoped 样式：** 默认使用 `scoped` 属性，以防止样式污染。
*   **嵌套规则：** 适当使用 SCSS 嵌套，但避免过深的嵌套（建议不超过 3 层）。
*   **`&` 符号：** 用于表示当前选择器的父级，例如 `.parent { &.active { ... } }`。
*   **深度选择器 (`:deep()`):** 当需要修改子组件或 Element Plus 组件的内部样式时，使用 `:deep()`。
*   **CSS 变量：** 优先使用 CSS 变量来管理主题相关的样式（如颜色、字体大小），以实现动态主题切换。
*   **单位：** 统一使用 `rem` 或 `em` 进行字体大小和间距设置，`px` 用于边框、阴影等固定值。
*   **夜间模式：** 统一通过父组件的 `night-mode` 类名和 CSS 变量来控制夜间模式样式。

### 3.4. 脚本 (`<script setup lang="ts">`)

*   **导入顺序：**
    1.  Vue 相关的导入 (`ref`, `reactive`, `computed`, `watch`, `onMounted` 等)。
    2.  路由相关的导入 (`useRoute`, `useRouter`)。
    3.  Composable 函数导入。
    4.  Element Plus 组件导入。
    5.  其他工具函数或类型定义导入。
*   **响应式状态：**
    *   使用 `ref()` 定义基本类型（字符串、数字、布尔值）的响应式数据。
    *   使用 `reactive()` 定义对象或数组的响应式数据。
*   **计算属性：** 使用 `computed()` 定义依赖其他响应式数据的值。
*   **侦听器：** 使用 `watch()` 监听响应式数据的变化并执行副作用。
*   **生命周期钩子：** 使用 `onMounted`, `onUnmounted` 等钩子管理组件生命周期。
*   **Composable 函数：** 将可复用的逻辑封装在 Composable 函数中，并以 `use` 开头命名。
*   **Props 和 Emits：** 使用 `defineProps` 和 `defineEmits` 明确定义组件的输入属性和事件。
*   **函数命名：** 动词开头，清晰表达函数意图（如 `toggleSettings`, `updateFontSize`, `goBack`）。

## 4. TypeScript 规范

*   **类型定义：** 尽可能为变量、函数参数、返回值定义明确的类型。
*   **接口 (`interface`)：** 用于定义对象的结构。
*   **类型别名 (`type`)：** 用于定义基本类型或联合类型。
*   **泛型：** 在需要处理多种类型时使用泛型，提高代码的灵活性和复用性。
*   **枚举 (`enum`)：** 用于定义一组命名的常量。
*   **严格模式：** 启用 TypeScript 严格模式，以捕获更多潜在错误。

## 5. 代码格式化和 Linting

*   **Prettier：** 使用 Prettier 进行代码格式化，确保所有代码文件具有一致的格式。项目根目录已配置 `.prettierrc.json`。
*   **ESLint：** 使用 ESLint 进行代码 Linting，遵循推荐的 Vue 和 TypeScript 规则。项目根目录已配置 `eslint.config.js`。
*   **自动格式化：** 建议在保存时自动格式化代码（VS Code 设置：`"editor.formatOnSave": true`）。

## 6. 命名规范

*   **变量/函数/方法：** 小驼峰命名法 (camelCase)，例如 `novelId`, `fetchChapterContent`。
*   **常量：** 全大写，下划线分隔 (SNAKE_CASE)，例如 `API_BASE_URL` (如果定义)。
*   **类/接口/类型：** 大驼峰命名法 (PascalCase)，例如 `Chapter`, `BranchChapter`。
*   **布尔变量：** 以 `is`, `has`, `can` 等开头，例如 `isNightMode`, `hasPrevChapter`。

## 7. 注释规范

*   **JSDoc：** 为函数、接口、复杂逻辑块添加 JSDoc 风格的注释，说明其目的、参数、返回值和任何副作用。
*   **行内注释：** 用于解释单行或小段复杂代码。
*   **TODO 注释：** 使用 `// TODO: [描述]` 标记待办事项。

## 8. 错误处理

*   **统一错误提示：** 使用 `error` 响应式变量来存储和显示错误信息。
*   **`try...catch`：** 在异步操作中使用 `try...catch` 捕获错误。
*   **日志记录：** 使用 `console.error` 记录错误，便于调试。

## 9. API 请求

*   **统一封装：** 建议将所有 API 请求封装在单独的模块中（例如 `src/api/` 目录），使用 Axios 或 Fetch API。
*   **错误处理：** 在 API 封装层统一处理网络错误、认证错误等。

## 10. Git 提交信息规范
*   遵循 Conventional Commits 规范（或类似规范），例如：
    *   `feat: 添加新功能`
    *   `fix: 修复 bug`
    *   `docs: 更新文档`
    *   `style: 格式化代码（不影响功能）`
    *   `refactor: 代码重构`
    *   `perf: 性能优化`
    *   `test: 添加测试`
    *   `chore: 构建过程或辅助工具的变动`

## 11. 性能优化（建议）

*   **懒加载：** 对于大型组件或路由，考虑使用路由懒加载。
*   **图片优化：** 压缩图片，使用适当的图片格式。
*   **避免不必要的渲染：** 优化 `v-if`, `v-show`, `v-for` 的使用。

---

本规范将随着项目的演进不断完善。请所有开发者共同遵守，以确保代码质量。
