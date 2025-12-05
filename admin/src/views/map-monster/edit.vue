<template>
  <div class="edit-component">
    <el-form :model="monster" class="form" label-width="100px" label-position="left">
      <h2 style="margin-bottom: 10px;text-align: center"> 创建或更新怪物 </h2>
      <el-form-item label="怪物头像">
        <el-upload action="" :show-file-list="false" :before-upload="changeFile" style="width: 70px;height: 70px">
          <img v-if="monster.avatarImage" :src="monster.avatarImage" class="avatar" style="height: 70px">
          <div v-else style="width: 70px;height: 70px;display: flex;justify-content: center;align-items: center;border: 1px solid #c1c1c1">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="怪物名称" prop="name" :rules="[{ required: true, message: '请输入物品名称', trigger: 'blur' }]">
        <el-input v-model="monster.name"></el-input>
      </el-form-item>
      <el-form-item label="怪物坐标">
        <div style="display: flex;">
          <div>
            x
            <el-input-number v-model="monster.conditionX" :min="0"
                             :max="19" size="small" placeholder="怪物坐标横坐标"></el-input-number>
          </div>
          <div style="width: 5%"></div>
          <div>
            y
            <el-input-number v-model="monster.conditionY" :min="0"
                             :max="19" size="small" placeholder="怪物坐标纵坐标"></el-input-number>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="怪物攻防">
        <div style="display: flex;">
          <div>
            真气
            <el-input-number v-model="monster.power" :min="0"
                             :max="99999999999" size="small" placeholder="怪物攻防"></el-input-number>
          </div>
          <div style="width: 5%"></div>
          <div>
            根骨
            <el-input-number v-model="monster.bone" :min="0"
                             :max="99999999999" size="small" placeholder="怪物攻防"></el-input-number>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="">
        <div style="display: flex;">
          <div>
            体魄
            <el-input-number v-model="monster.physique" :min="0"
                             :max="99999999999" size="small" placeholder="怪物攻防"></el-input-number>
          </div>
          <div style="width: 5%"></div>
          <div>
            身法
            <el-input-number v-model="monster.movement" :min="0"
                             :max="99999999999" size="small" placeholder="怪物攻防"></el-input-number>
          </div>
        </div>
      </el-form-item>


      <el-form-item label="怪物简介">
        <el-input type="textarea" v-model="monster.introduce"></el-input>
      </el-form-item>

      <el-form-item label="是否是Boss">
        <el-switch :active-value="1" :inactive-value="0" v-model="monster.isBoss"></el-switch>
      </el-form-item>

      <div style="width: 100%;max-height: 250px;overflow: auto;margin: 10px 0">
        <div v-for="(drop,index) in monster.dropJson" :key="drop['itemId']">
          <el-form-item label="掉落物品">
            <el-select v-model="drop['itemId']" placeholder="请选择掉落物">
              <div v-for="item in itemList" v-if="!getDropMap.get(item.id) || drop['itemId'] === item.id" :key="item.id">
                <el-option :label="item.name" :value="item.id"></el-option>
              </div>
            </el-select>
            <img v-if="getItemMap.get(drop.itemId)" :src="getItemMap.get(drop.itemId).icon"
                 style="height: 40px;position: absolute;right: 5%;bottom: 0">
          </el-form-item>
          <el-form-item label="">
            概率&nbsp;
            <el-input-number v-model="drop['rate']" :min="0" :control="false"
                             :max="1" size="small" placeholder="概率"></el-input-number>
            <el-button type="danger" size="small" @click="deleteDrop(index)" style="margin-left: 10%"> 删除掉落物品 </el-button>
          </el-form-item>
          <el-form-item label="">
            数量&nbsp;
            <el-input-number v-model="drop['minNumber']" :min="1"
                             :max="9999" size="small" placeholder="最小数量"></el-input-number>
            ~
            <el-input-number v-model="drop['maxNumber']" :min="1"
                             :max="9999" size="small" placeholder="最大数量"></el-input-number>
          </el-form-item>
        </div>
      </div>

      <el-button type="success" @click="onCompleteOperate"> 确认提交 </el-button>
      <el-button v-if="monster.id !== void 0" type="danger" @click="deleteMonster(monster)"> 删除怪物 </el-button>
      <el-button type="warning" @click="$emit('setCurrentMonster' , null)"> 取消 </el-button>
      <el-button type="" @click="addDropItem"> 增加掉落物 </el-button>
    </el-form >
  </div>
</template>

<script>
import {uploadFileToCos} from "../../../util/uploadFileToCos";
import {request} from "../../../util/request";

export default {
  name: "edit",
  props: {
    monster: {type: Object},
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
    async changeFile(file) {
      const path = await uploadFileToCos(Date.now() + file.name , file)
      this.monster.avatarImage = path
      return false
    },
    addDropItem() {
      this.monster.dropJson.push({
        rate: 0 ,
        maxNumber: 1 ,
        minNumber: 1 ,
        itemId: void 0
      })
    },
    deleteDrop(index) {
      this.monster.dropJson.splice(index , 1)
    },
    onCompleteOperate() {
      this.$emit("setCurrentMonster" , this.monster)
      this.$emit('editMonster')
    },
    async deleteMonster(monster) {
      const action = await this.$alert('怪物删除不可逆，确定要进行该操作吗？', '警告', {
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
      const result = await request.post(
          '/api/admin/deleteMonsterById' ,
          {idList: [monster.id]}
      )
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      this.$message.success(result.data.message)
      this.$emit("setCurrentMonster" , null)
      await this.$parent.flashMonster()
    },
  },
  computed: {
    getItemMap() {
      const map = new Map
      this.itemList.forEach(item => map.set(item.id , item))
      return map
    },
    getDropMap() {
      const map = new Map
      this.monster.dropJson.forEach(drop => map.set(drop.itemId , drop))
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