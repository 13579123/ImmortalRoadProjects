<template>
  <div class="list-component">
    <div class="map-header">
      <div class="code" style="flex: 1">兑换码</div>
      <div class="code" style="flex: 1">使用次数</div>
      <div class="introduce" style="flex: 2">有效期至</div>
      <div class="operate" style="flex: 2">操作</div>
    </div>
    <div class="list-box">
      <div class="map" v-for="redeemCode in redeemCodes" :key="redeemCode.code">
        <div class="code" style="flex: 1">{{redeemCode.code}}</div>
        <div class="code" style="flex: 1">{{redeemCode.useTime === -1 ? '永久' : redeemCode.useTime}}</div>
        <div class="introduce" style="flex: 2">{{getEffectTime(redeemCode)}}</div>
        <div class="operate" style="flex: 2">
          <span @click="updateRedeemCode(redeemCode)"
                style="color: #55b1ee;font-size: 12px;margin: 0 2px;user-select: none;cursor: pointer">编辑</span>
          <span @click="deleteRedeemCode(redeemCode)"
                style="color: #ff7b7b;font-size: 12px;margin: 0 2px;user-select: none;cursor: pointer">删除</span>
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
    redeemCodes: { type: Array },
  },
  methods: {
    getEffectTime(redeemCode) {
      if (redeemCode['effectTime'] === -1) return '永久'
      const date = new Date(redeemCode['effectTime'])
      return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' + ' 00时00分00秒'
    },
    async updateRedeemCode(redeemCode) {
      this.$emit('openUpdateRedeemCode' , {
        ...redeemCode,
        rewardsJson: JSON.parse(redeemCode.rewardsJson)
      })
    },
    async deleteRedeemCode(redeemCode) {
      const action = await this.$alert('删除不可逆，确定要进行该操作吗？', '警告', {
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
          '/api/admin/deleteRedeemCode' ,
          {data: {codeList: [redeemCode.code]}}
      )
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      this.$message.success(result.data.message)
      await this.$parent.flashRedeemCode()
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