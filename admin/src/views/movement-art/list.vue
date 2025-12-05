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
      <div class="item" v-for="movementArt in movementArts" :key="movementArt.id">
        <div class="id" style="flex: 1">{{movementArt.id}}</div>
        <div class="name" style="flex: 1;display: flex;align-items: center;justify-content: center">
          <img v-if="movementArt.icon" :src="movementArt.icon" style="height: 95%;background-color: #909090">
          <img v-else :src="DefaultSkillPng" style="height: 95%;background-color: #909090">
        </div>
        <div class="name" style="flex: 2" :title="movementArt.name">{{movementArt.name}}</div>
        <div class="code" style="flex: 3" :title="movementArt.code">{{movementArt.code}}</div>
        <div class="introduce" style="flex: 6" :title="movementArt.introduce">
          {{movementArt.introduce}}
        </div>
        <div class="operate" style="flex: 2">
          <span @click="editMovementArt(movementArt)" style="color: #79b2fa;font-size: 12px;margin: 0 2px;user-select: none;cursor: pointer">编辑</span>
          <span @click="deleteMovementArt(movementArt)" style="color: #ff7b7b;font-size: 12px;margin: 0 2px;user-select: none;cursor: pointer">删除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultSkillPng from '@/assets/skill_1.png'
import {request} from "../../../util/request";

export default {
  name: "list",
  props: {
    movementArts: { type: Array },
  },
  data() {
    return {
      DefaultSkillPng,
    }
  },
  methods: {
    editMovementArt(movementArt) {
      this.$emit("openUpdateMovementArt" , movementArt)
    },
    async deleteMovementArt(movementArt) {
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
      const result = await request.delete('/api/admin/deleteMovementArtById' , {
        data: {idList: [movementArt.id]}
      })
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      await this.$parent.flashMovementArts()
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