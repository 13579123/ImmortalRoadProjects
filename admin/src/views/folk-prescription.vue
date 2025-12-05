<template>
  <div class="folk-prescription-page">
    <div class="btn-box">
      <el-button type="success" @click="openCreateFolkPrescription()">添加药方</el-button>
    </div>
    <edit v-if="currentEditPrescription"
          :folkPrescription="currentEditPrescription"
          @editFolkPrescription="editFolkPrescription"
          @setCurrentFolkPrescription="setCurrentFolkPrescription"></edit>
    <list :folkPrescriptions="folkPrescriptions"
          @setCurrentFolkPrescription="setCurrentFolkPrescription"
          @openUpdateFolkPrescription="openUpdateFolkPrescription"></list>
  </div>
</template>

<script>
import {request} from "../../util/request";
import list from "@/views/folk-prescription/list";
import edit from "@/views/folk-prescription/edit";

export default {
  name: "folk-prescription",
  components: {
    list,edit,
  },
  data() {
    return {
      operateType: 'create',
      folkPrescriptions: [],
      currentEditPrescription: null,
    }
  },
  created() {
    this.flashFolkPrescription().then()
  },
  methods: {
    setCurrentFolkPrescription(folkPrescription) {
      this.currentEditPrescription = folkPrescription
    },
    openCreateFolkPrescription() {
      this.operateType = 'create'
      this.currentEditPrescription = {
        "code": "",
        "materialsMainItem": void 0,
        "materialsMainItemNumber": 0,
        "materialsOtherItem": void 0,
        "materialsOtherItemNumber": 0,
        "exportItemId": void 0,
        "min": 0,
        "max": 0,
        "type": 0,
      }
    },
    openUpdateFolkPrescription(folkPrescription) {
      this.operateType = 'update'
      this.currentEditPrescription = folkPrescription ? {...folkPrescription} : null
    },
    async editFolkPrescription() {
      const loading = this.$loading({
        lock: true,
        text: '上传中，请稍后',
        spinner: 'el-icon-loading',
      });
      let result = null
      if (this.operateType === 'create') {
        result = await request.post('/api/admin/createFolkPrescription' , {folkPrescription: this.currentEditPrescription})
      } else if (this.operateType === 'update') {
        result = await request.post('/api/admin/updateFolkPrescription' , {folkPrescription: this.currentEditPrescription})
      }
      loading.close()
      if (!result || !result.data.status) this.$message.warning(result?.data?.message)
      else this.$message.success(result?.data?.message)
      this.currentEditPrescription = null
      await this.flashFolkPrescription()
    },
    async flashFolkPrescription() {
      const loading = this.$loading({
        lock: true,
        text: '加载物品列表中',
        spinner: 'el-icon-loading',
      });
      const result = await request.get('/api/admin/getAllFolkPrescription')
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      this.folkPrescriptions = result.data.data
    },
  }
}
</script>

<style scoped lang="scss">

</style>