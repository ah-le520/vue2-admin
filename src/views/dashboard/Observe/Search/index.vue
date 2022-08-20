<template>
  <div>
    <el-card shadow="always">
      <!-- 头部 -->
      <div class="header">
        <span>线上热门搜索</span
        ><span>
          <el-dropdown>
            <span>
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="12" :offset="0">
            <LineChart></LineChart>
          </el-col>
          <el-col :span="12" :offset="0">
            <LineChart></LineChart>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column type="index" label="排名" width="80">
          </el-table-column>
          <el-table-column prop="date" label="搜索关键字" width="180">
          </el-table-column>
          <el-table-column prop="name" label="用户数" sortable>
          </el-table-column>
          <el-table-column prop="address" label="周涨幅" sortable>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页器 -->
      <el-pagination
        layout="prev, pager, next"
        :total="1000"
        style="text-align: right"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import LineChart from "./LineChart";
export default {
  name: "Search",
  components: { LineChart },
  data() {
    return {
      tableData: [],
    };
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  height: 39px;
  border-bottom: 1px solid #ccc;
}
</style>