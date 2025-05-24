import { ref, reactive, watch, onMounted, onUnmounted, computed } from 'vue'

export function useReaderSettings() {
  const showSettings = ref(false)
  const isNightMode = ref(false)

  const settings = reactive({
    fontSize: 16,
    lineHeight: 1.8,
    backgroundColor: '#ffffff', // 默认日间背景
  })

  const bgColors = [
    '#ffffff', // 白色
    '#f4ecd8', // 米色
    '#cce8cf', // 淡绿
    '#e6e6e6', // 浅灰
  ]

  const bodyOriginalBackgroundColor = ref('');

  const applyBodyStyles = () => {
    if (isNightMode.value) {
      document.body.classList.add('global-night-mode')
      document.body.classList.remove('global-light-mode')
      document.body.style.backgroundColor = '#1a1a1a' // 夜间模式固定背景
    } else {
      document.body.classList.add('global-light-mode')
      document.body.classList.remove('global-night-mode')
      document.body.style.backgroundColor = settings.backgroundColor
    }
  }

  watch(isNightMode, () => {
     applyBodyStyles();
  }, { immediate: true }) // immediate to apply on load

  watch(() => settings.backgroundColor, (newColor) => {
    if (!isNightMode.value) {
      document.body.style.backgroundColor = newColor
    }
  })

  onMounted(() => {
     bodyOriginalBackgroundColor.value = document.body.style.backgroundColor || '';
     applyBodyStyles(); // Apply styles on component mount
  })

  onUnmounted(() => {
    // 恢复 body 原始背景色或移除特定类
    document.body.style.backgroundColor = bodyOriginalBackgroundColor.value;
    document.body.classList.remove('global-night-mode', 'global-light-mode')
  })

  const toggleSettings = () => {
    showSettings.value = !showSettings.value
  }

  const toggleNightMode = () => {
    isNightMode.value = !isNightMode.value
  }

  const updateFontSize = (size: number) => {
    settings.fontSize = size
  }

  const updateLineHeight = (height: number) => {
    settings.lineHeight = height
  }

  const updateBgColor = (color: string) => {
    settings.backgroundColor = color
  }

  // 用于模板内绑定的样式对象
  const readerContentStyles = computed(() => ({
    '--reader-font-size': `${settings.fontSize}px`,
    '--reader-line-height': settings.lineHeight,
    // 如果阅读器内部背景色也受 settings.backgroundColor 影响（非夜间模式下）
    // '--reader-bg-color': isNightMode.value ? 'transparent' : settings.backgroundColor // 或者固定为白色，让body控制
  }))

  return {
    showSettings,
    isNightMode,
    settings,
    bgColors,
    toggleSettings,
    toggleNightMode,
    updateFontSize,
    updateLineHeight,
    updateBgColor,
    readerContentStyles,
  }
}