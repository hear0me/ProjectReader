<template>
  <div class="chapter-editor" :class="{ 'night-mode': isNightMode }">
    <header class="editor-header">
      <div class="left">
        <el-button icon="ArrowLeft" circle @click="goBack" aria-label="返回" />
        <div class="title-area">
          <h1 class="title">{{ pageTitle }}</h1>
          <div class="meta">父章节：<strong>{{ parentChapterTitle }}</strong></div>
        </div>
      </div>

      <div class="right">
        <el-tooltip content="夜间模式" placement="bottom">
          <el-switch v-model="isNightMode" active-text="夜间" inactive-text="日间" />
        </el-tooltip>

        <el-button type="warning" @click="saveDraft" :loading="saving" plain>保存草稿</el-button>
        <el-button type="primary" @click="submitChapter" :loading="submitting">提交 (&nbsp;Ctrl+Enter&nbsp;)</el-button>
      </div>
    </header>

    <main class="editor-main">
      <section class="left-pane">
        <el-form ref="formRef" :model="chapterForm" :rules="rules" label-width="84px" class="editor-form">
          <el-form-item label="章节标题" prop="title">
            <el-input v-model="chapterForm.title" placeholder="请输入章节标题" clearable maxlength="120" show-word-limit />
          </el-form-item>

          <el-form-item label="标签" prop="tags">
            <el-select
              v-model="chapterForm.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="选择或输入标签"
              @change="onTagsChange"
              :collapse-tags="false"
            >
              <el-option
                v-for="tag in availableTags"
                :key="tag.value"
                :label="tag.label"
                :value="tag.value"
              />
            </el-select>
            <div class="tag-hint">支持回车添加新标签，最多 8 个</div>
          </el-form-item>

          <el-form-item label="章节内容" prop="content">
            <div class="editor-toolbar">
              <div class="toolbar-left">
                <el-button text @click="togglePreview">{{ isPreview ? '编辑' : '预览' }}</el-button>
                <el-button text @click="insertTimestamp">插入时间</el-button>
              </div>
              <div class="toolbar-right">
                <div class="counter">字数：{{ wordCount }} / {{ wordLimit }}</div>
              </div>
            </div>

            <div class="quill-wrap">
              <QuillEditor
                v-show="!isPreview"
                v-model:content="chapterForm.content"
                theme="snow"
                class="quill-editor"
                :contentType="'html'"
                placeholder="请输入章节内容..."
              />

              <div v-show="isPreview" class="preview" v-html="previewHtml" aria-live="polite"></div>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="form-actions">
              <el-button type="primary" @click="submitChapter">提交</el-button>
              <el-button @click="saveDraft">保存草稿</el-button>
              <el-button @click="goBack">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </section>

      <aside class="right-pane">
        <el-card shadow="hover" class="info-card">
          <div class="card-row">
            <div>草稿状态：</div>
            <div><strong>{{ isDirty ? '未保存' : '已保存' }}</strong></div>
          </div>
          <div class="card-row">
            <div>上次保存：</div>
            <div>{{ lastSavedText }}</div>
          </div>

          <el-divider />

          <div class="card-row">
            <div>内容长度：</div>
            <div>{{ charCount }} 字 / {{ wordCount }} 词</div>
          </div>

          <el-divider />

          <div class="available-tags">
            <div class="muted">推荐标签：</div>
            <div class="tags">
              <el-tag
                v-for="t in availableTags.slice(0, 6)"
                :key="t.value"
                @click.native.prevent="addTag(t.value)"
                class="clickable-tag"
              >
                {{ t.label }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </aside>
    </main>

    <footer class="editor-footer">
      <el-progress :text-inside="false" :stroke-width="6" :percentage="progress" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElSelect,
  ElOption,
  ElSwitch,
  ElCard,
  ElTag,
  ElDivider,
  ElProgress,
  ElTooltip,
} from 'element-plus';
import { useReaderSettings } from '../components/useReaderSettings';

const route = useRoute();
const router = useRouter();
const readerSettings = useReaderSettings?.() ?? { isNightMode: ref(false) };

const novelId = Number(route.params.novelId ?? 0);
const parentChapterId = Number(route.params.parentChapterId ?? 0);

const pageTitle = ref('创建新分支章节');
const parentChapterTitle = ref('加载中...');

const isNightMode = ref(readerSettings.isNightMode?.value ?? false);

const chapterForm = reactive({
  title: '',
  content: '',
  tags: [] as string[],
});

const availableTags = ref([
  { label: '奇幻', value: 'fantasy' },
  { label: '科幻', value: 'sci-fi' },
  { label: '武侠', value: 'wuxia' },
  { label: '言情', value: 'romance' },
  { label: '悬疑', value: 'mystery' },
  { label: '历史', value: 'history' },
]);

const formRef = ref();
const saving = ref(false);
const submitting = ref(false);
const isPreview = ref(false);

const wordLimit = 20000;

const rules = {
  title: [
    { required: true, message: '请输入章节标题', trigger: 'blur' },
    { min: 2, max: 120, message: '标题长度需在 2 到 120 个字符', trigger: 'blur' },
  ],
  content: [{ required: true, message: '章节内容不能为空', trigger: 'blur' }],
};

// --- derived state ---
const plainText = computed(() => {
  // 移除 HTML 标签，作为字数统计依据
  return chapterForm.content.replace(/<[^>]*>/g, '') || '';
});
const charCount = computed(() => plainText.value.length);
const wordCount = computed(() => {
  const words = plainText.value.trim().split(/\s+/).filter(Boolean);
  return words.length;
});

const progress = computed(() => Math.min(100, Math.round((wordCount.value / 1000) * 100 / 10) * 10));

// --- autosave ---
const storageKey = `branch-editor-draft:${novelId}:${parentChapterId}`;
const lastSavedAt = ref<number | null>(null);
const saveTimer = ref<number | null>(null);
const isDirty = ref(false);

function loadDraft() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const data = JSON.parse(raw);
      chapterForm.title = data.title || chapterForm.title;
      chapterForm.content = data.content || chapterForm.content;
      chapterForm.tags = data.tags || chapterForm.tags;
      lastSavedAt.value = data.savedAt || null;
    }
  } catch (e) {
    console.warn('读取草稿失败', e);
  }
}

function scheduleAutoSave() {
  isDirty.value = true;
  if (saveTimer.value) {
    clearTimeout(saveTimer.value);
  }
  // 1.5s 防抖
  // @ts-ignore
  saveTimer.value = setTimeout(() => {
    saveDraft();
  }, 1500) as unknown as number;
}

async function saveDraft() {
  saving.value = true;
  try {
    const payload = {
      title: chapterForm.title,
      content: chapterForm.content,
      tags: chapterForm.tags,
      savedAt: Date.now(),
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
    lastSavedAt.value = payload.savedAt;
    isDirty.value = false;
    ElMessage.success('草稿已保存到本地');
  } catch (e) {
    console.error('保存草稿失败', e);
    ElMessage.error('草稿保存失败');
  } finally {
    saving.value = false;
  }
}

const lastSavedText = computed(() => {
  if (!lastSavedAt.value) return '—';
  const dt = new Date(lastSavedAt.value);
  return dt.toLocaleString();
});

// --- preview html ---
const previewHtml = computed(() => {
  // 注意：生产环境请在服务端或使用可靠的库 (如 DOMPurify) 做 HTML 清理/消毒。
  return chapterForm.content;
});

function addTag(tag: string) {
  if (!chapterForm.tags.includes(tag)) {
    if (chapterForm.tags.length >= 8) {
      ElMessage.warning('标签最多 8 个');
      return;
    }
    chapterForm.tags.push(tag);
  }
}

function onTagsChange(v: string[]) {
  // 将新标签加入候选列表，便于下次复用
  v.forEach((val) => {
    if (!availableTags.value.some(t => t.value === val)) {
      availableTags.value.unshift({ label: val, value: val });
    }
  });
}

function insertTimestamp() {
  const now = new Date().toLocaleString();
  const snippet = `<p><em>【插入时间：${now}】</em></p><p></p>`;
  chapterForm.content = (chapterForm.content || '') + snippet;
}

async function submitChapter() {
  if (submitting.value) return;
  // 表单验证
  // @ts-ignore
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    submitting.value = true;
    try {
      // 这里调用真实 API，并且对 content 做安全处理/后端再次消毒。
      const payload = {
        novelId,
        parentChapterId,
        title: chapterForm.title,
        content: chapterForm.content,
        tags: chapterForm.tags,
      };
      console.log('提交 payload:', payload);

      // 模拟网络延迟
      await new Promise((r) => setTimeout(r, 800));

      // 删除本地草稿（如果提交成功）
      localStorage.removeItem(storageKey);
      lastSavedAt.value = null;
      isDirty.value = false;

      ElMessage.success('新分支章节创建成功！');
      // 跳转回阅读页面（示例）
      router.push({ name: 'reader', params: { novelId, chapterId: parentChapterId } });
    } catch (e) {
      console.error(e);
      ElMessage.error('提交失败，请重试');
    } finally {
      submitting.value = false;
    }
  });
}

function goBack() {
  router.back();
}

function togglePreview() {
  isPreview.value = !isPreview.value;
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    saveDraft();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    submitChapter();
  }
}

onMounted(() => {
  // 模拟取父章节标题
  parentChapterTitle.value = `父章节 ID: ${parentChapterId}`;
  loadDraft();
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  if (saveTimer.value) clearTimeout(saveTimer.value as unknown as number);
});

// watch changes to autosave
watch(
  () => [chapterForm.title, chapterForm.content, chapterForm.tags],
  () => {
    scheduleAutoSave();
  },
  { deep: true }
);

// expose for template
</script>

<style scoped lang="scss">
:root {
  --bg: #ffffff;
  --card: #ffffff;
  --text: #222;
  --muted: #666;
  --accent: #409eff;
  --surface: #f7f8fa;
}

.chapter-editor {
  max-width: 1100px;
  margin: 24px auto;
  padding: 20px;
  background: var(--bg);
  color: var(--text);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(39, 45, 55, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: background-color 0.25s, color 0.25s;
}

.chapter-editor.night-mode {
  --bg: #1f1f24;
  --card: #2b2b32;
  --text: #e8e8e8;
  --muted: #a8a8a8;
  --accent: #42b983;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.editor-header .left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-area .title {
  margin: 0;
  font-size: 1.25rem;
}

.title-area .meta {
  font-size: 0.85rem;
  color: var(--muted);
}

.editor-main {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 18px;
}

.left-pane {
  background: var(--card);
  padding: 14px;
  border-radius: 8px;
}

.right-pane {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.editor-form .el-form-item {
  margin-bottom: 14px;
}

.quill-wrap {
  display: flex;
  flex-direction: column;
}

.quill-editor {
  min-height: 360px;
  max-height: 70vh;
  border-radius: 6px;
  overflow: hidden;
}

.preview {
  min-height: 360px;
  max-height: 70vh;
  overflow-y: auto;
  padding: 12px;
  background: var(--surface);
  border-radius: 6px;
}

.info-card {
  padding: 12px;
}

.card-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: var(--muted);
}

.available-tags .tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.clickable-tag {
  cursor: pointer;
}

.editor-footer {
  padding-top: 6px;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.counter {
  font-size: 0.85rem;
  color: var(--muted);
}

.tag-hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted);
}

/* 响应式 */
@media (max-width: 980px) {
  .editor-main {
    grid-template-columns: 1fr;
  }
  .right-pane {
    order: 2;
  }
}

@media (max-width: 480px) {
  .chapter-editor {
    margin: 8px;
    padding: 12px;
  }
  .quill-editor, .preview { min-height: 220px; }
}
</style>
