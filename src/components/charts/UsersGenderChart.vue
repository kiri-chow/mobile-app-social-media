<template>
    <ion-card>
        <ion-card-header>
            <h5>Users Gender Distribution</h5>
        </ion-card-header>
        <ion-card-content class="chart-pie">
            <apexchart type="polarArea" :options="options" :series="series" />
        </ion-card-content>
    </ion-card>
</template>
<script setup>
  import { ref, onMounted } from "vue";
  import { getUserGenderStats } from "../../assets/api/stats";
  import { IonCard, IonCardContent, IonCardHeader } from "@ionic/vue";


  const options = ref({});
  const series = ref([]);

  onMounted(() => {
    loadAsyncData();
  });

  const loadAsyncData = () => {
    getUserGenderStats()
      .then((result) => {
        let labels = result.map(item => item._id);
        let seriesValue = result.map(item => item.count);
        setChartData(labels, seriesValue);
      })
      .catch((error) => {
        series.value = [];
        options.value = {};
        throw error;
      });
  };

  const setChartData = (labels, seriesValue) => {
    series.value = seriesValue;
    options.value = {
      chart: {
        type: 'polarArea',
        toolbar: {
          show: false
        },
        height: "100%"
      },
      labels: labels,
      stroke: {
        colors: ['#fff']
      },
      tooltip: {
        x: {
          formatter: function (val) {
            return parseInt(val).toString();
          }
        },
        y: {
          formatter: function (val) {
            return parseInt(val).toString();
          }
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toFixed(2) + "%"
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val.toFixed(0);
          }
        },
      },
      responsive: [{
        breakpoint: 576,
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  }
</script>