<template>
  <div id="app">
    <div class="enum-list">
      <div class="enum" v-for="route in $router.getRoutes()" v-if="route.meta['enum']" @click="$router.push(route.path)"
          :style="'background-color: ' + (route.path === $route.path ? 'rgba(0, 97, 200, 0.5);color: white;' : '')">
        {{ route.meta.name }}
      </div>
    </div>
    <div class="enum-container">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#app {
  .enum-list {
    .enum {
      width: 100%;
      height: 50px;
      cursor: pointer;
      overflow: hidden;
      font-weight: 900;
      line-height: 50px;
      user-select: none;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      transition: background-color 0.3s , color 0.3s;
    }
    .enum:hover {
      color: white;
      background-color: rgba(0, 97, 200, 0.5);
    }
    width: 15%;
    padding: 3vh 0;
    height: 100vh;
    overflow: auto;
    background-color: #d0d0d0;
    box-sizing: border-box;
  }
  .enum-container {
    width: 85%;
    height: 100vh;
    overflow: auto;
    padding: 3vh 3vw;
    position: relative;
    box-sizing: border-box;
  }
  display: flex;
  width: 100vw;
  height: 100vh;
}
</style>
