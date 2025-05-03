<template>
  <div class="progress-container">
    <div class="progress-header">
      <div class="c">
        <h1 class="text-2xl font-bold">Over time Progress </h1></div>
      <div class="progress-decoration"></div>
    </div>
    <div class="chart-wrapper">
      <ChartComponent :chartData="chartData" :chartOptions="chartOptions" />
    </div>
  </div>
</template>

<script>
import ChartComponent from './ChartComponent.vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/Firebase/config'

export default {
  components: { ChartComponent },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [{
          label: 'Progress (%)',
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 2,
          borderRadius: 4,
          data: []
        }]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 12
            },
            padding: 12,
            cornerRadius: 8,
            displayColors: false
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            grid: {
              color: 'rgba(226, 232, 240, 0.5)'
            },
            ticks: {
              color: '#64748b',
              stepSize: 20,
              callback: value => `${value}%`
            },
            title: {
              display: true,
              text: 'Progress (%)',
              color: '#475569',
              font: {
                weight: '600'
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#64748b'
            }
          }
        }
      }
    }
  },
  async mounted() {
    const q = query(collection(db, 'objectives'), where('createdBy', '==', this.userId));
    const snapshot = await getDocs(q);

    const labels = [];
    const data = [];

    snapshot.forEach(doc => {
      const obj = doc.data();
      labels.push(obj.title);
      data.push(obj.progress || 0);
    });

    this.chartData = {
      labels: labels,
      datasets: [{
        label: 'Progress (%)',
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 2,
        borderRadius: 4,
        data: data
      }]
    }
  }
}
</script>

<style scoped>
.progress-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.8s ease-out forwards;
}

.progress-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6);
  animation: rainbow 8s linear infinite;
  background-size: 400% 100%;
}

.progress-header {
  margin-bottom: 1.5rem;
  position: relative;
}

.progress-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.progress-decoration {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #6366f1);
  border-radius: 2px;
  margin-bottom: 1rem;
}

.chart-wrapper {
  height: 350px;
  position: relative;
}

@keyframes rainbow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .progress-container {
    padding: 1.5rem;
  }
  
  .progress-header h2 {
    font-size: 1.5rem;
  }
  
  .chart-wrapper {
    height: 300px;
  }
}
.text-2xl.font-bold {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  position: relative;
}



.c{
  text-align : left ;
}

</style>