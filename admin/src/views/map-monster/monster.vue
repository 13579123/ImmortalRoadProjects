<template>
  <div class="monster" @click="selectCondition = [-1 , -1]">
    <div class="map">
      <div class="row" v-for="row in 20">
        <div class="col" v-for="col in 20">
          <div class="grid" @click.stop.prevent="openSelect(col - 1 , row - 1)">
            <div class="select" v-show="selectCondition[0] === col - 1 && selectCondition[1] === row - 1"
                 @click.stop.prevent="openSelect(-1 , -1)">
              <div class="select-item" @click="operateGrid(col - 1 , row - 1)"> 信息设置 </div>
              <div class="select-item" @click="pastMonster(col - 1 , row - 1)"> 粘贴怪物 </div>
              <div class="select-item" @click="copyMonsterToBoard(getMonsterByCondition(col - 1 , row - 1))"> 复制怪物 </div>
              <div class="select-item" style="color: red"
                   @click="deleteMonster(getMonsterByCondition(col - 1 , row - 1))"> 删除怪物 </div>
            </div>
            <div style="width: 100%;height: 100%" v-if="getMonsterByCondition(col - 1 , row - 1)">
              <img class="boss-show" :src="BossPng"
                   v-if="getMonsterByCondition(col - 1 , row - 1).isBoss === 1">
              <img style="height: 100%;" :src="getMonsterByCondition(col - 1 , row - 1)['avatarImage']">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {request} from "../../../util/request";
import BossPng from '@/assets/boss.png'

export default {
  name: "monster",
  props: {
    map: {type: Object},
    monsters: {type: Array},
  },
  data() {
    return {
      BossPng,
      copyMonster: null,
      selectCondition: [-1 , -1],
    }
  },
  methods: {
    openSelect(x , y) {
      this.selectCondition = [x , y]
    },
    getMonsterByCondition(x , y) {
      for (let i = 0; i < this.monsters.length; i++) {
        const monster = this.monsters[i]
        if (monster['conditionX'] === x && monster['conditionY'] === y)
          return monster
      }
      return null
    },
    operateGrid(x , y) {
      const monster = this.getMonsterByCondition(x , y)
      if (!monster) return this.$emit("openCreateMonster" , x , y)
      else return this.$emit("openUpdateMonster" , monster)
    },
    copyMonsterToBoard(monster) {
      if (!monster) return this.$message.warning("该坐标没有怪物")
      this.copyMonster = monster
      this.$message.success("复制成功")
    },
    async pastMonster(x , y) {
      if (!this.copyMonster) return this.$message.warning("复制板中没有怪物信息哦")
      const ordinaryMonster = this.getMonsterByCondition(x , y)
      if (ordinaryMonster) return this.$message.warning("该位置已经有怪物了")
      const monster = {
        ...this.copyMonster ,
        dropJson: typeof this.copyMonster.dropJson === 'string' ? this.copyMonster.dropJson : JSON.stringify(this.copyMonster.dropJson)
      }
      monster.conditionX = x
      monster.conditionY = y
      await this.$emit("uploadMonster" , 'create' , monster)
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
      const result = await request.delete(
          '/api/admin/deleteMonsterById' ,
          {data: {idList: [monster.id]}}
      )
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      this.$message.success(result.data.message)
      this.$emit("setCurrentMonster" , null)
      await this.$parent.flashMonster()
    },
  }
}
</script>

<style scoped lang="scss">
.boss-show {
  position: absolute;
  width: 100%;
  height: 100%;
  color: red;
  font-weight: 900;
  opacity: 0.8;
}
.map {
  .row {
    .col {
      .grid {
        img {
          width: 100%;
        }
        .select {
          .select-item {
            width: 100%;
            font-size: 13px;
            cursor: pointer;
            font-weight: 700;
            padding: 5px 20px;
            white-space: nowrap;
            box-sizing: border-box;

            transition: background-color 0.3s , color 0.3s;
          }
          .select-item:hover {
            color: white;
            background-color: rgba(100,100,100,0.5);
          }
          top: 10px;
          left: 10px;
          width: auto;
          z-index: 2;
          cursor: default;
          padding: 10px 0;
          position: absolute;
          background-color: white;
          box-shadow: 0 0 2px 1px rgba(0,0,0,0.3);
        }
        width: 100%;
        height: 100%;
        position: relative;
        transition: background-color 0.3s;
      }
      .grid:hover {
        background-color: #79b2fa;
      }
      width: 5%;
      height: 100%;
      box-sizing: border-box;
      border: 1px solid #79b2fa;
    }
    height: 5%;
    width: 100%;
    display: flex;
  }
  width: 800px;
  height: 800px;
  margin: 10px auto;
  border: 1px solid #79b2fa;
}
</style>