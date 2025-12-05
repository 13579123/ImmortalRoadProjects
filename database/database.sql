/*
 Navicat MySQL Data Transfer

 Source Server         : LocationConnection
 Source Server Type    : MySQL
 Source Server Version : 80200
 Source Host           : localhost:3306
 Source Schema         : immortal_road

 Target Server Type    : MySQL
 Target Server Version : 80200
 File Encoding         : 65001

 Date: 30/06/2025 21:21:41
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for account
-- ----------------------------
DROP TABLE IF EXISTS `account`;
CREATE TABLE `account`  (
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '用户邮箱',
  `nickname` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '用户昵称',
  `frozen` int NOT NULL DEFAULT 0 COMMENT '用户账号是否被冻结',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '用户注册时间',
  PRIMARY KEY (`email`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of account
-- ----------------------------
INSERT INTO `account` VALUES ('2242818464@qq.com', '刘二狗', 0, '2025-06-29 09:59:21');

-- ----------------------------
-- Table structure for folk_prescription
-- ----------------------------
DROP TABLE IF EXISTS `folk_prescription`;
CREATE TABLE `folk_prescription`  (
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '炼药Code',
  `materials_main_item` int UNSIGNED NOT NULL COMMENT '需要物品的id',
  `materials_main_item_number` int UNSIGNED NOT NULL COMMENT '需要物品的数量',
  `materials_other_item` int UNSIGNED NOT NULL COMMENT '需要物品的id',
  `materials_other_item_number` int UNSIGNED NOT NULL COMMENT '需要物品的数量',
  `export_item_id` int UNSIGNED NOT NULL COMMENT '产出物品的id',
  `min` int UNSIGNED NOT NULL COMMENT '产出物品的最小数量',
  `max` int UNSIGNED NOT NULL COMMENT '产出物品的最大数量',
  `type` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '炼丹 0 炼器 1',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '物品创建时间',
  PRIMARY KEY (`code`) USING BTREE,
  UNIQUE INDEX `code`(`code`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of folk_prescription
-- ----------------------------
INSERT INTO `folk_prescription` VALUES ('test', 1, 1, 2, 1, 1, 3, 5, 0, '2025-06-30 15:01:24');

-- ----------------------------
-- Table structure for folk_prescription_log
-- ----------------------------
DROP TABLE IF EXISTS `folk_prescription_log`;
CREATE TABLE `folk_prescription_log`  (
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '炼药Code',
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '玩家email',
  `use_count` int UNSIGNED NOT NULL COMMENT '使用数量',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '物品创建时间'
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of folk_prescription_log
-- ----------------------------

-- ----------------------------
-- Table structure for has_learn_folk_prescription
-- ----------------------------
DROP TABLE IF EXISTS `has_learn_folk_prescription`;
CREATE TABLE `has_learn_folk_prescription`  (
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '已经学习的炼药Code',
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '玩家email',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '物品创建时间'
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of has_learn_folk_prescription
-- ----------------------------

-- ----------------------------
-- Table structure for item
-- ----------------------------
DROP TABLE IF EXISTS `item`;
CREATE TABLE `item`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '物品id',
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '物品名称',
  `introduce` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '物品简介',
  `icon` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '物品icon图片路径',
  `max_count` int UNSIGNED NOT NULL COMMENT '物品最大堆叠数量',
  `can_use` int NOT NULL DEFAULT 1 COMMENT '可以使用',
  `can_sell` int NOT NULL DEFAULT 1 COMMENT '可以出售',
  `price` int NOT NULL DEFAULT 1 COMMENT '物品出售价值',
  `is_equipment` int NOT NULL DEFAULT 0 COMMENT '物品是否是装备',
  `extra_data_json` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '物品额外数据',
  `equipment_type` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '类型',
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '物品代号',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '物品创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `code`(`code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of item
-- ----------------------------
INSERT INTO `item` VALUES (1, '灵石', '蕴含灵力', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/a9f8c4d8b7de0886881e0241157929ca.png', 999, 0, 1, 0, 0, '', '', 'lingshi', '2025-06-30 13:53:20');
INSERT INTO `item` VALUES (2, '落魄草', '落魄魂，落魄谷', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/10b2d97c97d8b73d224fe6c5847692b1.png', 999, 0, 1, 1, 0, '', '', 'luopocao', '2025-06-30 13:54:29');
INSERT INTO `item` VALUES (3, '血魔剑', '血魔剑', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/1d14d670c35374a573bf97f51cda45ce.png', 1, 1, 1, 50, 1, '', 'weapon', 'xuemojian', '2025-06-30 20:54:20');

-- ----------------------------
-- Table structure for map
-- ----------------------------
DROP TABLE IF EXISTS `map`;
CREATE TABLE `map`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '地图id',
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '地图名称',
  `introduce` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '地图简介',
  `map_image` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '地图图片',
  `map_level` int NOT NULL COMMENT '地图位置',
  `map_world` int NOT NULL COMMENT '地图所属世界',
  `start_x` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '地图开始位置',
  `start_y` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '地图开始位置',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '物品创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of map
-- ----------------------------
INSERT INTO `map` VALUES (1, '三王山', '三王山，定仙游\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/3c6ae1969df80f85ad8400a50af99b3e.png', 0, 1, 0, 0, '2025-06-29 13:13:50');
INSERT INTO `map` VALUES (2, '大雪山福地', '雪狐老祖遗留福地', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/2c84604150c1fc8e3fce1d735f278059.png', 1, 1, 0, 0, '2025-06-30 20:20:05');

-- ----------------------------
-- Table structure for method_exercises
-- ----------------------------
DROP TABLE IF EXISTS `method_exercises`;
CREATE TABLE `method_exercises`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '功法对应的id',
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '垃圾功法' COMMENT '功法名称',
  `introduce` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '功法简介',
  `level` int NOT NULL DEFAULT 1 COMMENT '功法级别 凡阶 人阶 地阶 天阶 神阶 仙阶 道阶',
  `power` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家真气属性',
  `bone` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家根骨属性 影响防御',
  `physique` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家体魄属性 影响生命',
  `movement` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家身法属性 影响出手速度和闪避率',
  `wakan` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家灵力属性 影响暴击概率',
  `comprehension` int UNSIGNED NOT NULL DEFAULT 5 COMMENT '玩家悟性 影响修炼速度',
  `luck` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家机缘 影响灵力获取速度',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '玩家开始修行的时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of method_exercises
-- ----------------------------
INSERT INTO `method_exercises` VALUES (1, '八九玄功', '', 9, 100, 100, 100, 100, 100, 100, 0, '2025-06-30 15:00:38');

-- ----------------------------
-- Table structure for monster
-- ----------------------------
DROP TABLE IF EXISTS `monster`;
CREATE TABLE `monster`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '怪物对应的id',
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '怪物名称',
  `introduce` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '怪物简介',
  `avatar_image` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '怪物头像',
  `map_id` int UNSIGNED NOT NULL COMMENT '怪物所在地图id',
  `condition_x` int UNSIGNED NOT NULL COMMENT '怪物所在地图x坐标 0 - 20',
  `condition_y` int UNSIGNED NOT NULL COMMENT '怪物所在地图y坐标 0 - 20',
  `power` int UNSIGNED NOT NULL DEFAULT 5 COMMENT '怪物真气属性',
  `bone` int UNSIGNED NOT NULL DEFAULT 5 COMMENT '怪物根骨属性 影响防御',
  `physique` int UNSIGNED NOT NULL DEFAULT 5 COMMENT '怪物体魄属性 影响生命',
  `movement` int UNSIGNED NOT NULL DEFAULT 5 COMMENT '怪物身法属性 影响出手速度和闪避率',
  `is_boss` int NOT NULL DEFAULT 0 COMMENT '怪物是否是boss',
  `drop_json` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '怪物掉落物品JSON [{itemId: 0 , chance: 0 , number: [1,2,3]}]',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '物品创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of monster
-- ----------------------------
INSERT INTO `monster` VALUES (2, '无支奇', '境界: 筑基1阶\n水兽好为害，禹锁于军山之下，其名曰无支奇\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/93115326bd31de69ccaf3aef541e5d05.png', 1, 18, 18, 25, 25, 25, 25, 1, '[]', '2025-06-30 13:36:50');
INSERT INTO `monster` VALUES (3, '狐妖', '境界: 凝气5层\n一只小狐妖\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c3d4463903c8295445595f45667631cd.png', 1, 3, 2, 10, 10, 10, 10, 0, '[]', '2025-06-30 13:38:48');
INSERT INTO `monster` VALUES (4, '神鹰将', '境界: 凝气5层\n本是天上神鸟\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c05a16eda31e5b0f1fe305f878e935ba.png', 1, 2, 3, 5, 15, 10, 10, 0, '[]', '2025-06-30 13:39:54');
INSERT INTO `monster` VALUES (5, '神鹰将', '境界: 凝气5层\n本是天上神鸟\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c05a16eda31e5b0f1fe305f878e935ba.png', 1, 4, 3, 5, 15, 10, 10, 0, '[]', '2025-06-30 13:39:58');
INSERT INTO `monster` VALUES (6, '狐妖', '境界: 凝气5层\n一只小狐妖\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c3d4463903c8295445595f45667631cd.png', 1, 3, 4, 10, 10, 10, 10, 0, '[]', '2025-06-30 13:40:01');
INSERT INTO `monster` VALUES (7, '宝箱', '', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/62295ba8d2f7250ea3362c9d3475ad13.png', 1, 3, 3, 0, 0, 0, 0, 0, '[]', '2025-06-30 13:40:30');
INSERT INTO `monster` VALUES (8, '神鹰将', '境界: 凝气5层\n本是天上神鸟\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c05a16eda31e5b0f1fe305f878e935ba.png', 1, 11, 5, 5, 15, 10, 10, 0, '[]', '2025-06-30 13:40:55');
INSERT INTO `monster` VALUES (9, '神鹰将', '境界: 凝气5层\n本是天上神鸟\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c05a16eda31e5b0f1fe305f878e935ba.png', 1, 15, 4, 5, 15, 10, 10, 0, '[]', '2025-06-30 13:40:57');
INSERT INTO `monster` VALUES (10, '神鹰将', '境界: 凝气5层\n本是天上神鸟\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c05a16eda31e5b0f1fe305f878e935ba.png', 1, 11, 2, 5, 15, 10, 10, 0, '[]', '2025-06-30 13:40:58');
INSERT INTO `monster` VALUES (11, '111', '境界: \n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/10b2d97c97d8b73d224fe6c5847692b1.png', 1, 8, 3, 0, 0, 0, 0, 0, '[{\"rate\":1,\"maxNumber\":5,\"minNumber\":2,\"itemId\":2}]', '2025-06-30 14:56:56');
INSERT INTO `monster` VALUES (12, '111', '境界: \n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/10b2d97c97d8b73d224fe6c5847692b1.png', 1, 4, 9, 0, 0, 0, 0, 0, '[{\"rate\":1,\"maxNumber\":5,\"minNumber\":2,\"itemId\":2}]', '2025-06-30 14:57:04');
INSERT INTO `monster` VALUES (13, '111', '境界: \n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/10b2d97c97d8b73d224fe6c5847692b1.png', 1, 12, 11, 0, 0, 0, 0, 0, '[{\"rate\":1,\"maxNumber\":5,\"minNumber\":2,\"itemId\":2}]', '2025-06-30 14:57:05');
INSERT INTO `monster` VALUES (14, '111', '境界: \n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/10b2d97c97d8b73d224fe6c5847692b1.png', 1, 7, 14, 0, 0, 0, 0, 0, '[{\"rate\":1,\"maxNumber\":5,\"minNumber\":2,\"itemId\":2}]', '2025-06-30 14:57:07');
INSERT INTO `monster` VALUES (15, '111', '境界: \n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/10b2d97c97d8b73d224fe6c5847692b1.png', 1, 3, 16, 0, 0, 0, 0, 0, '[{\"rate\":1,\"maxNumber\":5,\"minNumber\":2,\"itemId\":2}]', '2025-06-30 14:57:09');
INSERT INTO `monster` VALUES (16, '111', '境界: \n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/10b2d97c97d8b73d224fe6c5847692b1.png', 1, 13, 16, 0, 0, 0, 0, 0, '[{\"rate\":1,\"maxNumber\":5,\"minNumber\":2,\"itemId\":2}]', '2025-06-30 14:57:10');
INSERT INTO `monster` VALUES (17, '狐妖', '境界: 凝气5层\n一只小狐妖\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c3d4463903c8295445595f45667631cd.png', 1, 3, 9, 10, 10, 10, 10, 0, '[]', '2025-06-30 14:57:14');
INSERT INTO `monster` VALUES (18, '狐妖', '境界: 凝气5层\n一只小狐妖\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c3d4463903c8295445595f45667631cd.png', 1, 4, 8, 10, 10, 10, 10, 0, '[]', '2025-06-30 14:57:16');
INSERT INTO `monster` VALUES (19, '神鹰将', '境界: 凝气5层\n本是天上神鸟\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c05a16eda31e5b0f1fe305f878e935ba.png', 1, 5, 9, 5, 15, 10, 10, 0, '[]', '2025-06-30 14:57:19');
INSERT INTO `monster` VALUES (20, '神鹰将', '境界: 凝气5层\n本是天上神鸟\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c05a16eda31e5b0f1fe305f878e935ba.png', 1, 4, 10, 5, 15, 10, 10, 0, '[]', '2025-06-30 14:57:21');
INSERT INTO `monster` VALUES (21, '神鹰将', '境界: 凝气5层\n本是天上神鸟\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c05a16eda31e5b0f1fe305f878e935ba.png', 1, 11, 11, 5, 15, 10, 10, 0, '[]', '2025-06-30 20:18:45');
INSERT INTO `monster` VALUES (22, '神鹰将', '境界: 凝气5层\n本是天上神鸟\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c05a16eda31e5b0f1fe305f878e935ba.png', 1, 13, 11, 5, 15, 10, 10, 0, '[]', '2025-06-30 20:18:47');
INSERT INTO `monster` VALUES (23, '神鹰将', '境界: 凝气5层\n本是天上神鸟\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c05a16eda31e5b0f1fe305f878e935ba.png', 1, 12, 12, 5, 15, 10, 10, 0, '[]', '2025-06-30 20:18:48');
INSERT INTO `monster` VALUES (24, '狐妖', '境界: 凝气5层\n一只小狐妖\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/c3d4463903c8295445595f45667631cd.png', 1, 12, 10, 10, 10, 10, 10, 0, '[]', '2025-06-30 20:18:50');
INSERT INTO `monster` VALUES (25, '雪狐老祖', '境界: 大乘9阶\n', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/4d22152220a9d495cf96690fd76320fd.png', 2, 18, 18, 25000, 25000, 25000, 25000, 1, '[{\"rate\":1,\"maxNumber\":300,\"minNumber\":100,\"itemId\":1}]', '2025-06-30 20:21:03');

-- ----------------------------
-- Table structure for movement_matial_arts
-- ----------------------------
DROP TABLE IF EXISTS `movement_matial_arts`;
CREATE TABLE `movement_matial_arts`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '招式id',
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '招式编码',
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '招式名称',
  `introduce` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '招式简介',
  `icon` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '招式图标',
  `level` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '招式等级',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '物品创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `code`(`code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of movement_matial_arts
-- ----------------------------
INSERT INTO `movement_matial_arts` VALUES (1, 'tong tian zhi', '通天指', '回吸生命值', 'https://immortal-road-1307475432.cos.ap-guangzhou.myqcloud.com/ae0e25a41b77a88efe9384247980bde2.png', 1, '2025-06-29 13:06:16');

-- ----------------------------
-- Table structure for pack
-- ----------------------------
DROP TABLE IF EXISTS `pack`;
CREATE TABLE `pack`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '物品堆对应的id',
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '物品对应的玩家邮箱',
  `item_id` int UNSIGNED NOT NULL COMMENT '物品对应的id',
  `item_count` int UNSIGNED NOT NULL COMMENT '物品的数量',
  `has_equipment` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否已经装备',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '物品创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pack
-- ----------------------------

-- ----------------------------
-- Table structure for redeem_code
-- ----------------------------
DROP TABLE IF EXISTS `redeem_code`;
CREATE TABLE `redeem_code`  (
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '兑换Code',
  `rewards_json` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '奖励JSON',
  `effect_time` bigint NOT NULL DEFAULT -1 COMMENT '有效时间 -1为永久',
  `use_time` int NOT NULL DEFAULT -1 COMMENT '可用次数',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '物品创建时间',
  PRIMARY KEY (`code`) USING BTREE,
  UNIQUE INDEX `code`(`code`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of redeem_code
-- ----------------------------

-- ----------------------------
-- Table structure for redeem_code_log
-- ----------------------------
DROP TABLE IF EXISTS `redeem_code_log`;
CREATE TABLE `redeem_code_log`  (
  `code` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '物品创建时间'
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of redeem_code_log
-- ----------------------------

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `role` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '身世名称',
  `power` int NOT NULL DEFAULT 0 COMMENT '玩家真气属性',
  `bone` int NOT NULL DEFAULT 0 COMMENT '玩家根骨属性 影响防御',
  `physique` int NOT NULL DEFAULT 0 COMMENT '玩家体魄属性 影响生命',
  `movement` int NOT NULL DEFAULT 0 COMMENT '玩家身法属性 影响出手速度和闪避率',
  `wakan` int NOT NULL DEFAULT 0 COMMENT '玩家灵力属性 影响暴击概率',
  `comprehension` int NOT NULL DEFAULT 0 COMMENT '玩家悟性 影响修炼速度',
  `luck` int NOT NULL DEFAULT 0 COMMENT '玩家机缘 影响灵力获取速度',
  `introduce` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '简介',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '身世出现时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------

-- ----------------------------
-- Table structure for sect
-- ----------------------------
DROP TABLE IF EXISTS `sect`;
CREATE TABLE `sect`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '宗门id',
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '宗门名称',
  `level` int NOT NULL DEFAULT 1 COMMENT '宗门的星级',
  `role_list_json` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '宗门的角色列表 JSON [{ name: string, introduce: string, icon: string }]',
  `contribute_item_list_json` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '宗门贡献点商店物品列表 JSON [{itemId: 0 , spend: 0}]',
  `shop_item_list_json` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '宗门商店的物品 JSON [{itemId: 0 , spend: [{itemId: 0 , count: 1}]}]',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '宗门出现的时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sect
-- ----------------------------

-- ----------------------------
-- Table structure for user_movement_arts
-- ----------------------------
DROP TABLE IF EXISTS `user_movement_arts`;
CREATE TABLE `user_movement_arts`  (
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '招式对应玩家邮箱',
  `movement_arts_id` int UNSIGNED NOT NULL COMMENT '招式id',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '物品创建时间'
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_movement_arts
-- ----------------------------

-- ----------------------------
-- Table structure for user_property
-- ----------------------------
DROP TABLE IF EXISTS `user_property`;
CREATE TABLE `user_property`  (
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '玩家对应的邮箱',
  `role_id` int NOT NULL DEFAULT 1 COMMENT '玩家对应的角色id',
  `sex` int NOT NULL DEFAULT 1 COMMENT '玩家对应的性别 1 为男 2 为女',
  `hijack_rate` int NOT NULL DEFAULT 100 COMMENT '渡劫成功率',
  `auto_cultivation` bigint NOT NULL DEFAULT 0 COMMENT '玩家自动修炼',
  `exp` bigint UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家修为',
  `power` int UNSIGNED NOT NULL DEFAULT 5 COMMENT '玩家真气属性',
  `bone` int UNSIGNED NOT NULL DEFAULT 5 COMMENT '玩家根骨属性 影响防御',
  `physique` int UNSIGNED NOT NULL DEFAULT 5 COMMENT '玩家体魄属性 影响生命',
  `movement` int UNSIGNED NOT NULL DEFAULT 5 COMMENT '玩家身法属性 影响出手速度和闪避率',
  `wakan` int UNSIGNED NOT NULL DEFAULT 5 COMMENT '玩家灵力属性 影响暴击概率',
  `comprehension` int UNSIGNED NOT NULL DEFAULT 5 COMMENT '玩家悟性 影响修炼速度',
  `luck` int UNSIGNED NOT NULL DEFAULT 5 COMMENT '玩家机缘 影响灵力获取速度',
  `body_realm` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家肉体境界 通脉、锻骨、炼腑、元武、神力、破虚、混元、大成、仙体、金身、道体',
  `body_detail_realm` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家肉体小境界 0 - 9 阶',
  `detail_realm` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家小境界 0 - 9 阶',
  `realm` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家大境界 炼气、筑基、结丹、元婴、化神、练虚、合体、大乘、天仙、玄仙、太乙玉仙、大罗金仙、入道、明道、悟道、化道',
  `pack_level` int UNSIGNED NOT NULL DEFAULT 1 COMMENT '玩家背包等级',
  `spirit_root_level` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家灵根等级',
  `checkpoint_levle` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家通过地图关卡',
  `exercises_method_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家功法id',
  `movement_arts_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '玩家招式id',
  `last_up_exp_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '玩家上一次修为增加的时间',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '玩家开始修行的时间',
  PRIMARY KEY (`email`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_property
-- ----------------------------
INSERT INTO `user_property` VALUES ('2242818464@qq.com', 1, 1, 100, 1751174817483, 3089, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 1, 1, 0, 0, '2025-06-30 20:25:06', '2025-06-29 09:59:29');

-- ----------------------------
-- Table structure for user_sect
-- ----------------------------
DROP TABLE IF EXISTS `user_sect`;
CREATE TABLE `user_sect`  (
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '用户邮箱',
  `sect_id` int NOT NULL COMMENT '所在宗门id',
  `sect_position` int UNSIGNED NOT NULL COMMENT '宗门职位 0 外门弟子 1 内门弟子 2 亲传弟子 3 宗门长老 4 宗门门主',
  `sect_contribute` int UNSIGNED NOT NULL COMMENT '宗门贡献点',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '加入宗门时间',
  PRIMARY KEY (`email`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_sect
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
