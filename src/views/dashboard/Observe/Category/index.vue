<template>
  <el-card shadow="always">
    <!-- 头部 -->
    <div class="header">
      <span>销售额类别占比</span>
      <span>
        <el-radio-group v-model="radio1" size="mini" border>
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </span>
    </div>
    <!-- 内容 -->
    <div>
      <PieChart></PieChart>
    </div>
  </el-card>
</template>

<script>
import PieChart from "./PieChart";
export default {
  name: "Category",
  components: { PieChart },
  data() {
    return {
      radio1: "全部渠道",
    };
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
</style>