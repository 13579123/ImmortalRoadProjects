<template>
  <div class="list-component">
    <div class="item-header">
      <div class="id" style="flex: 1">编号</div>
      <div class="name" style="flex: 1">图标</div>
      <div class="name" style="flex: 2">名称</div>
      <div class="code" style="flex: 3">编码</div>
      <div class="introduce" style="flex: 6">简介</div>
      <div class="operate" style="flex: 2">操作</div>
    </div>
    <div class="list-box">
      <div class="item" v-for="item in items" :key="item.id">
        <div class="id" style="flex: 1">{{item.id}}</div>
        <div class="name" style="flex: 1;display: flex;align-items: center;justify-content: center">
          <img :src="item.icon" style="height: 95%;background-color: #909090">
        </div>
        <div class="name" style="flex: 2" :title="item.name">{{item.name}}</div>
        <div class="code" style="flex: 3" :title="item.code">{{item.code}}</div>
        <div class="introduce" style="flex: 6" :title="item.introduce">
          {{item.introduce}}
        </div>
        <div class="operate" style="flex: 2">
          <span @click="editItem(item)" style="color: #79b2fa;font-size: 12px;margin: 0 2px;user-select: none;cursor: pointer">编辑</span>
          <span @click="deleteItem(item)" style="color: #ff7b7b;font-size: 12px;margin: 0 2px;user-select: none;cursor: pointer">删除</span>
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
    items: {
      type: Array
    }
  },
  methods: {
    async editItem(item) {
      this.$emit('openUpdateItem' , item)
    },
    async deleteItem(item) {
      const action = await this.$alert('物品删除不可逆，确定要进行该操作吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(_ => _)
      if (action !== 'confirm') return
      const loading = this.$loading({
        lock: true,
        text: '加载物品列表中',
        spinner: 'el-icon-loading',
      });
      const result = await request.delete(
          '/api/admin/deleteItemById' ,
          {data: {idList: [item.id]}}
      )
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      this.$message.success(result.data.message)
      await this.$parent.flashItems()
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