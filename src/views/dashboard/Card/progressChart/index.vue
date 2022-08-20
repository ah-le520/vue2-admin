<template>
  <div ref="charts" class="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "",
  mounted() {
    //初始化实例
    let lineChart = echarts.init(this.$refs.charts);
    lineChart.setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          barWidth: 15,
          color: "yellowgreen",
          showBackground: true,
          label: {
            show: true,
            formatter: "|",
            position: "right",
          },
        },
      ],
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