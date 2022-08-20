<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "",

  mounted() {
    let myCharts = echarts.init(this.$refs.charts);
    myCharts.setOption({
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          data: [
            { value: 300, name: "视频广告:300" },
            { value: 484, name: "联盟广告:484" },
            { value: 580, name: "邮件营销:580" },
            { value: 735, name: "直接访问:735" },
            { value: 1048, name: "搜索引擎:1048" },
          ],
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 2,
          },
        },
      ],
    });
    myCharts.on("mouseover", (params) => {
      myCharts.setOption({
        title: {
          text: params.data.name,
          top: "center",
          left: "center",
        },
      });
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 340px;
}
</style>