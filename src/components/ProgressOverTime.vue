<template>
          <h2>Progress</h2>

    <ChartComponent :chartData="chartData" :chartOptions="chartOptions" />
  </template>
  
  <script>
  import ChartComponent from './ChartComponent.vue'
  import { getUser, waitForAuthInit } from '@/Firebase/Authentification/getUser'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/Firebase/config'

export default {
  components: { ChartComponent },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [{
          label: 'Progress (%)',
          backgroundColor: '#3b82f6',
          data: []
        }]
      },
      chartOptions: {
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 20,
              callback: value => `${value}%`
            },
            title: {
              display: true,
              text: 'Progress (%)'
            }
          }
        }
      }
    }
  },
  async mounted() {
    // Wait until auth state is initialized
    await waitForAuthInit();

    const user = getUser(); // Now it should return the current authenticated user
    console.log(user); // Make sure the user is correctly fetched

    if (user) {
      const userId = user.uid;

      // Create a query that fetches only the objectives where 'CreatedBy' field matches the logged-in user ID
      const q = query(collection(db, 'objectives'), where('createdBy', '==', userId));

      // Fetch the documents that match the query
      const snapshot = await getDocs(q);

      const labels = [];
      const data = [];

      snapshot.forEach(doc => {
        const obj = doc.data();
        labels.push(obj.title);
        data.push(obj.progress || 0);
      });

      // Update chart data with the filtered objectives
      this.chartData = {
        labels: labels,
        datasets: [{
          label: 'Progress (%)',
          backgroundColor: '#3b82f6',
          data: data
        }]
      }
    } else {
      console.warn('User is not authenticated');
    }
  }
}

  </script>
  