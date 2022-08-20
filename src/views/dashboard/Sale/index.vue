<template>
  <div>
    <el-card shadow="always">
      <div slot="header" class="clearfix">
        <!-- v-model="activeName" @tab-click="handleClick" -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker
            class="date"
            v-model="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <!-- 图表 -->
          <el-col :span="16" :offset="0">
            <div class="charts" ref="charts"></div>
          </el-col>
          <!-- 排名 -->
          <el-col :span="8" :offset="0">
            <div style="height: 300px">
              <h5>门店{{ title }}排名</h5>
              <ul class="saleList">
                <li>
                  <div><span class="bgc_black">1</span><span>肯德基</span></div>
                  <div>3,214,254</div>
                </li>
                <li>
                  <div><span class="bgc_black">2</span><span>麦当劳</span></div>
                  <div>2,412,254</div>
                </li>
                <li>
                  <div><span class="bgc_black">3</span><span>海底捞</span></div>
                  <div>214,254</div>
                </li>
                <li>
                  <div><span class="bgc_white">4</span><span>汉堡王</span></div>
                  <div>189,254</div>
                </li>
                <li>
                  <div><span class="bgc_white">5</span><span>肯德基</span></div>
                  <div>176,254</div>
                </li>
                <li>
                  <div><span class="bgc_white">6</span><span>肯德基</span></div>
                  <div>152,254</div>
                </li>
                <li>
                  <div><span class="bgc_white">7</span><span>肯德基</span></div>
                  <div>120,254</div>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dayjs from "dayjs";
import * as echarts from "echarts";
export default {
  name: "Sale",
  data() {
    return {
      // 收集的时间
      date: [],
      // 选中的哪个tab栏
      activeName: "sale",
      myCharts: null,
    };
  },
  // 初始化挂载
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts);
    this.myCharts.setOption({
      title: { text: "销售额趋势" },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
        },
      ],
    });
  },
  // 计算属性
  computed: {
    // 图表标题
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  watch: {
    //判断title
    title() {
      let title = "";
      if (this.title == "销售额") {
        title = this.title + "趋势";
      } else {
        title = this.title;
      }
      // 修改图表配置
      this.myCharts.setOption({
        title: {
          text: title,
        },
        xAxis: {
          data:
            this.title == "销售额"
              ? this.listState.userFullYearAxis
              : this.listState.orderFullYearAxis,
        },
        series: {
          data:
            this.title == "销售额"
              ? this.listState.userFullYear
              : this.listState.orderFullYear,
        },
      });
    },
    //监听listState，数据拿到后就赋值给图表完成初始化
    listState() {
      this.myCharts.setOption({
        title: { text: "销售额趋势" },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.listState.userFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.listState.userFullYear,
          },
        ],
      });
    },
  },
  // 方法
  methods: {
    // 今日
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    // 本周
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    // 本月
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    // 本年
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.date {
  width: 250px !important;
}
.right {
  position: absolute;
  right: 0;
}
.right span {
  margin-right: 20px;
}
.charts {
  width: 100%;
  height: 300px;
}
.saleList {
  padding: 0;
  margin: 0;
  list-style: none;
}
.saleList li {
  display: flex;
  justify-content: space-between;
  margin: 18px 0;
}
.saleList li div span {
  margin-right: 30px;
}
.bgc_black {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: black;
  color: white;
  border-radius: 50%;
  text-align: center;
}
.bgc_white {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: white;
  color: black;
  border-radius: 50%;
  text-align: center;
}
</style>