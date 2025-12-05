<template>
  <div class="edit-component">
    <el-form :model="map" class="form" label-width="100px" label-position="left">
      <h2 style="margin-bottom: 10px;text-align: center"> 创建或更新地图 </h2>
      <el-form-item label="地图背景">
        <el-upload action="" :show-file-list="false" :before-upload="changeFile" style="width: 70px;height: 70px">
          <img v-if="map.mapImage" :src="map.mapImage" class="avatar" style="height: 70px">
          <div v-else style="width: 70px;height: 70px;display: flex;justify-content: center;align-items: center;border: 1px solid #c1c1c1">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="地图名称" prop="name" :rules="[{ required: true, message: '请输入物品名称', trigger: 'blur' }]">
        <el-input v-model="map.name"></el-input>
      </el-form-item>
      <el-form-item label="关卡序号" prop="mapLevel" v-if="map.mapWorld !== 0"
                    :rules="[{ required: true, message: '请输入关卡序号', trigger: 'blur' }]">
        <el-input-number v-model="map.mapLevel" :min="0"
                         :max="14" size="small" placeholder="关卡序号"></el-input-number>
      </el-form-item>
      <el-form-item label="地图世界" prop="mapWorld"
                    :rules="[{ required: true, message: '请选择地图所在世界', trigger: 'blur' }]">
        <el-select v-model="map.mapWorld" placeholder="请选择装备类型">
          <el-option label="特殊" :value="0"></el-option>
          <el-option label="人界" :value="1"></el-option>
          <el-option label="仙界" :value="2"></el-option>
          <el-option label="虚空" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地图起始坐标">
        <div style="display: flex;">
          <div>
            x
            <el-input-number v-model="map.startX" :min="0"
                             :max="20" size="small" placeholder="关卡横坐标"></el-input-number>
          </div>
          <div style="width: 5%"></div>
          <div>
            y
            <el-input-number v-model="map.startY" :min="0"
                             :max="20" size="small" placeholder="关卡纵坐标"></el-input-number>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="地图简介">
        <el-input type="textarea" v-model="map.introduce"></el-input>
      </el-form-item>
      <el-button type="success" @click="onCompleteOperate"> 确认提交 </el-button>
      <el-button type="warning" @click="$emit('setCurrentMap' , null)"> 取消 </el-button>
    </el-form >
  </div>
</template>

<script>
import {uploadFileToCos} from "../../../util/uploadFileToCos";

export default {
  name: "edit",
  props: {
    map: { type: Object, },
  },
  methods: {
    async changeFile(file) {
      const path = await uploadFileToCos(Date.now() + file.name , file)
      this.map.mapImage = path
      return false
    },
    // 点击保存或编辑按钮
    onCompleteOperate() {
      this.map.mapLevel = this.map.mapLevel
      this.$emit("setCurrentMap" , this.map)
      this.$emit('editMap')
    },
  },
}
</script>

<style scoped lang="scss">
.edit-component {
  .form {
    width: 90%;
    padding: 20px 15px;
    max-width: 500px;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: white;
    box-shadow: 0 0 2px 1px rgba(0,0,0,0.3);
  }
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  background-color: rgba(255,255,255,0.7);
}
</style>