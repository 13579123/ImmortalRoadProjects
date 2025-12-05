<template>
  <div class="list-component">
    <div class="map-header">
      <div class="id" style="flex: 1">编号</div>
      <div class="name" style="flex: 1">名称</div>
      <div class="ping" style="flex: 1">品阶</div>
      <div class="ping" style="flex: 1">真气</div>
      <div class="ping" style="flex: 1">根骨</div>
      <div class="ping" style="flex: 1">体魄</div>
      <div class="ping" style="flex: 1">身法</div>
      <div class="ping" style="flex: 1">悟性</div>
      <div class="ping" style="flex: 1">灵力</div>
      <div class="ping" style="flex: 3">简介</div>
      <div class="operate" style="flex: 2">操作</div>
    </div>
    <div class="list-box">
      <div class="map" v-for="method in methodExercise" :key="method.id">
        <div class="id" style="flex: 1">{{method.id}}</div>
        <div class="name" style="flex: 1">{{method.name}}</div>
        <div class="ping" style="flex: 1">{{method.level}}阶</div>
        <div class="ping" style="flex: 1">{{method.power}}</div>
        <div class="ping" style="flex: 1">{{method.bone}}</div>
        <div class="ping" style="flex: 1">{{method.physique}}</div>
        <div class="ping" style="flex: 1">{{method.movement}}</div>
        <div class="ping" style="flex: 1">{{method.comprehension}}</div>
        <div class="ping" style="flex: 1">{{method.wakan}}</div>
        <div class="ping" style="flex: 3">{{method.introduce}}</div>
        <div class="operate" style="flex: 2">
          <span @click="$emit('openUpdateMethodExercise' , method)" style="color: #79b2fa;font-size: 12px;margin: 0 2px;user-select: none;cursor: pointer">编辑</span>
          <span @click="deleteMethodExercise(method)" style="color: #ff7b7b;font-size: 12px;margin: 0 2px;user-select: none;cursor: pointer">删除</span>
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
    methodExercise: { type: Array },
  },
  methods: {
    async deleteMethodExercise(method) {
      const action = await this.$alert('地图删除不可逆，确定要进行该操作吗？', '警告', {
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
      const result = await request.delete('/api/admin/deleteMethodExercise' , {
        data: {idList: [method.id]}
      })
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      this.$message.success(result.data.message)
      await this.$parent.flashMethodExercise()
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