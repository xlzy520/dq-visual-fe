<template>
  <div class="TradeAmountCount-box">
    <div class="chart-title">电机企业近5年销售情况图</div>
    <div class="wordCloud-chart" ref="chart"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
import request from '@/utils/request';

export default {
  name: 'MainTradeCount',
  data() {
    return {
      data: [],
    };
  },
  methods: {
    initLineChart() {
      const myChart = echarts.init(this.$refs.chart);
      const categoryData = ['2017', '2018', '2019', '2020', '2021'];
      const data = this.data;
      const series = data.map((v) => {
        const seriesData = categoryData.map((c) => {
          return v[c + '年产品销售量（万千瓦）'];
        });
        return {
          name: v.企业名称,
          type: 'line',
          // smooth: true, //是否平滑曲线显示
          // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
          showAllSymbol: true,
          symbol: 'emptyCircle',
          symbolSize: 6,
          // lineStyle: {
          //   normal: {
          //     color: '#28ffb3', // 线条颜色
          //   },
          //   borderColor: '#f0f',
          // },
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#fff',
            },
          },
          // itemStyle: {
          //   normal: {
          //     color: '#28ffb3',
          //   },
          // },
          tooltip: {
            show: false,
          },
          // areaStyle: {
          //   //区域填充样式
          //   normal: {
          //     //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
          //     color: new echarts.graphic.LinearGradient(
          //       0,
          //       0,
          //       0,
          //       1,
          //       [
          //         {
          //           offset: 0,
          //           color: 'rgba(0,154,120,1)',
          //         },
          //         {
          //           offset: 1,
          //           color: 'rgba(0,0,0, 0)',
          //         },
          //       ],
          //       false,
          //     ),
          //     shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
          //     shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
          //   },
          // },
          data: seriesData,
        };
      });
      console.log(series);
      const option = {
        backgroundColor: '#05224d',
        tooltip: {},
        grid: {
          top: '8%',
          left: '1%',
          right: '1%',
          bottom: '8%',
          containLabel: true,
        },
        legend: {
          itemGap: 50,
          data: data.map((v) => v.企业名称),
          textStyle: {
            color: '#f9f9f9',
            borderColor: '#fff',
          },
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: true,
              lineStyle: {
                color: '#f9f9f9',
              },
            },
            axisLabel: {
              //坐标轴刻度标签的相关设置
              textStyle: {
                color: '#d1e6eb',
                margin: 15,
              },
            },
            axisTick: {
              show: false,
            },
            data: categoryData,
          },
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            // max: 140,
            splitNumber: 7,
            splitLine: {
              show: true,
              lineStyle: {
                color: '#0a3256',
              },
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              margin: 20,
              textStyle: {
                color: '#d1e6eb',
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series,
      };

      myChart.setOption(option);
    },
    getData() {
      request('/trade/saleDetail').then((res) => {
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
