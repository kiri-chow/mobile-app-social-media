<template>
    <ion-card>
        <ion-card-header>
            <h5>Users Trends</h5>
        </ion-card-header>
        <ion-card-content>
            <apexchart type="line" :options="options" :series="series" />
        </ion-card-content>
    </ion-card>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { getUserStats } from "../../assets/api/stats";
import { IonCard, IonCardContent, IonCardHeader } from "@ionic/vue";

const options = ref({});
const series = ref([]);

onMounted(() => {
    loadAsyncData();
});

const loadAsyncData = () => {
    getUserStats()
        .then((result) => {
            let labels = result.map(item => item._id);
            let countList = result.map(item => item.count);
            let cumulativeSum = 0;
            const cumulativeList = countList.map((value) => {
                cumulativeSum += value;
                return cumulativeSum;
            });
            let seriesValue = [{
                name: "Users",
                data: countList
            }];
            let total = countList.reduce((sum, value) => sum + value, 0);
            setChartData(labels, seriesValue, total);
        })
        .catch((error) => {
            series.value = [];
            options.value = {};
            throw error;
        });
};

const setChartData = (labels, seriesValue, total) => {
    series.value = seriesValue;
    options.value = {
        chart: {
            type: 'line',
            toolbar: {
                show: false
            },
        },
        stroke: {
            curve: 'smooth'
        },
        subtitle: {
            text: "Users: " + total,
            align: 'center',
            margin: 50,
            style: {
                color: '#222',
                fontSize: '24px',
            }
        },
        xaxis: {
            categories: labels,
        },
        yaxis: {
            min: 0,
            stepSize: 1,
            labels: {
                formatter: function (value) {
                    return parseInt(value).toString();
                },
            },
        },
    };
}
</script>