<template>
  <ion-page>
    <ToolbarItem name="Stats" />
    <ion-content :fullscreen="true">
      <ion-grid class="charts">
        <ion-row class="ion-justify-content-start">
          <ion-col size="12" size-md="6">
            <FollowersChart />
          </ion-col>
        </ion-row>
        <div v-if="isAdmin">
          <ion-row class="ion-justify-content-start">
            <ion-col size="12" size-md="6">
              <UsersChart />
            </ion-col>
            <ion-col size="12" size-md="6">
              <UsersGenderChart />
            </ion-col>
          </ion-row>
        </div>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script setup lang="js">
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { userInfo } from '../assets/api/base';
import { ref } from 'vue';
import FollowersChart from '../components/charts/FollowersChart.vue';
import UsersChart from '../components/charts/UsersChart.vue';
import UsersGenderChart from '../components/charts/UsersGenderChart.vue';
import ToolbarItem from '../components/ToolbarItem.vue';


const isAdmin = ref(userInfo.role === 'admin');
</script>

<style>
.charts ion-card {
  height: 100%;
}
</style>
