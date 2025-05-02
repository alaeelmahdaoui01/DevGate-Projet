<template>
    <div class="wrapper">
      <div class="all objectives">
        <div class="objectives-layout">
  
          <!-- Status Distribution -->
          <div class="section-card">
            <h3 class="text-lg font-medium mb-4">Status Distribution</h3>
            <div class="h-64">
              <canvas ref="statusDistributionChart"></canvas>
            </div>
          </div>
  
          <!-- Monthly Objectives Evolution -->
          <div class="section-card mt-5">
            <h3 class="text-lg font-medium mb-4">Monthly Objectives Added</h3>
            <div class="h-64">
              <canvas ref="monthlyObjectivesChart"></canvas>
            </div>
          </div>
  
          <!-- Objectives Timeline -->
          <div class="section-card">
            <h3 class="text-lg font-medium mb-4">Objectives Growth Timeline</h3>
            <div class="h-64">
              <canvas ref="objectivesTimelineChart"></canvas>
            </div>
          </div>
  
          <!-- Global Statistics -->
          <div class="card mb-4">
            <div class="card-body">
              <h3 class="card-title h5 mb-4">Objective Statistics</h3>
              <div class="row g-3 text-center">
                <div class="col-6 col-md-3">
                  <div class="bg-opacity-10 p-3 rounded">
                    <div class="display-6 fw-bold text-primary">{{ totalObjectives }}</div>
                    <div class="small text-muted mt-1">Total Objectives</div>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="bg-opacity-10 p-3 rounded">
                    <div class="display-6 fw-bold text-success">{{ completedObjectives }}</div>
                    <div class="small text-muted mt-1">Completed</div>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="bg-opacity-10 p-3 rounded">
                    <div class="display-6 fw-bold text-warning">{{ objectivesAddedThisMonth }}</div>
                    <div class="small text-muted mt-1">Added This Month</div>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="bg-opacity-10 p-3 rounded">
                    <div class="display-6 fw-bold text-purple">{{ recentlyModifiedObjectives }}</div>
                    <div class="small text-muted mt-1">Recently Modified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
        </div>
      </div>
    </div>
  </template>
  
  <script>
//   import { ref, onMounted } from 'vue';
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '@/Firebase/config';
  import { Chart, registerables } from 'chart.js';
  
  Chart.register(...registerables);
  
  export default {
    name: 'ObjectivesPage',
    props: {
      id: {
        type: String,
        required: true
      }
    },
  mounted() {
    console.log("ID received:", this.id);
  },
    data() {
      return {
        objectives: [],
        isLoading: false,
        totalObjectives: 0,
        completedObjectives: 0,
        objectivesAddedThisMonth: 0,
        recentlyModifiedObjectives: 0
      };
    },
    methods: {
      async fetchObjectives() {
        this.isLoading = true;
        try {
          const userDocRef = doc(db, 'users', this.id);
          const userSnap = await getDoc(userDocRef);
  
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const userObjectives = userData.objectives || [];
            const fetchedObjectives = [];
  
            for (const obj of userObjectives) {
              const objDoc = await getDoc(doc(db, 'objectives', obj.id));
              if (objDoc.exists()) {
                fetchedObjectives.push({ id: obj.id, ...objDoc.data() });
              }
            }
  
            this.objectives = fetchedObjectives;
            this.computeStats();
            this.renderCharts();
          }
        } catch (e) {
          console.error('Error fetching objectives:', e);
        } finally {
          this.isLoading = false;
        }
      },
      computeStats() {
        const now = new Date();
        const thisMonth = now.getMonth();
        const today = now.getTime();
  
        this.totalObjectives = this.objectives.length;
        this.completedObjectives = this.objectives.filter(obj => obj.status === 'Completed').length;
        this.objectivesAddedThisMonth = this.objectives.filter(obj => {
          const date = obj.createdAt?.toDate?.() || new Date(obj.createdAt);
          return date.getMonth() === thisMonth;
        }).length;
        this.recentlyModifiedObjectives = this.objectives.filter(obj => {
          const updated = obj.updatedAt?.toDate?.() || new Date(obj.updatedAt);
          return today - updated.getTime() < 7 * 24 * 60 * 60 * 1000; // last 7 days
        }).length;
      },
      renderCharts() {
        this.renderStatusDistributionChart();
        this.renderMonthlyObjectivesChart();
        this.renderTimelineChart();
      },
      renderStatusDistributionChart() {
        const ctx = this.$refs.statusDistributionChart.getContext('2d');
        const statusCounts = this.objectives.reduce((acc, obj) => {
          const status = obj.status || 'unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
  
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(statusCounts),
            datasets: [{
              label: 'Status Distribution',
              data: Object.values(statusCounts),
              backgroundColor: ['#36a2eb', '#4bc0c0', '#ffcd56', '#ff6384'],
            }]
          },
          options: {
            responsive: true
          }
        });
      },
      renderMonthlyObjectivesChart() {
        const ctx = this.$refs.monthlyObjectivesChart.getContext('2d');
        const months = Array.from({ length: 12 }, (_, i) => i);
        const counts = Array(12).fill(0);
  
        this.objectives.forEach(obj => {
          const date = obj.createdAt?.toDate?.() || new Date(obj.createdAt);
          counts[date.getMonth()]++;
        });
  
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: months.map(m => new Date(0, m).toLocaleString('default', { month: 'short' })),
            datasets: [{
              label: 'Objectives Added',
              data: counts,
              backgroundColor: '#36a2eb'
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      },
      renderTimelineChart() {
        const ctx = this.$refs.objectivesTimelineChart.getContext('2d');
  
        // Sort objectives by creation date
        const sorted = [...this.objectives].sort((a, b) =>
          new Date(a.createdAt) - new Date(b.createdAt)
        );
  
        const labels = sorted.map((obj, i) => `#${i + 1}`);
        const values = sorted.map((obj, i) => i + 1);
  
        new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Cumulative Objectives',
              data: values,
              fill: false,
              borderColor: '#4bc0c0',
              tension: 0.2
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    },
    watch: {
      id: {
        immediate: true,
        handler() {
          this.fetchObjectives();
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .wrapper {
    padding: 20px;
  }
  .section-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  .h-64 {
  height: 16rem; /* Tailwind or custom */
}
  </style>
  