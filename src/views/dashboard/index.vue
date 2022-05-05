<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="">
      <word-cloud-chart />
      <map-chart />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import MapChart from './charts/MapChart';
import WordCloudChart from './charts/WordCloudChart';

export default {
  name: 'Dashboard',
  components: {
    MapChart,
    WordCloudChart,
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
