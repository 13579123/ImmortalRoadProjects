<template>
  <div class="edit-component">
    <el-form :model="item" class="form" label-width="100px" label-position="left">
      <h2 style="margin-bottom: 10px;text-align: center"> 创建或更新物品 </h2>
      <el-form-item label="物品图片">
        <el-upload action="" :show-file-list="false" :before-upload="changeFile" style="width: 70px;height: 70px">
          <img v-if="item.icon" :src="item.icon" class="avatar" style="height: 70px">
          <div v-else style="width: 70px;height: 70px;display: flex;justify-content: center;align-items: center;border: 1px solid #c1c1c1">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="物品名称" prop="name" :rules="[{ required: true, message: '请输入物品名称', trigger: 'blur' }]">
        <el-input v-model="item.name"></el-input>
      </el-form-item>
      <el-form-item label="物品编码" prop="code" :rules="[{ required: true, message: '请输入物品编码', trigger: 'blur' }]">
        <el-input v-model="item.code"></el-input>
      </el-form-item>
      <el-form-item label="玩家操作">
        <div style="display: flex;">
          <div> 是否可以使用 <el-switch :active-value="1" :inactive-value="0" v-model="item.canUse"></el-switch> </div>
          <div style="width: 5%"></div>
          <div> 是否可以出售 <el-switch :active-value="1" :inactive-value="0" v-model="item.canSell"></el-switch> </div>
        </div>
      </el-form-item>
      <el-form-item label="是否是装备">
        <el-switch @change="changeIsEquipment()" :active-value="1" :inactive-value="0" v-model="item.isEquipment"></el-switch>
      </el-form-item>
      <el-form-item label="装备类型" v-if="item.isEquipment === 1" prop="equipmentType"
                    :rules="[{ required: true, message: '请选择装备类型', trigger: 'blur' }]">
        <el-select v-model="item.equipmentType" placeholder="请选择装备类型">
          <el-option label="头盔" value="helmet"></el-option>
          <el-option label="武器" value="weapon"></el-option>
          <el-option label="衣服" value="clothes"></el-option>
          <el-option label="鞋子" value="shoes"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最大堆叠数" prop="maxCount"
                    :rules="[{ required: true, message: '请输入物品最大堆叠数量', trigger: 'blur' }]">
        <el-input-number v-model="item.maxCount" :min="1"
                         :max="99999" size="small" placeholder="最大堆叠数量"></el-input-number>
      </el-form-item>
      <el-form-item label="出售价格" prop="price"
                    :rules="[{ required: true, message: '请输入物品出售价格', trigger: 'blur' }]">
        <el-input-number v-model="item.price" :min="0"
                         :max="99999" size="small" placeholder="出售价格"></el-input-number>
      </el-form-item>
      <el-form-item label="物品额外属性">
        <el-input type="textarea" v-model="item.extraDataJson"></el-input>
      </el-form-item>
      <el-form-item label="物品简介">
        <el-input type="textarea" v-model="item.introduce"></el-input>
      </el-form-item>

      <el-button type="success" @click="onCompleteOperate"> 确认提交 </el-button>
      <el-button type="warning" @click="$emit('setCurrentItem' , null)"> 取消 </el-button>
    </el-form >
  </div>
</template>

<script>
import {uploadFileToCos} from "../../../util/uploadFileToCos";

export default {
  name: "edit",
  props: {
    item: { type: Object, },
  },
  methods: {
    // 点击保存或编辑按钮
    onCompleteOperate() {
      if (this.item.isEquipment === 1 && this.item.equipmentType === '')
        return this.$message.warning('武器类型不能是空')
      this.$emit("setCurrentItem" , this.item)
      this.$emit('editItem')
    },
    // 获取到文件
    async changeFile(file) {
      const path = await uploadFileToCos(Date.now() + file.name , file)
      this.item.icon = path
      return false
    },
    // 是否是装备改变时
    changeIsEquipment() {
      if (this.item.isEquipment === 0) this.item.equipmentType = ''
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