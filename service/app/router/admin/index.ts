import { Router } from "express";
import { Api } from "../../module/swagger/Api";
import { filterBody } from "../../module/filter/filterBody";
import { getFail } from "../../util/result";
import { filterHeader } from "../../module/filter/filterHeader";
import CODE_RULE from "../../module/CODE_RULE";
import { getAllMap } from "./controller/getAllMap";
import { getAllItem } from "./controller/getAllItem";
import { deleteItemById } from "./controller/deleteItemById";
import { Item } from "../../database/Item";
import { createItem } from "./controller/createItem";
import { updateItem } from "./controller/updateItem";
import { Map } from "../../database/Map";
import { createMap } from "./controller/createMap";
import { updateMap } from "./controller/updateMap";
import { deleteMapById } from "./controller/deleteMapById";
import { deleteMonsterById } from "./controller/deleteMonsterById";
import { Monster } from "../../database/Monster";
import { createMonster } from "./controller/createMonster";
import { updateMonster } from "./controller/updateMonster";
import { getAllMovementArts } from "./controller/getAllMovementArts";
import { createMovementArt } from "./controller/createMovementArt";
import { MovementMatialArts } from "../../database/MovementsMartialArts";
import { updateMovementArt } from "./controller/updateMovementArt";
import { deleteMovementArtById } from "./controller/deleteMovementArtById";
import { getAllRedeemCode } from "./controller/getAllRedeemCode";
import { createRedeemCode } from "./controller/createRedeemCode";
import { RedeemCode } from "../../database/RedeemCode";
import { updateRedeemCode } from "./controller/updateRedeemCode";
import { deleteRedeemCode } from "./controller/deleteRedeemCode";
import { getAllMethodExercise } from "./controller/getAllMethodExercise";
import { createMethodExercise } from "./controller/createMethodExercise";
import { MethodExercises } from "../../database/MethodExercises";
import { updateMethodExercise } from "./controller/updateMethodExercise";
import { deleteMethodExercise } from "./controller/deleteMethodExercise";
import { getAllFolkPrescription } from "./controller/getAllFolkPrescription";
import { createFolkPrescription } from "./controller/createFolkPrescription";
import { FolkPrescription } from "../../database/FolkPrescription";
import { updateFolkPrescription } from "./controller/updateFolkPrescription";
import { deleteFolkPrescription } from "./controller/deleteFolkPrescription";

const router = Router()

router.get(
  "/getAllRedeemCode" , 
  Api({
    method: 'GET',
    group: 'Admin',
    url: '/api/admin/getAllRedeemCode',
    comment: '获取所有兑换码'
  }),
  getAllRedeemCode()
)

router.post(
  "/createRedeemCode" , 
  Api({
    method: 'POST',
    group: 'Admin',
    url: '/api/admin/createRedeemCode',
    comment: '创建兑换码',
    requestExample: { redeem: new RedeemCode }
  }),
  filterBody([
    {key: 'redeem' , required: true , failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '未获取到数据')}
  ]),
  createRedeemCode()
)

router.post(
  "/updateRedeemCode" , 
  Api({
    method: 'POST',
    group: 'Admin',
    url: '/api/admin/updateRedeemCode',
    comment: '更新兑换码',
    requestExample: {redeem: new RedeemCode}
  }),
  filterBody([
    {key: 'redeem' , required: true , failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '未获取到数据')}
  ]),
  updateRedeemCode()
)

router.delete(
  "/deleteRedeemCode" , 
  Api({
    method: 'DELETE',
    group: 'Admin',
    url: '/api/admin/deleteRedeemCode',
    comment: '删除兑换码',
    requestExample: {codeList: []}
  }),
  filterBody([
    {key: 'codeList' , required: true , failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '未获取到数据')}
  ]),
  deleteRedeemCode()
)

router.get(
  "/getAllItem" , 
  Api({
    method: 'GET',
    group: 'Admin',
    url: '/api/admin/getAllItem',
    comment: '获取所有物品'
  }),
  getAllItem()
)

router.post(
  "/createItem" , 
  Api({
    method: 'POST',
    group: 'Admin',
    url: '/api/admin/createItem',
    comment: '创建物品',
    requestExample: {item: new Item}
  }),
  filterBody([
    {key: 'item' , required: true}
  ]),
  createItem()
)

router.post(
  "/updateItem" , 
  Api({
    method: 'POST',
    group: 'Admin',
    url: '/api/admin/updateItem',
    comment: '更新物品',
    requestExample: {item: new Item}
  }),
  filterBody([
    {key: 'item' , required: true}
  ]),
  updateItem()
)

router.delete(
  "/deleteItemById" , 
  Api({
    method: 'DELETE',
    group: 'Admin',
    url: '/api/admin/deleteItemById',
    comment: '删除物品',
    requestExample: {idList: []}
  }),
  filterBody([
    {key: 'idList' , required: true}
  ]),
  deleteItemById()
)

router.get(
  "/getAllMap" , 
  Api({
    method: 'GET',
    group: 'Admin',
    url: '/api/admin/getAllMap',
    comment: '获取所有地图'
  }),
  getAllMap()
)

router.post(
  "/createMap" , 
  Api({
    method: 'POST',
    group: 'Admin',
    url: '/api/admin/createMap',
    comment: '创建地图',
    requestExample: {map: new Map}
  }),
  filterBody([
    {key: 'map' , required: true}
  ]),
  createMap()
) 

router.post(
  "/updateMap" , 
  Api({
    method: 'POST',
    group: 'Admin',
    url: '/api/admin/updateMap',
    comment: '修改地图',
    requestExample: {map: new Map}
  }),
  filterBody([
    {key: 'map' , required: true}
  ]),
  updateMap()
) 

router.delete(
  "/deleteMapById" , 
  Api({
    method: 'DELETE',
    group: 'Admin',
    url: '/api/admin/deleteMapById',
    comment: '删除地图',
    requestExample: {idList: []}
  }),
  filterBody([
    {key: 'idList' , required: true}
  ]),
  deleteMapById()
)

router.post(
  "/createMonster" , 
  Api({
    method: 'POST',
    group: 'Admin',
    url: '/api/admin/createMonster',
    comment: '创建怪物',
    requestExample: {monster: new Monster}
  }),
  filterBody([
    {key: 'monster' , required: true}
  ]),
  createMonster()
)

router.post(
  "/updateMonster" , 
  Api({
    method: 'POST',
    group: 'Admin',
    url: '/api/admin/updateMonster',
    comment: '修改怪物',
    requestExample: {monster: new Monster}
  }),
  filterBody([
    {key: 'monster' , required: true}
  ]),
  updateMonster()
)

router.delete(
  "/deleteMonsterById" , 
  Api({
    method: 'DELETE',
    group: 'Admin',
    url: '/api/admin/deleteMonsterById',
    comment: '删除怪物',
    requestExample: {idList: []}
  }),
  filterBody([
    {key: 'idList' , required: true , failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '请传入id列表')}
  ]),
  deleteMonsterById()
)

router.get(
  "/getAllMovementArts" , 
  Api({
    method: 'GET',
    group: 'Admin',
    url: '/api/admin/getAllMovementArts',
    comment: '获取所有招式'
  }),
  getAllMovementArts()
)

router.post(
  "/createMovementArt" , 
  Api({
    method: 'POST',
    group: 'Admin',
    url: '/api/admin/createMovementArt',
    comment: '创建招式',
    requestExample: {movementArt: new MovementMatialArts}
  }),
  filterBody([
    {key: 'movementArt' , required: true}
  ]),
  createMovementArt()
)

router.post(
  "/updateMovementArt" , 
  Api({
    method: 'POST',
    group: 'Admin',
    url: '/api/admin/updateMovementArt',
    comment: '创建招式',
    requestExample: {movementArt: new MovementMatialArts}
  }),
  filterBody([
    {key: 'movementArt' , required: true}
  ]),
  updateMovementArt()
)

router.delete(
  "/deleteMovementArtById" , 
  Api({
    method: 'DELETE',
    group: 'Admin',
    url: '/api/admin/deleteMovementArtById',
    comment: '删除招式',
    requestExample: {idList: []}
  }),
  filterBody([
    {key: 'idList' , required: true , failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '请传入要删除的id')}
  ]),
  deleteMovementArtById()
)

router.get(
  "/getAllMethodExercise" , 
  Api({
    method: 'GET',
    group: 'Admin',
    url: '/api/admin/getAllMethodExercise',
    comment: '获取所有功法'
  }),
  getAllMethodExercise()
)

router.post(
  "/createMethodExercise",
  Api({
    method: 'POST',
    group: 'Admin',
    url: '/api/admin/createMethodExercise',
    comment: '创建功法',
    requestExample: { method: new MethodExercises }
  }),
  filterBody([
    {key: 'method' , required: true , failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '请传入要创建的功法信息')}
  ]),
  createMethodExercise()
)

router.post(
  "/updateMethodExercise",
  Api({
    method: 'POST',
    group: 'Admin',
    url: '/api/admin/updateMethodExercise',
    comment: '更新功法',
    requestExample: { method: new MethodExercises }
  }),
  filterBody([
    {key: 'method' , required: true , failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '请传入要创建的功法信息')}
  ]),
  updateMethodExercise()
)

router.delete(
  "/deleteMethodExercise",
  Api({
    method: 'DELETE',
    group: 'Admin',
    url: '/api/admin/deleteMethodExercise',
    comment: '删除功法',
    requestExample: {idList: []}
  }),
  filterBody([
    {key: 'idList' , required: true , failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '请传入要删除的id')}
  ]),
  deleteMethodExercise()
)

router.get(
  "/getAllFolkPrescription",
  Api({
    method: 'GET',
    group: 'Admin',
    url: '/api/admin/getAllFolkPrescription',
    comment: '获取所有药方',
    requestExample: {}
  }),
  getAllFolkPrescription()
)

router.post(
  "/createFolkPrescription",
  Api({
    method: 'POST',
    group: 'Admin',
    url: '/api/admin/createFolkPrescription',
    comment: '创建药方',
    requestExample: {folkPrescription: new FolkPrescription}
  }),
  filterBody([
    {key: 'folkPrescription' , required: true , failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '请传入要创建的药方')}
  ]),
  createFolkPrescription()
)

router.post(
  "/updateFolkPrescription",
  Api({
    method: 'POST',
    group: 'Admin',
    url: '/api/admin/updateFolkPrescription',
    comment: '修改药方',
    requestExample: {folkPrescription: new FolkPrescription}
  }),
  filterBody([
    {key: 'folkPrescription' , required: true , failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '请传入要创建的药方')}
  ]),
  updateFolkPrescription()
)

router.delete(
  "/deleteFolkPrescription",
  Api({
    method: 'DELETE',
    group: 'Admin',
    url: '/api/admin/deleteFolkPrescription',
    comment: '删除药方',
    requestExample: {codeList: []}
  }),
  filterBody([
    {key: 'codeList' , required: true , failResult: getFail(CODE_RULE.ARGUMENT_ERROR , '请传入要删除的id')}
  ]),
  deleteFolkPrescription()
)

export default router