<template>
  <el-footer class="home-footer">
    <span>版权信息</span>
    <span>联系方式: xxx-xxxx-xxxx</span>
  </el-footer>
</template>

<script setup>
// 如果 Footer 组件需要任何 props 或 emits，可以在这里定义
</script>

<style scoped>
.home-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #65558F; /* Deep purple background from Figma */
  color: #FFFFFF; /* White text color from Figma */
  padding: 10px 20px; /* Keep existing padding */
  font-size: 16px; /* Font size from Figma */
  line-height: 1.5em; /* Line height from Figma */
  letter-spacing: 3.125%; /* Letter spacing from Figma */
  height: 40px; /* Keep existing height */
  border-top: 1px solid rgba(0, 0, 0, 0.1); /* Border from Figma */
  border-radius: 4px; /* Rounded corners from Figma */
}
</style>
