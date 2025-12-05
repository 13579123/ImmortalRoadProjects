<template>
  <div class="list-component">
    <div class="map-header">
      <div class="id" style="flex: 1">编号</div>
      <div class="code" style="flex: 1">世界</div>
      <div class="name" style="flex: 2">名称</div>
      <div class="introduce" style="flex: 7">简介</div>
      <div class="operate" style="flex: 2">操作</div>
    </div>
    <div class="list-box">
      <div class="map" v-for="map in filterMaps" :key="map.id">
        <div class="id" style="flex: 1">{{map.id}}</div>
        <div class="code" style="flex: 1" :title="map.code">{{getWorld(map.mapWorld)}}</div>
        <div class="name" style="flex: 2" :title="map.name">{{map.name}}</div>
        <div class="introduce" style="flex: 7" :title="map.introduce">
          {{map.introduce}}
        </div>
        <div class="operate" style="flex: 2">
          <span @click="setMap(map)" style="color: #79b2fa;font-size: 12px;margin: 0 2px;user-select: none;cursor: pointer">设置</span>
          <span @click="$emit('openUpdateMap' , map)" style="color: #79b2fa;font-size: 12px;margin: 0 2px;user-select: none;cursor: pointer">编辑</span>
          <span @click="deleteMap(map)" style="color: #ff7b7b;font-size: 12px;margin: 0 2px;user-select: none;cursor: pointer">删除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {request} from "../../../util/request";

export default {
  name: "list",
  props: {
    maps: { type: Array },
  },
  computed: {
    filterMaps() {
      return [
        ...this.maps.filter(map => map.mapWorld === 1) ,
        ...this.maps.filter(map => map.mapWorld === 2) ,
        ...this.maps.filter(map => map.mapWorld === 3) ,
        ...this.maps.filter(map => map.mapWorld === 4) ,
        ...this.maps.filter(map => map.mapWorld === 0) ,
      ]
    }
  },
  methods: {
    setMap(map) {
      this.$router.push('/map-monster?mapId=' + map.id)
    },
    async deleteMap(map) {
      const action = await this.$alert('地图删除不可逆，确定要进行该操作吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(_ => _)
      if (action !== 'confirm') return
      const loading = this.$loading({
        lock: true,
        text: '加载地图列表中',
        spinner: 'el-icon-loading',
      });
      const result = await request.delete(
          '/api/admin/deleteMapById' ,
          {data: {idList: [map.id]}}
      )
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      this.$message.success(result.data.message)
      await this.$parent.flashMaps()
    },
    getWorld(worldId) {
      if (worldId === 3) return '虚空'
      if (worldId === 2) return '仙界'
      if (worldId === 1) return '人界'
    },
  }
}
</script>

<style scoped lang="scss">
.list-component {
  .map-header {
    border-bottom: 1px solid #68a7f5;
  }
  .map-header , .map{
    div {
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 100%;
      line-height: 45px;
      box-sizing: border-box;
      border-right: 1px solid #68a7f5;
    }
    display: flex;
    align-items: center;
    height: 45px;
  }
  .list-box {
    .map {
      div {
        font-size: 14px;
      }
      border-bottom: 1px solid #68a7f5;
      box-sizing: border-box;
    }
    width: 100%;
    height: 70vh;
    overflow: auto;
  }
  width: 100%;
  height: 100%;
  margin-top: 3vh;
  border: 1px solid #68a7f5;
}
</style>