<template>
  <div class="chart-container">
    <Bubble 
      :data="chartData" 
      :options="chartOptions" 
      :height="300"
      :width="300"
    />
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  BubbleController,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js'
import { Bubble } from 'vue-chartjs'

ChartJS.register(
  BubbleController,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
  Title
)

export default {
  name: 'BubbleChartComponent',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    }
  },
  components: { Bubble }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 300px;
}
</style>