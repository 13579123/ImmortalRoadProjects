<template>
  <div class="item-page">
    <div class="btn-box">
      <el-button type="success" @click="openCreateItem()">添加物品</el-button>
    </div>
    <list :items="items" @openUpdateItem="openUpdateItem"></list>
    <edit v-if="currentEditItem" :item="currentEditItem" @setCurrentItem="setCurrentItem" @editItem="editItem"></edit>
  </div>
</template>

<script>
import {request} from "../../util/request";
import list from "@/views/item/list";
import edit from "@/views/item/edit";

export default {
  name: "ItemMap",
  components: {
    list,edit,
  },
  data() {
    return {
      // 所有物品
      items: [],
      // 新建还是更新
      operateType: "create",
      // 当前操作的item
      currentEditItem: null,
    }
  },
  created() {
    this.flashItems().then()
  },
  methods: {
    setCurrentItem(item) {
      this.currentEditItem = item ? {...item} : item
    },
    openCreateItem() {
      this.operateType = 'create'
      this.currentEditItem = {
        "name": "",
        "introduce": "",
        "icon": "",
        "maxCount": 1,
        "canUse": 1,
        "canSell": 1,
        "price": 0,
        "isEquipment": 0,
        "extraDataJson": "",
        "equipmentType": "",
        "code": "",
      }
    },
    openUpdateItem(item) {
      this.operateType = 'update'
      this.currentEditItem = item ? {...item} : item
    },
    async flashItems() {
      const loading = this.$loading({
        lock: true,
        text: '加载物品列表中',
        spinner: 'el-icon-loading',
      });
      const result = await request.get('/api/admin/getAllItem')
      loading.close()
      if (!result) return
      if (!result.data.status) return this.$message.warning(result.data.message)
      this.items = result.data.data
    },
    async editItem() {
      const loading = this.$loading({
        lock: true,
        text: '上传中，请稍后',
        spinner: 'el-icon-loading',
      });
      let result = null
      if (this.operateType === 'create') {
        result = await request.post('/api/admin/createItem' , {item: this.currentEditItem})
      } else if (this.operateType === 'update') {
        result = await request.post('/api/admin/updateItem' , {item: this.currentEditItem})
      }
      loading.close()
      if (!result || !result.data.status) this.$message.warning(result?.data?.message)
      else this.$message.success(result?.data?.message)
      this.currentEditItem = null
      await this.flashItems()
    },
  },
}
</script>

<style scoped lang="scss">
.item-page {
}
</style>