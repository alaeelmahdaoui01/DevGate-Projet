<!-- components/BarChartComponent.vue -->
<template>
    <Bar :data="chartData" :options="chartOptions" />
  </template>
  
  <script>
  import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title
  } from 'chart.js'
  import { Bar } from 'vue-chartjs'
  
  ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title)
  
  export default {
    name: 'BarChartComponent',
    props: {
      chartData: Object,
      chartOptions: Object
    },
    components: { Bar }
  }
  </script>
  