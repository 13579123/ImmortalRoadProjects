<template>
  <div class="movement-art">
    <div class="btn-box">
      <el-button type="success" @click="openCreateMovementArt()">添加招式</el-button>
    </div>
    <edit v-if="currentMovementArt" :movementArt="currentMovementArt"
          @editMovementArt="editMovementArt"
          @setCurrentMovementArt="setCurrentMovementArt"></edit>
    <list :movementArts="movementArts" @openUpdateMovementArt="openUpdateMovementArt"></list>
  </div>
</template>

<script>
import list from "@/views/movement-art/list";
import {request} from "../../util/request";
import edit from "@/views/movement-art/edit";

export default {
  name: "movement-art",
  components: {
    list,edit
  },
  data() {
    return {
      movementArts: [],
      operateType: 'create',
      currentMovementArt: null,
    }
  },
  created() {
    this.flashMovementArts().then()
  },
  methods: {
    setCurrentMovementArt(m) {
      this.currentMovementArt = m
    },
    async openCreateMovementArt() {
      this.operateType = 'create'
      this.currentMovementArt = {
        "code": "",
        "name": "",
        "introduce": "",
        "icon": "",
        "level": 0,
      }
    },
    async openUpdateMovementArt(movementArt) {
      this.operateType = 'update'
      this.currentMovementArt = movementArt
    },
    async flashMovementArts() {
      const loading = this.$loading({
        lock: true,
        text: '加载地图列表中',
        spinner: 'el-icon-loading',
      });
      const result = await request.get('/api/admin/getAllMovementArts')
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      console.log(result.data.data)
      this.movementArts = result.data.data
    },
    async editMovementArt() {
      const loading = this.$loading({
        lock: true,
        text: '上传中，请稍后',
        spinner: 'el-icon-loading',
      });
      let result = null
      if (this.operateType === 'create') {
        result = await request.post('/api/admin/createMovementArt' , {movementArt: this.currentMovementArt})
      } else if (this.operateType === 'update') {
        result = await request.post('/api/admin/updateMovementArt' , {movementArt: this.currentMovementArt})
      }
      loading.close()
      if (!result || !result.data.status) this.$message.warning(result?.data?.message)
      else this.$message.success(result?.data?.message)
      this.currentMovementArt = null
      await this.flashMovementArts()
    },
  }
}
</script>

<style scoped lang="scss">

</style>