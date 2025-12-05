<template>
  <div class="method-exercise">
    <div class="btn-box">
      <el-button type="success" @click="openCreateMethodExercise()">添加功法</el-button>
    </div>
    <list :methodExercise="methodExercises" @openUpdateMethodExercise="openUpdateMethodExercise"></list>
    <edit v-if="currentEditMethodExercise" :methodExercise="currentEditMethodExercise"
          @setCurrentMethodExercise="setCurrentMethodExercise"
          @editMethodExercise="editMethodExercise"></edit>
  </div>
</template>

<script>
import {request} from "../../util/request";
import list from './method-exercise/list'
import edit from './method-exercise/edit'

export default {
  name: "MethodExercise",
  components: {
    list,edit,
  },
  data() {
    return {
      operateType: 'create',
      methodExercises: [],
      currentEditMethodExercise: null,
    }
  },
  created() {
    this.flashMethodExercise().then()
  },
  methods: {
    openUpdateMethodExercise(method) {
      this.operateType = 'update'
      this.currentEditMethodExercise = method ? {...method} : null
    },
    openCreateMethodExercise() {
      this.operateType = 'create'
      this.currentEditMethodExercise = {
        "name": "",
        "introduce": "",
        "level": 1,
        "power": 0,
        "bone": 0,
        "physique": 0,
        "movement": 0,
        "wakan": 0,
        "comprehension": 0,
        "luck": 0,
      }
    },
    setCurrentMethodExercise(method) {
      this.currentEditMethodExercise = method
    },
    async flashMethodExercise() {
      const loading = this.$loading({
        lock: true,
        text: '加载功法列表中',
        spinner: 'el-icon-loading',
      });
      const result = await request.get('/api/admin/getAllMethodExercise')
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      this.methodExercises = result.data.data
    },
    async editMethodExercise() {
      if (!this.currentEditMethodExercise) return
      const loading = this.$loading({
        lock: true,
        text: '上传中，请稍后',
        spinner: 'el-icon-loading',
      });
      let result = null
      if (this.operateType === 'create') {
        result = await request.post(
            '/api/admin/createMethodExercise' , {method: this.currentEditMethodExercise}
        )
      } else if (this.operateType === 'update') {
        result = await request.post(
            '/api/admin/updateMethodExercise' , {method: this.currentEditMethodExercise}
        )
      }
      loading.close()
      if (!result || !result.data.status) this.$message.warning(result?.data?.message)
      else this.$message.success(result?.data?.message)
      this.currentEditMethodExercise = null
      await this.flashMethodExercise()
    },
  },
}
</script>

<style scoped lang="scss">

</style>