<template>
  <div class="reader" :class="{ 'night-mode': isNightModeActive }">
    <div class="reader-header">
      <div class="header-left">
        <el-button @click="goBack" icon="ArrowLeft" circle />
        <h1>{{ chapterData.title }}</h1>
      </div>
      <div class="header-right">
        <el-button @click="readerSettings.toggleSettings" icon="Setting" circle />
        <el-button @click="readerSettings.toggleNightMode" :icon="isNightModeActive ? 'Sunny' : 'Moon'" circle />
      </div>
    </div>

    <el-drawer v-model="readerSettings.showSettings.value" title="阅读设置" :size="300" direction="rtl">
      <div class="settings-panel">
        <div class="setting-item">
          <span>字体大小</span>
          <el-slider v-model="readerSettings.settings.fontSize" :min="12" :max="30" :step="1"
            @change="readerSettings.updateFontSize" />
        </div>
        <div class="setting-item">
          <span>行间距</span>
          <el-slider v-model="readerSettings.settings.lineHeight" :min="1.2" :max="3" :step="0.1"
            @change="readerSettings.updateLineHeight" />
        </div>
        <div class="setting-item">
          <span>背景颜色</span>
          <div class="bg-options">
            <div v-for="color in readerSettings.bgColors" :key="color" class="bg-option"
              :style="{ backgroundColor: color }"
              :class="{ active: readerSettings.settings.backgroundColor === color && !isNightModeActive }"
              @click="readerSettings.updateBgColor(color)"></div>
          </div>
        </div>
      </div>
    </el-drawer>

    <div class="reader-content" :style="readerSettings.readerContentStyles.value">
      <div v-if="navigation.loading.value" class="loading">加载中...</div>
      <div v-else-if="navigation.error.value" class="error-message">{{ navigation.error.value }}</div>
      <template v-else-if="chapterData.content && chapterData.content.length">
        <p v-for="(paragraph, index) in chapterData.content" :key="index">
          {{ paragraph }}
        </p>
      </template>
      <div v-else class="empty-content">暂无内容</div>
    </div>

    <div class="reader-controls">
      <button :disabled="!navigation.hasPrevChapter.value"
        @click="navigation.goToChapter(navigation.prevChapterId.value)">
        上一章
      </button>
      <button :disabled="!navigation.hasNextChapter.value"
        @click="navigation.goToChapter(navigation.nextChapterId.value)">
        下一章
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router' // useRoute can still be useful directly here for initial check
import { useReaderSettings } from '../components/useReaderSettings' // Adjust path
import { useChapterNavigation } from '../components/useChapterNavigation' // Adjust path

const route = useRoute();
const readerSettings = useReaderSettings()
const navigation = useChapterNavigation()

// Expose reactive properties directly for simpler template access
const chapterData = navigation.chapter // This is already a ref
const isNightModeActive = readerSettings.isNightMode // This is already a ref

// Expose methods
const goBack = navigation.goBack

onMounted(async () => {
  // Ensure IDs are valid before initializing
  const initialNovelId = navigation.getValidId(route.params.novelId);
  const initialChapterId = navigation.getValidId(route.params.chapterId);

  if (initialNovelId < 0 || initialChapterId < 0) {
    navigation.error.value = "无效的小说或章节ID，无法加载页面。";
    navigation.loading.value = false; // Ensure loading is false
    return;
  }
  // Update refs in composable if they were not set by watchers yet (e.g. direct navigation)
  navigation.novelId.value = initialNovelId;
  navigation.chapterId.value = initialChapterId;

  await navigation.initializeChapterData(initialNovelId, initialChapterId);
})

// Watchers for route params are now inside useChapterNavigation
</script>

<style scoped lang="scss">
// Global styles (consider moving to App.vue or a global CSS file if used across app)
// :global(body.global-night-mode) {
//   background-color: #1a1a1a !important;
//   color: #e0e0e0 !important;
// }
// :global(body.global-light-mode) {
//   /* Styles for light mode on body if needed, e.g., transitions */
// }

.reader {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  transition: color 0.3s;
  /* Background is handled by body or reader-content */

  // Night mode styles specific to the reader component itself
  &.night-mode {
    color: #e0e0e0; // Default text color for night mode

    .reader-header {
      background-color: rgba(30, 30, 30, 0.9); // Darker header

      h1 {
        color: #e0e0e0;
      }
    }

    .reader-content {
      background-color: #2c2c2c; // Slightly lighter than body for contrast
      // color is inherited or can be set specifically:
      // p { color: #dcdcdc; }
    }

    .reader-controls {
      background-color: rgba(30, 30, 30, 0.9);

      button {
        background-color: #555;
        color: #e0e0e0;

        &:disabled {
          background-color: #444;
        }

        &:not(:disabled):hover {
          background-color: #666;
        }
      }
    }

    .error-message {
      background-color: #573033;
      color: #ffc0cb;
    }

    // Adjust Element Plus components for night mode if needed via :deep
    :deep(.el-button) {
      // Example: You might want to change default button colors in night mode
      // This depends on how Element Plus handles theming.
      background-color: #555;
      color: #e0e0e0;

      &:hover {
        background-color: #666;
      }
    }

    :deep(.el-drawer) {
      background-color: #2c2c2c; // For the drawer itself
    }

    :deep(.el-drawer__header) {
      color: #e0e0e0;
      background-color: #333;
      border-bottom-color: #444;
    }

    :deep(.el-drawer__body) {
      background-color: #2c2c2c;
      color: #e0e0e0;
    }

    :deep(.settings-panel span) {
      color: #e0e0e0;
    }
  }
}

.reader-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 1rem;
  z-index: 10;
  transition: background-color 0.3s, color 0.3s;


  .header-left,
  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;

    h1 {
      margin: 0;
      font-size: 1.5rem;
      transition: color 0.3s;
    }
  }
}

.reader-content {
  /* Use CSS Custom Properties set by the composable */
  font-size: var(--reader-font-size, 16px);
  /* Fallback values */
  line-height: var(--reader-line-height, 1.8);
  /* background-color: var(--reader-bg-color, rgba(255, 255, 255, 0.95)); */
  /* Let the .reader.night-mode handle its own background or inherit from body */
  background-color: rgba(255, 255, 255, 0.95);
  /* Default light mode background */


  min-height: 400px;
  position: relative;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  transition: background-color 0.3s, color 0.3s;


  p {
    margin: 1em 0;
    text-indent: 2em;
    transition: color 0.3s;
  }
}

.reader-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  bottom: 1rem;
  transition: background-color 0.3s;

  button {
    padding: 0.8rem 2rem;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    min-width: 120px;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      background-color: #3aa876;
      transform: translateY(-1px);
    }
  }
}

.error-message {
  color: #ff4757;
  text-align: center;
  margin: 1rem 0;
  padding: 1rem;
  background-color: #ffe0e3;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
}

.empty-content {
  text-align: center;
  padding: 2rem;
  color: #888;
}

.settings-panel {
  padding: 1rem;
  /* Reduced padding for drawer */

  .setting-item {
    margin-bottom: 1.5rem;

    span {
      display: block;
      margin-bottom: 0.8rem;
      font-weight: 500;
    }
  }

  .bg-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
    /* Responsive columns */
    gap: 0.8rem;

    .bg-option {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 8px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s;

      &.active {
        border-color: #42b983;
        box-shadow: 0 0 5px #42b983;
      }

      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

:deep(.el-drawer__header) {
  margin-bottom: 1rem;
  /* Adjusted */
  padding: 1rem 1.5rem;
  /* Adjusted */
  border-bottom: 1px solid #eee;
  // Night mode handled by .reader.night-mode :deep(...)
}

:deep(.el-drawer__body) {
  padding: 0 !important; // Override ElPlus padding if settings-panel has its own
}

:deep(.el-slider) {
  width: 100%;
}
</style>