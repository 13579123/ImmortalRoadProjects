<template>
  <div class="map-page">
    <div class="btn-box">
      <el-button type="success" @click="openCreateMap()">添加地图</el-button>
    </div>
    <list :maps="maps" @openUpdateMap="openUpdateMap"></list>
    <edit v-if="currentEditMap" :map="currentEditMap" @setCurrentMap="setCurrentMap" @editMap="editMap"></edit>
  </div>
</template>

<script>
import {request} from "../../util/request";
import list from "@/views/map/list";
import edit from "@/views/map/edit";

export default {
  name: "MapPage",
  components: {
    list,edit
  },
  data() {
    return {
      // 新建还是更新
      operateType: "create",
      // 当前操作的map
      currentEditMap: null,
      // 地图列表
      maps: [],
    }
  },
  created() {
    this.flashMaps().then()
  },
  methods: {
    openCreateMap() {
      this.operateType = 'create'
      this.currentEditMap = {
        "name": "",
        "introduce": "",
        "mapImage": "",
        "mapLevel": 0,
        "mapWorld": 1,
        "startX": 0,
        "startY": 0,
      }
    },
    openUpdateMap(map) {
      this.operateType = 'update'
      this.currentEditMap = map ? {...map} : null
    },
    setCurrentMap(map) {
      this.currentEditMap = map
    },
    async editMap() {
      if (!this.currentEditMap) return
      const loading = this.$loading({
        lock: true,
        text: '上传中，请稍后',
        spinner: 'el-icon-loading',
      });
      let result = null
      if (this.operateType === 'create') {
        result = await request.post('/api/admin/createMap' , {map: this.currentEditMap})
      } else if (this.operateType === 'update') {
        result = await request.post('/api/admin/updateMap' , {map: this.currentEditMap})
      }
      loading.close()
      if (!result || !result.data.status) this.$message.warning(result?.data?.message)
      else this.$message.success(result?.data?.message)
      this.currentEditMap = null
      await this.flashMaps()
    },
    async flashMaps() {
      const loading = this.$loading({
        lock: true,
        text: '加载地图列表中',
        spinner: 'el-icon-loading',
      });
      const result = await request.get('/api/admin/getAllMap')
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      this.maps = result.data.data
    },
  }
}
</script>

<style scoped lang="scss">

</style>