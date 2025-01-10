<template>
  <div id="app">
    <nav>
      <div class="nav-left">
        <router-link to="/">首页</router-link>
        <router-link to="/novels">小说列表</router-link>
      </div>
      <div class="nav-right">
        <router-link to="/bookshelf" class="bookshelf-link">
          <i class="fas fa-book-open"></i>
          我的书架
        </router-link>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

nav {
  position: fixed;
  top: 0;
  left: 0;
  padding: 1rem 2rem;
  background: white;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

nav a:hover {
  background-color: #f8f9fa;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.bookshelf-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #42b983;
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.bookshelf-link:hover {
  background-color: #3aa876 !important;
}

.bookshelf-link i {
  font-size: 1.1rem;
}
</style>
