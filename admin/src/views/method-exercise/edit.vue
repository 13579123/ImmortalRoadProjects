<template>
  <div class="edit-component">
    <el-form :model="methodExercise" class="form" label-width="100px" label-position="left">
      <h2 style="margin-bottom: 10px;text-align: center"> 创建或更新功法 </h2>

      <el-form-item label="功法名称" prop="name" :rules="[{ required: true, message: '请输入功法名称', trigger: 'blur' }]">
        <el-input v-model="methodExercise.name"></el-input>
      </el-form-item>

      <el-form-item label="功法阶级" prop="level" :rules="[{ required: true, message: '请输入功法阶级', trigger: 'blur' }]">
        <el-input-number v-model="methodExercise.level" :min="1" :max="9"></el-input-number>
      </el-form-item>

      <el-form-item label="真气提升" prop="power" :rules="[{ required: true, message: '请输入功法真气提升', trigger: 'blur' }]">
        <el-input-number v-model="methodExercise.power"></el-input-number>
      </el-form-item>
      <el-form-item label="根骨提升" prop="bone" :rules="[{ required: true, message: '请输入功法根骨提升', trigger: 'blur' }]">
        <el-input-number v-model="methodExercise.bone"></el-input-number>
      </el-form-item>
      <el-form-item label="体魄提升" prop="physique" :rules="[{ required: true, message: '请输入功法体魄提升', trigger: 'blur' }]">
        <el-input-number v-model="methodExercise.physique"></el-input-number>
      </el-form-item>
      <el-form-item label="身法提升" prop="movement" :rules="[{ required: true, message: '请输入功法身法提升', trigger: 'blur' }]">
        <el-input-number v-model="methodExercise.movement"></el-input-number>
      </el-form-item>
      <el-form-item label="悟性提升" prop="comprehension" :rules="[{ required: true, message: '请输入功法悟性提升', trigger: 'blur' }]">
        <el-input-number v-model="methodExercise.comprehension"></el-input-number>
      </el-form-item>
      <el-form-item label="灵力提升" prop="wakan" :rules="[{ required: true, message: '请输入功法灵力提升', trigger: 'blur' }]">
        <el-input-number v-model="methodExercise.wakan"></el-input-number>
      </el-form-item>

      <el-form-item label="功法简介">
        <el-input type="textarea" v-model="methodExercise.introduce"></el-input>
      </el-form-item>


      <el-button type="success" @click="onCompleteOperate"> 确认提交 </el-button>
      <el-button type="warning" @click="$emit('setCurrentMethodExercise' , null)"> 取消 </el-button>
    </el-form >
  </div>
</template>

<script>

export default {
  name: "edit",
  props: {
    methodExercise: { type: Object, },
  },
  methods: {
    onCompleteOperate() {
      this.$emit("setCurrentMethodExercise" , this.methodExercise)
      this.$emit("editMethodExercise")
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