<template>
  <div class="charts-box TradeAmountCount-box">
    <div class="chart-title">电机企业的经济效益图</div>
    <div class="wordCloud-chart" ref="chart"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
import request from '@/utils/request';

export default {
  name: 'EconomicBenefits',
  data() {
    return {
      data: [],
    };
  },
  methods: {
    initLineChart() {
      const myChart = echarts.init(this.$refs.chart);
      /**
       * 外接数据
       *
       */
      const yAxis = [];
      const xAxis = [[], []];
      const legend = ['经济效益指数', '产品销售率%'];
      this.data.forEach((item) => {
        yAxis.push(item.企业名称);
        xAxis[0].push(-item['经济效益指数']);
        xAxis[1].push(item['产品销售率%']);
      });
      const data = {
        //标准参数
        id: 'multipleThree',
        // title: '双柱子',
        legend,
        barWidth: 30,
        yAxis,
        xAxis,
        color: ['#5e94dd', '#49b5bd'],
      };

      const option = {
        backgroundColor: '#fff',
        title: {
          text: data.title,
          left: 20,
          textStyle: {
            fontSize: 16,
            fontWeight: 500,
            color: '#414957',
          },
          top: 12,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: false, // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            var time = '';
            var str = '';
            for (var i of params) {
              time = i.name.replace(/\n/g, '') + '<br/>';
              if (i.data == 'null' || i.data == null) {
                str += i.seriesName + '：无数据' + '<br/>';
              } else {
                str += i.seriesName + '：' + Math.abs(i.data) + '<br/>';
              }
            }
            return time + str;
          },
        },
        legend: {
          top: 12,
          itemGap: 10,
          itemWidth: 10,
          itemHeight: 10,
          data: data.legend,
        },
        color: data.color,
        grid: {
          x: 50,
          x2: 30,
          y2: 5,
          containLabel: true,
        },
        xAxis: {
          show: false,
        },
        yAxis: [
          {
            type: 'category',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              interval: '0',
              textStyle: {
                fontSize: 12,
                color: '#687284',
              },
            },
            data: data.yAxis,
          },
        ],
        series: [
          {
            name: data.legend[0],
            type: 'bar',
            barWidth: data.barWidth || 12,
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'left',
                color: '#687284',
                fontSize: '10',
                formatter: function (params) {
                  return params.data * -1;
                },
              },
            },
            data: data.xAxis[0],
          },
          {
            name: data.legend[1],
            type: 'bar',
            barWidth: data.barWidth || 12,
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'right',
                color: '#687284',
                fontSize: '10',
              },
            },
            data: data.xAxis[1],
          },
        ],
      };

      myChart.setOption(option);
    },
    getData() {
      request('/trade/economicBenefits').then((res) => {
        this.data = res;
        console.log(res);
        this.initLineChart();
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.wordCloud-chart {
  width: 80%;
  margin: auto;
  height: 600px;
}
.two-chart {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
