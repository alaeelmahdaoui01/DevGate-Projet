<template>
    <div class="skills-chart-container">
      <div class="skills-header">
        <h2>Skill Levels</h2>
        <div class="skills-decoration"></div>
      </div>
      <div class="chart-wrapper">
        <BubbleChartComponent :chartData="skillsData" :chartOptions="options" />
      </div>
    </div>
  </template>
  
  <script>
  import BubbleChartComponent from '@/components/BubbleChartComponent.vue'
  import { collection, query, where, getDocs } from 'firebase/firestore'
  import { db } from '@/Firebase/config.js'
  
  const LEVEL_WEIGHTS = {
    expert: 4,
    advanced: 3,
    intermediate: 2,
    beginner: 1
  }
  
  export default {
    components: { BubbleChartComponent },
    props: {
      userId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        skillsData: {
          datasets: []
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: false
            },
            y: {
              display: false
            }
          },
          plugins: {
            legend: {
              position: 'right',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20,
                font: {
                  size: 12,
                  weight: '600'
                },
                color: '#475569',
                generateLabels: (chart) => {
                  const levels = ['expert', 'advanced', 'intermediate', 'beginner']
                  return levels.map(level => ({
                    text: level.charAt(0).toUpperCase() + level.slice(1),
                    fillStyle: this.getLevelColor(level),
                    strokeStyle: '#000',
                    lineWidth: 1,
                    hidden: false,
                    index: LEVEL_WEIGHTS[level] - 1
                  }))
                }
              }
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
              displayColors: false,
              callbacks: {
                label: (context) => {
                  return `${context.raw.skill}: ${context.raw.level}`
                }
              }
            },
            title: { 
              display: false
            }
          }
        }
      }
    },
    methods: {
      getLevelColor(level) {
        const colors = {
          expert: '#4CAF50',    // Green
          advanced: '#8BC34A',  // Light Green
          intermediate: '#FFC107', // Amber
          beginner: '#FF9800'    // Orange
        }
        return colors[level] || '#9E9E9E'
      },
      getLevelSize(level) {
        const sizes = {
          expert: 20,
          advanced: 16,
          intermediate: 12,
          beginner: 8
        }
        return sizes[level] || 10
      }
    },
    async mounted() {
      const q = query(collection(db, "skills"), where("userId", "==", this.userId))
      const snapshot = await getDocs(q)
      
      const skillsByLevel = {
        expert: [],
        advanced: [],
        intermediate: [],
        beginner: []
      }
  
      snapshot.forEach(doc => {
        const skillData = doc.data()
        const level = skillData.level?.toLowerCase()
        if (level && skillsByLevel[level]) {
          skillsByLevel[level].push({
            skill: skillData.name || 'Unnamed Skill',
            level: level
          })
        }
      })
  
      const datasets = Object.entries(skillsByLevel).map(([level, skills]) => {
        return {
          label: level.charAt(0).toUpperCase() + level.slice(1),
          data: skills.map((skill, index) => ({
            x: Math.random() * 100,
            y: LEVEL_WEIGHTS[level] * 20 + (Math.random() * 10 - 5),
            r: this.getLevelSize(level),
            skill: skill.skill,
            level: level
          })),
          backgroundColor: this.getLevelColor(level),
          borderColor: '#000',
          borderWidth: 1
        }
      })
  
      this.skillsData = {
        datasets: datasets
      }
    }
  }
  </script>
  
  <style scoped>
  .skills-chart-container {
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
    height: 100%;
  }
  
  .skills-chart-container::before {
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
  
  .skills-header {
    margin-bottom: 1.5rem;
    position: relative;
  }
  
  .skills-header h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  .skills-decoration {
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #6366f1);
    border-radius: 2px;
    margin-bottom: 1rem;
  }
  
  .chart-wrapper {
    height: 300px;
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
    .skills-chart-container {
      padding: 1.5rem;
    }
    
    .skills-header h2 {
      font-size: 1.3rem;
    }
    
    .chart-wrapper {
      height: 250px;
    }
  }
  </style>