<template>
  <div class="edit-component">
    <el-form :model="movementArt" class="form" label-width="100px" label-position="left">
      <h2 style="margin-bottom: 10px;text-align: center"> 创建或更新招式 </h2>
      <el-form-item label="招式图片">
        <el-upload action="" :show-file-list="false" :before-upload="changeFile" style="width: 70px;height: 70px">
          <img v-if="movementArt.icon" :src="movementArt.icon" class="avatar" style="height: 70px">
          <div v-else style="width: 70px;height: 70px;display: flex;justify-content: center;align-items: center;border: 1px solid #c1c1c1">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="招式品阶">
        <el-input-number v-model="movementArt.level" :min="1" :max="9"></el-input-number>
      </el-form-item>
      <el-form-item label="招式名称" prop="name" :rules="[{ required: true, message: '请输入招式名称', trigger: 'blur' }]">
        <el-input v-model="movementArt.name"></el-input>
      </el-form-item>
      <el-form-item label="招式编码" prop="code" :rules="[{ required: true, message: '请输入招式编码', trigger: 'blur' }]">
        <el-input v-model="movementArt.code"></el-input>
      </el-form-item>
      <el-form-item label="招式简介">
        <el-input type="textarea" v-model="movementArt.introduce"></el-input>
      </el-form-item>

      <el-button type="success" @click="onCompleteOperate"> 确认提交 </el-button>
      <el-button type="warning" @click="$emit('setCurrentMovementArt' , null)"> 取消 </el-button>
    </el-form >
  </div>
</template>

<script>
import {uploadFileToCos} from "../../../util/uploadFileToCos";

export default {
  name: "edit",
  props: {
    movementArt: { type: Object, },
  },
  methods: {
    // 点击保存或编辑按钮
    onCompleteOperate() {
      this.$emit("setCurrentMovementArt" , this.movementArt)
      this.$emit('editMovementArt')
    },
    // 获取到文件
    async changeFile(file) {
      const path = await uploadFileToCos(Date.now() + file.name , file)
      this.movementArt.icon = path
      return false
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