<template>
  <div class="list-component">
    <div class="item-header">
      <div class="id" style="flex: 2">编号</div>
      <div class="id" style="flex: 3">主材</div>
      <div class="id" style="flex: 3">辅材</div>
      <div class="id" style="flex: 2">产出药物</div>
      <div class="id" style="flex: 1">最少</div>
      <div class="id" style="flex: 1">最多</div>
      <div class="id" style="flex: 1">类型</div>
      <div class="id" style="flex: 3">操作</div>
    </div>
    <div class="list-box">
      <div class="item" v-for="folkPrescription in folkPrescriptions" :key="folkPrescription.code">
        <div class="id" style="flex: 2">{{folkPrescription.code}}</div>
        <div class="id" style="flex: 3;display: flex;align-items: center;justify-content: center;font-size: 18px">
          <img :src="getItemMap.get(folkPrescription['materialsMainItem'])?.icon" style="height: 35px">
          &nbsp;X&nbsp;
          {{folkPrescription['materialsMainItemNumber']}}
        </div>
        <div class="id" style="flex: 3;display: flex;align-items: center;justify-content: center;font-size: 18px">
          <img :src="getItemMap.get(folkPrescription['materialsOtherItem'])?.icon" style="height: 35px">
          &nbsp;X&nbsp;
          {{folkPrescription['materialsOtherItemNumber']}}
        </div>
        <div class="id" style="flex: 2">
          <img :src="getItemMap.get(folkPrescription['exportItemId'])?.icon" style="height: 100%">
        </div>
        <div class="id" style="flex: 1">{{folkPrescription['min']}}</div>
        <div class="id" style="flex: 1">{{folkPrescription['max']}}</div>
        <div class="id" style="flex: 1">{{getTypeName(folkPrescription['type'])}}</div>

        <div class="id" style="flex: 3">
          <span @click="updateFolkPrescription(folkPrescription)"
                style="color: #55b1ee;font-size: 12px;margin: 0 2px;user-select: none;cursor: pointer">编辑</span>
          <span @click="deleteFolkPrescription(folkPrescription)"
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
    folkPrescriptions: {
      type: Array
    }
  },
  data() {
    return {
      // 所有物品
      itemList: [],
    }
  },
  async created() {
    const loading = this.$loading({
      lock: true,
      text: '加载物品列表中',
      spinner: 'el-icon-loading',
    });
    const result = await request.get('/api/admin/getAllItem')
    loading.close()
    if (!result) return
    if (!result.data.status) return this.$message.warning(result.data.message)
    this.itemList = result.data.data
  },
  methods: {
    updateFolkPrescription(folkPrescription) {
      this.$emit("openUpdateFolkPrescription" , folkPrescription)
    },
    async deleteFolkPrescription(folkPrescription) {
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
          '/api/admin/deleteFolkPrescription' ,
          {data: {codeList: [folkPrescription.code]}}
      )
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      this.$message.success(result.data.message)
      await this.$parent.flashFolkPrescription()
    },
    getTypeName(type) {
      if (type === 0) return '丹方'
      if (type === 1) return '器方'
    }
  },
  computed: {
    getItemMap() {
      const map = new Map
      this.itemList.forEach(item => map.set(item.id , item))
      return map
    },
  }
}
</script>

<style scoped lang="scss">
.list-component {
  .item-header {
    border-bottom: 1px solid #68a7f5;
  }
  .item-header , .item{
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
    .item {
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