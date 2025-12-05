<template>
  <div class="edit-component">
    <el-form :model="redeemCode" class="form" label-width="100px" label-position="left">
      <h2 style="margin-bottom: 10px;text-align: center"> 创建或更新地图 </h2>
      <el-form-item label="兑换码" prop="code" :rules="[{ required: true, message: '请输入兑换码', trigger: 'input' }]">
        <el-input v-model="redeemCode.code" :disabled="operateType !== 'create'"></el-input>
        <span v-if="operateType === 'create'" style="color: #79b2fa;cursor: pointer;user-select: none" @click="getRandomCode()">
          获取随机code
          <i class="el-icon-refresh"></i>
        </span>
      </el-form-item>

      <el-form-item label="使用次数" prop="useTime" :rules="[{ required: true, message: '请输入使用次数', trigger: 'blur' }]">
        <el-input v-model="redeemCode.useTime" placeholder="-1无限次使用"></el-input>
      </el-form-item>

      <el-form-item label="有效期至">
        <el-date-picker v-model="effectTime" align="right" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>

      <div style="width: 100%;max-height: 250px;overflow: auto;margin: 10px 0">
        <div v-for="(reward,index) in redeemCode.rewardsJson" :key="reward['itemId']">
          <el-form-item label="奖励物品">
            <el-select v-model="reward['itemId']" placeholder="请选择奖励">
              <div v-for="item in itemList" v-if="!getDropMap.get(item.id) || reward['itemId'] === item.id" :key="item.id">
                <el-option :label="item.name" :value="item.id"></el-option>
              </div>
            </el-select>
            <img v-if="getItemMap.get(reward.itemId)" :src="getItemMap.get(reward.itemId).icon"
                 style="height: 40px;position: absolute;right: 5%;bottom: 0">
          </el-form-item>
          <el-form-item label="">
            数量&nbsp;
            <el-input-number v-model="reward['count']" :min="1"
                             :max="9999" size="small" placeholder="数量"></el-input-number>
            <el-button type="danger" size="small" @click="deleteReward(index)" style="margin-left: 10%"> 删除掉落物品 </el-button>
          </el-form-item>
        </div>
      </div>

      <el-button type="success" @click="onCompleteOperate"> 确认提交 </el-button>
      <el-button type="warning" @click="$emit('setCurrentRedeemCode' , null)"> 取消 </el-button>
      <el-button type="" @click="addRewardItem"> 增加奖励 </el-button>
    </el-form >
  </div>
</template>

<script>

import {request} from "../../../util/request";

export default {
  name: "edit",
  props: {
    operateType: { type: String },
    redeemCode: { type: Object, },
  },
  data() {
    return {
      // 所有物品
      itemList: [],
      effectTime: ''
    }
  },
  async created() {
    if (typeof this.redeemCode.rewardsJson === 'string')
      this.redeemCode.rewardsJson = JSON.parse(this.redeemCode.rewardsJson)
    this.effectTime = new Date(this.redeemCode.effectTime)
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
      this.redeemCode.effectTime = new Date(this.effectTime)
      this.$emit("setCurrentRedeemCode" , this.redeemCode)
      this.$emit('editRedeemCode')
    },
    deleteReward(index) {
      this.redeemCode.rewardsJson.splice(index , 1)
    },
    addRewardItem() {
      this.redeemCode.rewardsJson.push({
        count: 0,
        itemId: void 0,
      })
    },
    getRandomCode() {
      let code = ''
      for (let i = 0; i < 9; i++) {
        code += String.fromCharCode(Math.ceil(Math.random() * 9 + 48))
      }
      this.redeemCode.code = code
    }
  },
  computed: {
    getItemMap() {
      const map = new Map
      this.itemList.forEach(item => map.set(item.id , item))
      return map
    },
    getDropMap() {
      const map = new Map
      this.redeemCode.rewardsJson.forEach(reward => map.set(reward.itemId , reward))
      return map
    },
  }
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