<template>
  <div class="TradeAmountCount-box">
    <div class="chart-title">用户购买电机转化率统计</div>
    <div class="wordCloud-chart" ref="chart"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
import request from '@/utils/request';

export default {
  name: 'Funnel',
  data() {
    return {
      data: [],
    };
  },
  methods: {
    initLineChart() {
      const myChart = echarts.init(this.$refs.chart);
      const option = {
        title: {
          text: '漏斗分析图',
          subtext: '用户购买电机转化率统计',
          x: 'center',
          textStyle: {
            color: '#fff',
          },
        },
        backgroundColor: '#522257',
        color: ['#efbb1a', '#d77169', '#c14f60', '#953f61', '#72355f'],

        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            x: '10%',
            y: 60,
            //x2: 80,
            y2: 60,
            width: '80%',
            // height: {totalHeight} - y - y2,
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending', // 'ascending', 'descending'
            gap: 0,

            data: [
              { value: 61, name: '访问' },
              { value: 38, name: '咨询' },
              { value: 18, name: '订单' },
              { value: 78, name: '点击' },
              { value: 100, name: '展现' },
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: true,
            label: {
              normal: {
                formatter: function (params) {
                  return params.name + ' ' + params.value + '%';
                },
                position: 'center',
              },
            },
            itemStyle: {
              normal: {
                borderWidth: 0,
                shadowBlur: 30,
                shadowOffsetX: 0,
                shadowOffsetY: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };

      myChart.setOption(option);
    },
    getData() {
      request('/trade/economicBenefits').then((res) => {
        this.data = res.data;
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
  width: 800px;
  height: 600px;
}
.two-chart {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
