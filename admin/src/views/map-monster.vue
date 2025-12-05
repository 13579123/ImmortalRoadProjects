<template>
  <div class="map-monster-page" v-if="map">
    <div><h3>{{map.name}}</h3></div>
    <monster :map="map" :monsters="monsters"
             @openCreateMonster="openCreateMonster"
             @openUpdateMonster="openUpdateMonster"
             @uploadMonster="uploadMonster"></monster>
    <edit v-if="currentMonster" :monster="currentMonster"
          @setCurrentMonster="setCurrentMonster"
          @editMonster="editMonster"></edit>
  </div>
</template>

<script>
import {request} from "../../util/request";
import monster from "@/views/map-monster/monster";
import edit from "@/views/map-monster/edit";

export default {
  name: "map-monster",
  components: {
    monster,
    edit,
  },
  data() {
    return {
      map: null,
      monsters: [],
      currentMonster: null,
      operateType: 'create',
    }
  },
  async created() {
    const mapId = parseInt(this.$route.query.mapId || '')
    const loading = this.$loading({
      lock: true,
      text: '加载地图列表中',
      spinner: 'el-icon-loading',
    });
    const result = await request.get('/api/admin/getAllMap')
    loading.close()
    if (!result) return
    if (!result.data.status) return this.$message.warning(result.data.message)
    this.map = result.data.data.filter(map => map.id === mapId)[0]
    if (mapId === NaN || !this.map) {
      this.$message.warning("地图不存在")
      return this.$router.push('/map')
    }
    await this.flashMonster()
  },
  methods: {
    setCurrentMonster(monster) {
      this.currentMonster = monster
    },
    openCreateMonster(x , y) {
      this.operateType = 'create'
      this.currentMonster = {
        "name": "",
        "introduce": "境界: \n",
        "avatarImage": "",
        "mapId": parseInt(this.$route.query.mapId || ''),
        "conditionX": x,
        "conditionY": y,
        "power": 0,
        "bone": 0,
        "physique": 0,
        "movement": 0,
        "isBoss": 0,
        "dropJson": [],
      }
    },
    openUpdateMonster(monster) {
      this.operateType = 'update'
      this.currentMonster = monster ? {
        ...monster,
        dropJson: JSON.parse(monster.dropJson)
      } : monster
    },
    async flashMonster() {
      const loading = this.$loading({
        lock: true,
        text: '加载怪物列表中',
        spinner: 'el-icon-loading',
      });
      const result = await request.get(
          '/api/map/getMonsterByMap' ,
          {params: {"mapId": this.map.id}}
      )
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      this.monsters = result.data.data
    },
    async editMonster() {
      if (!this.currentMonster) return
      if (!this.currentMonster.name) return this.$message.warning('名称不能是空')
      if (!this.currentMonster.avatarImage) return this.$message.warning('头像不能是空')
      for (let i = 0; i < this.currentMonster.dropJson.length; i++) {
        const drop = this.currentMonster.dropJson[i]
        if (drop.itemId === void 0) return this.$message.warning('掉落物品不能是空')
      }
      const monster = {
        ...this.currentMonster ,
        dropJson: JSON.stringify(this.currentMonster.dropJson)
      }
      await this.uploadMonster(this.operateType , monster)
      this.currentMonster = null
    },
    async uploadMonster(type , monster) {
      const loading = this.$loading({
        lock: true,
        text: '上传中，请稍后',
        spinner: 'el-icon-loading',
      });
      let result = null
      if (type === 'create') {
        result = await request.post('/api/admin/createMonster' , {monster})
      } else if (type === 'update') {
        result = await request.post('/api/admin/updateMonster' , {monster})
      }
      loading.close()
      if (!result || !result.data.status) this.$message.warning(result?.data?.message)
      else this.$message.success(result?.data?.message)
      await this.flashMonster()
    },
  }
}
</script>

<style scoped lang="scss">
.map-monster-page {

}
</style>