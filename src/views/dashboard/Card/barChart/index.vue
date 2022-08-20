<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "",
  mounted() {
    let barChart = echarts.init(this.$refs.charts);
    barChart.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: {
        type: "bar",
        data: [12, 15, 16, 25, 34, 31, 26, 24, 10, 15, 16, 23],
      },
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>