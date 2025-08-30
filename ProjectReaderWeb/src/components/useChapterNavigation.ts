import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Chapter {
  id: number
  title: string
  content: string[]
}

interface BranchChapter {
  id: number;
  title: string;
  author: string;
  creationTime: string; // ISO 8601 格式的日期字符串
  tags: string[];
}

// 辅助函数：生成虚拟章节内容
const generateMockChapterContent = (chapterId: number, novelId: number): string[] => {
  const paragraphs = [];
  paragraphs.push(`这是小说 ${novelId} 的第 ${chapterId} 章的虚拟内容。`);
  paragraphs.push('这段内容是为测试目的而生成的，不代表真实数据。');
  for (let i = 0; i < 5; i++) {
    paragraphs.push(`这是第 ${i + 1} 段虚拟文本。它包含一些随机的句子，以模拟真实的章节内容。`);
  }
  return paragraphs;
};

// 辅助函数：生成虚拟章节数据
const generateMockChapter = (novelId: number, chapterId: number): Chapter => {
  return {
    id: chapterId,
    title: `虚拟小说 ${novelId} - 第 ${chapterId} 章标题`,
    content: generateMockChapterContent(chapterId, novelId),
  };
};

// 验证并获取有效的ID值
const getValidId = (param: string | string[] | undefined): number => {
  const id = typeof param === 'string' ? parseInt(param, 10) : NaN
  return isNaN(id) ? -1 : id
}

export function useChapterNavigation() {
  const route = useRoute()
  const router = useRouter()

  const novelId = ref<number>(getValidId(route.params.novelId))
  const chapterId = ref<number>(getValidId(route.params.chapterId))

  const loading = ref(false)
  const error = ref<string | null>(null)

  const chapter = ref<Chapter>({
    id: chapterId.value,
    title: `第${chapterId.value}章`, // 初始值，会被 fetch 覆盖
    content: [],
  })

  const chapters = ref<number[]>([]) // 存储章节 ID 列表

  const branchChapters = ref<BranchChapter[]>([]);
  const showBranchChapters = ref(false);
  const sortKey = ref<'creationTime' | 'title' | 'author'>('creationTime'); // 默认按创作时间排序
  const sortOrder = ref<'asc' | 'desc'>('desc'); // 默认降序

  // 模拟API调用获取章节列表
  const fetchChaptersList = async (currentNovelId: number) => {
    if (currentNovelId < 0) {
        error.value = '无效的小说ID，无法获取章节列表';
        chapters.value = []; // 清空章节列表
        return [];
    }
    try {
      // console.log(`Workspaceing chapters for novel ${currentNovelId}`);
      await new Promise(resolve => setTimeout(resolve, 200)) // 模拟延迟
      // 实际应用中，这里会根据 novelId 获取不同的章节列表
      const response = Array.from({ length: 10 }, (_, i) => i + 1) // 示例数据
      chapters.value = response
      return response
    } catch (e) {
      error.value = '获取章节列表失败'
      console.error('fetchChaptersList error:', e)
      chapters.value = []
      return []
    }
  }

  // 模拟API调用获取章节内容
  const fetchBranchChapters = async (novelId: number, currentChapterId: number) => {
    if (novelId < 0 || currentChapterId < 0) {
      error.value = '无效的小说或章节ID，无法获取分支章节列表';
      branchChapters.value = [];
      return;
    }
    loading.value = true; // 可以考虑为分支章节单独设置 loading 状态
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // 模拟延迟
      // 示例数据：根据当前章节ID生成一些分支章节
      const mockBranches: BranchChapter[] = Array.from({ length: 5 }, (_, i) => ({
        id: currentChapterId * 100 + i + 1, // 模拟不同的章节ID
        title: `分支章节 ${currentChapterId}.${i + 1} - ${['A', 'B', 'C', 'D', 'E'][i]}`,
        author: `作者 ${i % 2 === 0 ? '张三' : '李四'}`,
        creationTime: new Date(Date.now() - i * 3600 * 1000 * 24).toISOString(), // 模拟不同创作时间
        tags: [`标签${i + 1}`, `类型${i % 3}`],
      }));
      branchChapters.value = mockBranches;
    } catch (e) {
      error.value = '获取分支章节失败';
      console.error('fetchBranchChapters error:', e);
      branchChapters.value = [];
    } finally {
      loading.value = false;
    }
  };

  const toggleBranchChapters = async () => {
    console.log("novelId.value", novelId.value);
    showBranchChapters.value = !showBranchChapters.value;
    if (showBranchChapters.value) {
      await fetchBranchChapters(novelId.value, chapterId.value);
      sortBranchChapters(); // 默认排序
    }
  };

  const sortBranchChapters = () => {
    branchChapters.value.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortKey.value === 'creationTime') {
        valA = new Date(a.creationTime).getTime();
        valB = new Date(b.creationTime).getTime();
      } else if (sortKey.value === 'title') {
        valA = a.title;
        valB = b.title;
      } else if (sortKey.value === 'author') {
        valA = a.author;
        valB = b.author;
      }

      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const fetchChapterContent = async (currentChapterId: number) => {
    error.value = null; // 重置错误状态
    if (currentChapterId < 0) {
      error.value = '无效的章节ID';
      chapter.value = { id: -1, title: '错误', content: ['无效的章节ID'] };
      return;
    }

    loading.value = true;
    try {
      // 如果 novelId 是 999，则生成虚拟章节数据
      if (novelId.value === 999) {
        chapter.value = generateMockChapter(novelId.value, currentChapterId);
      } else {
        // 否则，模拟API调用获取章节内容
        await new Promise(resolve => setTimeout(resolve, 300)); // 模拟延迟
        const response = {
          id: currentChapterId,
          title: `第${currentChapterId}章标题`,
          content: [
            `这是第${currentChapterId}章的示例内容。`,
            '这是第一段内容。',
            '这是第二段内容。',
            '小说ID: ' + novelId.value,
          ],
        };
        chapter.value = response;
      }
    } catch (e) {
      error.value = '获取章节内容失败';
      console.error('fetchChapterContent error:', e);
      chapter.value = { ...chapter.value, title: '加载失败', content: ['获取内容失败，请重试'] };
    } finally {
      loading.value = false;
    }
  };

  const currentChapterIndex = computed(() => chapters.value.indexOf(chapterId.value))
  const hasPrevChapter = computed(() => chapters.value.length > 0 && currentChapterIndex.value > 0)
  const hasNextChapter = computed(() => chapters.value.length > 0 && currentChapterIndex.value < chapters.value.length - 1)

  const prevChapterId = computed(() =>
    hasPrevChapter.value ? chapters.value[currentChapterIndex.value - 1] : null
  )
  const nextChapterId = computed(() =>
    hasNextChapter.value ? chapters.value[currentChapterIndex.value + 1] : null
  )

  async function goToChapter(newChapterId: number | null) {
    if (newChapterId === null || novelId.value < 0) {
      error.value = '无效的导航参数'
      return
    }
    try {
      await router.push(`/novels/${novelId.value}/read/${newChapterId}`)
    } catch (e) {
      error.value = '页面跳转失败'
      console.error('goToChapter error:', e)
    }
  }

  function goBack() {
    if (novelId.value < 0) {
      router.push('/')
      return
    }
    router.push(`/novels/${novelId.value}`)
  }

  const initializeChapterData = async (nId: number, cId: number) => {
     if (nId < 0 || cId < 0) {
         error.value = '无效的小说或章节ID';
         loading.value = false;
         return;
     }
     loading.value = true;
     error.value = null;
     try {
         await Promise.all([
             fetchChaptersList(nId),
             fetchChapterContent(cId)
         ]);
     } catch (e) {
         console.error("Initialization error:", e);
         error.value = '章节数据初始化失败';
     } finally {
         loading.value = false;
     }
  };

 // 监听路由参数变化以更新 novelId 和 chapterId
 // 并重新加载数据
  watch(() => route.params.novelId, (newNIdParam) => {
     const newValidNovelId = getValidId(newNIdParam);
     if (novelId.value !== newValidNovelId) {
         novelId.value = newValidNovelId;
         // 小说ID变化，章节列表和当前章节内容都需要更新
         if (newValidNovelId >=0 && chapterId.value >=0) {
              initializeChapterData(newValidNovelId, chapterId.value);
         } else if (newValidNovelId < 0) {
             error.value = "无效的小说ID";
             chapters.value = [];
             chapter.value = { id: -1, title: '错误', content: ['无效的小说ID'] };
         }
     }
  });

  watch(() => route.params.chapterId, (newCIdParam) => {
     const newValidChapterId = getValidId(newCIdParam);
     if (chapterId.value !== newValidChapterId) {
         chapterId.value = newValidChapterId;
         if (newValidChapterId >= 0 && novelId.value >=0) {
             // 章节ID变化，只需获取新章节内容 (章节列表通常在小说ID变化时获取)
             // 如果章节列表可能因其他原因变化，也在此处重新获取 fetchChaptersList
             fetchChapterContent(newValidChapterId);
         } else if (newValidChapterId < 0) {
              error.value = "无效的章节ID";
              chapter.value = { id: -1, title: '错误', content: ['无效的章节ID'] };
         }
     }
  });


  return {
    novelId,
    chapterId,
    loading,
    error,
    chapter,
    chapters, // Expose for potential direct use or debugging
    branchChapters,
    showBranchChapters,
    sortKey,
    sortOrder,
    fetchChaptersList,
    fetchChapterContent,
    fetchBranchChapters,
    toggleBranchChapters,
    sortBranchChapters,
    hasPrevChapter,
    hasNextChapter,
    prevChapterId,
    nextChapterId,
    goToChapter,
    goBack,
    initializeChapterData,
    getValidId // Expose if needed elsewhere, or keep internal
  }
}
