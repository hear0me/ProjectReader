<template>
  <el-header class="home-header">
    <div class="logo-title">ProjectReader</div>
    <div class="search-bar">
      <el-autocomplete
        v-model="state1"
        :fetch-suggestions="querySearch"
        clearable
        class="inline-input w-50"
        placeholder="Please Input"
        @select="handleSelect"
      />
    </div>
    <div class="header-icons">
      <el-icon :size="24"><Reading /></el-icon>
      <el-icon :size="24"><User /></el-icon>
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { User, Reading } from '@element-plus/icons-vue';

interface RestaurantItem {
  value: string
  link: string
}

const state1 = ref('')

const restaurants = ref<RestaurantItem[]>([])
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value
  // call callback function to return suggestions
  cb(results)
}
const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}
const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' },
  ]
}

const handleSelect = (item: Record<string, any>) => {
  console.log(item)
}

onMounted(() => {
  restaurants.value = loadAll()
})

</script>

<style scoped>
.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff; /* Deep purple background from Figma */
  border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* Border from Figma */
  padding: 10px 20px;
  height: 60px; /* Keep existing height or adjust based on Figma if needed */
  color: #FFFFFF; /* White text color from Figma */
  border-radius: 0 0 4px 4px; /* Rounded corners from Figma */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Shadow from Figma */
}

.logo-title {
  font-size: 32px; /* Font size from Figma */
  font-weight: 400; /* Font weight from Figma */
  color: #2ecc71; /* Text color from Figma */
  text-align: center; /* Text alignment from Figma */
}

.search-bar {
  width: 360px; /* Width from Figma */
  margin: 0 20px;
}

.search-bar .el-input {
    background-color: #ECE6F0; /* Background color from Figma */
    border-radius: 28px; /* Border radius from Figma */
}
.search-bar .el-input__wrapper{
     background-color: #ECE6F0; /* Background color from Figma */
     box-shadow: none;
     color: #49454F; /* Text color from Figma */
     padding: 4px; /* Padding from Figma */
}
.search-bar .el-input__inner {
    color: #49454F; /* Text color from Figma */
    font-size: 16px; /* Font size from Figma */
    line-height: 1.5em; /* Line height from Figma */
    letter-spacing: 3.125%; /* Letter spacing from Figma */
}
.search-bar .el-input__prefix-inner {
    color: #49454F; /* Icon color from Figma */
    margin-right: 4px; /* Gap from Figma */
}
.search-bar .el-input__suffix-inner {
     color: #49454F; /* Icon color from Figma */
     margin-left: 4px; /* Gap from Figma */
}


.header-icons {
  display: flex;
  align-items: center;
  gap: 15px; /* Space between icons */
  color: #4F378A; /* Icon color from Figma */
}
.header-icons .el-icon {
    cursor: pointer;
}
.header-icons .el-icon:hover {
    color: #cccccc; /* Lighter color on hover */
}
</style>
