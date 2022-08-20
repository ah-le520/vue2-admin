<template>
  <div>
    <div class="header">
      <span>搜索用户数</span>
      <span><i class="el-icon-warning-outline"></i></span>
    </div>
    <div class="main">
      <span style="font-weight: 700; font-size: 20px">12374</span>
      <span
        >17<i class="el-icon-caret-top" style="color: red"></i
        ><i class="el-icon-caret-bottom" style="color: green"></i
      ></span>
    </div>
    <div ref="charts" class="charts"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "LineChart",
  mounted() {
    //初始化实例
    let lineChart = echarts.init(this.$refs.charts);
    lineChart.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      series: [
        {
          type: "line",
          data: [10, 13, 24, 32, 42, 34, 25, 18],
          color: "blue",
          itemStyle: { opacity: 0 },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "blue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    });
  },
};
</script>

<style scoped >
.charts {
  width: 100%;
  height: 100px;
}
.header {
  margin-top: 30px;
  margin-bottom: 15px;
}
.header span {
  margin-right: 10px;
}
.main span {
  margin-right: 40px;
}
</style>