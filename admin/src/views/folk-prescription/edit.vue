<template>
  <div class="edit-component">
    <el-form :model="folkPrescription" class="form" label-width="100px" label-position="left">
      <h2 style="margin-bottom: 10px;text-align: center"> 创建或更新制方 </h2>

      <el-form-item label="编号code" prop="code" :rules="[{ required: true, message: '请输入药方code', trigger: 'blur' }]">
        <el-input v-model="folkPrescription.code"></el-input>
      </el-form-item>

      <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '请选类型', trigger: 'blur' }]">
        <el-select v-model="folkPrescription['type']" placeholder="请选类型">
          <el-option label="丹方" :value="0"></el-option>
          <el-option label="器方" :value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="主材料" prop="materialsMainItem" :rules="[{ required: true, message: '请选主材料', trigger: 'blur' }]">
        <el-select v-model="folkPrescription['materialsMainItem']" placeholder="请选主材料">
          <div v-for="item in itemList"
               v-if="folkPrescription['materialsMainItem'] !== item.id" :key="item.id">
            <el-option :label="item.name" :value="item.id"></el-option>
          </div>
        </el-select>
        <img v-if="getItemMap.get(folkPrescription['materialsMainItem'])" :src="getItemMap.get(folkPrescription['materialsMainItem']).icon"
             style="height: 40px;position: absolute;right: 5%;bottom: 0">
      </el-form-item>

      <el-form-item label="主材料数量" prop="materialsMainItemNumber" :rules="[{ required: true, message: '请输入主材料数量', trigger: 'blur' }]">
        <el-input-number v-model="folkPrescription['materialsMainItemNumber']" :min="0"
                         :max="19" size="small" placeholder="主材料数量"></el-input-number>
      </el-form-item>

      <el-form-item label="辅助材料" prop="materialsMainItem" :rules="[{ required: true, message: '请选辅助材料', trigger: 'blur' }]">
        <el-select v-model="folkPrescription['materialsOtherItem']" placeholder="请选辅助材料">
          <div v-for="item in itemList"
               v-if="folkPrescription['materialsOtherItem'] !== item.id" :key="item.id">
            <el-option :label="item.name" :value="item.id"></el-option>
          </div>
        </el-select>
        <img v-if="getItemMap.get(folkPrescription['materialsOtherItem'])" :src="getItemMap.get(folkPrescription['materialsOtherItem']).icon"
             style="height: 40px;position: absolute;right: 5%;bottom: 0">
      </el-form-item>

      <el-form-item label="主材料数量" prop="materialsOtherItemNumber" :rules="[{ required: true, message: '请输入辅助材料数量', trigger: 'blur' }]">
        <el-input-number v-model="folkPrescription['materialsOtherItemNumber']" :min="0"
                         :max="19" size="small" placeholder="辅助材料数量"></el-input-number>
      </el-form-item>

      <el-form-item label="返回丹药" prop="exportItemId" :rules="[{ required: true, message: '请输入返回丹药', trigger: 'blur' }]">
        <el-select v-model="folkPrescription['exportItemId']" placeholder="请选返回丹药">
          <div v-for="item in itemList"
               v-if="folkPrescription['exportItemId'] !== item.id" :key="item.id">
            <el-option :label="item.name" :value="item.id"></el-option>
          </div>
        </el-select>
        <img v-if="getItemMap.get(folkPrescription['exportItemId'])" :src="getItemMap.get(folkPrescription['exportItemId']).icon"
             style="height: 40px;position: absolute;right: 5%;bottom: 0">
      </el-form-item>

      <el-form-item label="返回数量">
        <div style="display: flex;">
          <div>
            最少
            <el-input-number v-model="folkPrescription['min']" :min="0"
                             :max="19" size="small" placeholder="最少炼制"></el-input-number>
          </div>
          <div style="width: 5%"></div>
          <div>
            最多
            <el-input-number v-model="folkPrescription['max']" :min="0"
                             :max="19" size="small" placeholder="最多炼制"></el-input-number>
          </div>
        </div>
      </el-form-item>

      <el-button type="success" @click="onCompleteOperate"> 确认提交 </el-button>
      <el-button type="warning" @click="$emit('setCurrentFolkPrescription' , null)"> 取消 </el-button>
    </el-form >
  </div>
</template>

<script>
import {uploadFileToCos} from "../../../util/uploadFileToCos";
import {request} from "../../../util/request";

export default {
  name: "edit",
  props: {
    folkPrescription: { type: Object, },
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
    // 点击保存或编辑按钮
    onCompleteOperate() {
      this.$emit("setCurrentFolkPrescription" , this.folkPrescription)
      this.$emit('editFolkPrescription')
    },
  },
  computed: {
    getItemMap() {
      const map = new Map
      this.itemList.forEach(item => map.set(item.id , item))
      return map
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