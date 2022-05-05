<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="">
      <map-chart />

      <word-cloud-chart />
      <trade-amount-count />
      <main-trade-count />
      <sale-detail />
      <economic-benefits />
      <funnel />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import MapChart from './charts/MapChart';
import WordCloudChart from './charts/WordCloudChart';
import TradeAmountCount from './charts/TradeAmountCount';
import MainTradeCount from './charts/MainTradeCount';
import SaleDetail from './charts/SaleDetail';
import EconomicBenefits from './charts/EconomicBenefits';
import Funnel from './charts/Funnel';

export default {
  name: 'Dashboard',
  components: {
    MapChart,
    WordCloudChart,
    TradeAmountCount,
    MainTradeCount,
    SaleDetail,
    EconomicBenefits,
    Funnel,
  },
  computed: {
    ...mapGetters(['name']),
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
