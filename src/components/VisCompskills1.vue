<template>
    <div class="skills-container">
      <!-- Skill Level Distribution -->
      <div class="skills-card">
        <div class="skills-header">
          <div class="c">
            <h1 class="text-2xl font-bold">Skill level distribution </h1></div>
          <div class="skills-decoration"></div>
        </div>
        <div class="chart-wrapper">
          <canvas ref="skillLevelChart"></canvas>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '@/Firebase/config';
  import { Chart, registerables } from 'chart.js';
  
  Chart.register(...registerables);
  
  export default {
    name: 'SkillsDashboard',
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
        skills: [],
        isLoading: false,
        totalSkills: 0,
        beginnerCount: 0,
        intermediateCount: 0,
        advancedCount: 0,
        expertCount: 0
      };
    },
    methods: {
      async fetchSkills() {
        this.isLoading = true;
        try {
          const userDocRef = doc(db, 'users', this.id);
          const userSnap = await getDoc(userDocRef);
  
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const userSkills = userData.skills || [];
            const fetchedSkills = [];
  
            for (const skill of userSkills) {
              const skillDoc = await getDoc(doc(db, 'skills', skill.id));
              if (skillDoc.exists()) {
                fetchedSkills.push({ id: skill.id, ...skillDoc.data() });
              }
            }
  
            this.skills = fetchedSkills;
            this.computeSkillStats();
            this.renderSkillLevelChart();
          }
        } catch (e) {
          console.error('Error fetching skills:', e);
        } finally {
          this.isLoading = false;
        }
      },
      computeSkillStats() {
        this.totalSkills = this.skills.length;
        this.beginnerCount = this.skills.filter(s => s.level === 'Beginner').length;
        this.intermediateCount = this.skills.filter(s => s.level === 'Intermediate').length;
        this.advancedCount = this.skills.filter(s => s.level === 'Advanced').length;
        this.expertCount = this.skills.filter(s => s.level === 'Expert').length;
      },
      renderSkillLevelChart() {
        const ctx = this.$refs.skillLevelChart.getContext('2d');
        const levelCounts = {
          Beginner: this.beginnerCount,
          Intermediate: this.intermediateCount,
          Advanced: this.advancedCount,
          Expert: this.expertCount
        };
  
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(levelCounts),
            datasets: [{
              label: 'Skill Levels',
              data: Object.values(levelCounts),
              backgroundColor: [
                'rgba(99, 102, 241, 0.8)',  // Beginner - indigo
                'rgba(59, 130, 246, 0.8)',  // Intermediate - blue
                'rgba(16, 185, 129, 0.8)',  // Advanced - emerald
                'rgba(139, 92, 246, 0.8)'   // Expert - purple
              ],
              borderColor: [
                'rgba(99, 102, 241, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(139, 92, 246, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  color: '#475569',
                  font: {
                    size: 12,
                    weight: '600'
                  },
                  padding: 20
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
                cornerRadius: 8
              }
            },
            cutout: '70%'
          }
        });
      }
    },
    watch: {
      id: {
        immediate: true,
        handler() {
          this.fetchSkills();
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .skills-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    width: 100%;
  }
  
  .skills-card {
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
  
  .skills-card::before {
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
  
  .skills-header h3 {
    font-size: 1.25rem;
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
    height: 250px;
    position: relative;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .stat-item {
    background: rgba(241, 245, 249, 0.5);
    border-radius: 0.75rem;
    padding: 1rem;
    text-align: center;
    transition: transform 0.2s ease;
  }
  
  .stat-item:hover {
    transform: translateY(-3px);
  }
  
  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #3b82f6;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }
  
  .text-blue-500 {
    color: #3b82f6;
  }
  
  .text-yellow-500 {
    color: #eab308;
  }
  
  .text-green-500 {
    color: #10b981;
  }
  
  .text-purple-500 {
    color: #8b5cf6;
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
    .skills-container {
      grid-template-columns: 1fr;
    }
    
    .skills-card {
      padding: 1.5rem;
    }
    
    .skills-header h3 {
      font-size: 1.1rem;
    }
    
    .chart-wrapper {
      height: 220px;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
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