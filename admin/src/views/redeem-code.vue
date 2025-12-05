<template>
  <div class="redeem-code">
    <div class="btn-box">
      <el-button type="success" @click="openCreateRedeemCode()">添加兑换码</el-button>
    </div>
    <list :operateType="operateType" :redeemCodes="redeemCodes" @openUpdateRedeemCode="openUpdateRedeemCode"></list>
    <edit v-if="currentEditRedeemCode" :operateType="operateType"
          :redeemCode="currentEditRedeemCode" @setCurrentRedeemCode="setCurrentRedeemCode"
          @editRedeemCode="editRedeemCode"></edit>
  </div>
</template>

<script>
import list from "@/views/redeem-code/list";
import edit from "@/views/redeem-code/edit";
import {request} from "../../util/request";

export default {
  name: "redeem-code",
  components: {
    list,edit
  },
  data() {
    return {
      // 新建还是更新
      operateType: "create",
      // 当前操作的map
      currentEditRedeemCode: null,
      // 地图列表
      redeemCodes: [],
    }
  },
  created() {
    this.flashRedeemCode().then()
  },
  methods: {
    openCreateRedeemCode() {
      this.operateType = 'create'
      this.currentEditRedeemCode = {
        "code": "",
        "rewardsJson": "[]",
        "effectTime": void 0,
        "useTime": -1,
      }
    },
    openUpdateRedeemCode(redeemCode) {
      this.operateType = 'update'
      this.currentEditRedeemCode = redeemCode ? {...redeemCode} : null
    },
    setCurrentRedeemCode(redeemCode) {
      this.currentEditRedeemCode = redeemCode
    },
    async editRedeemCode() {
      if (!this.currentEditRedeemCode) return
      const loading = this.$loading({
        lock: true,
        text: '上传中，请稍后',
        spinner: 'el-icon-loading',
      });
      let result = null
      if (this.operateType === 'create') {
        result = await request.post('/api/admin/createRedeemCode' , {redeem: this.currentEditRedeemCode})
      } else if (this.operateType === 'update') {
        result = await request.post('/api/admin/updateRedeemCode' , {redeem: this.currentEditRedeemCode})
      }
      loading.close()
      if (!result || !result.data.status) this.$message.warning(result?.data?.message)
      else this.$message.success(result?.data?.message)
      this.currentEditRedeemCode = null
      await this.flashRedeemCode()
    },
    async flashRedeemCode() {
      const loading = this.$loading({
        lock: true,
        text: '加载地图列表中',
        spinner: 'el-icon-loading',
      });
      const result = await request.get('/api/admin/getAllRedeemCode')
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      this.redeemCodes = result.data.data
    },
  }
}
</script>

<style scoped lang="scss">

</style>