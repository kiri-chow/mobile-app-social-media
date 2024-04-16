<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-row>
          <ion-col size="auto">
            <img class="logo" src="@/assets/logo-white.svg" />
          </ion-col>
          <ion-col>
            <ion-title>Stats</ion-title>
          </ion-col>
        </ion-row>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-row>
            <ion-col size="auto">
              <img class="logo" src="@/assets/logo-white.svg" />
            </ion-col>
            <ion-col>
              <ion-title>Stats</ion-title>
            </ion-col>
          </ion-row>
        </ion-toolbar>
      </ion-header>
      <ion-grid>
        <ion-row>
          <ion-col>
            <FollowersChart />
          </ion-col>
        </ion-row>
        <div v-if="isAdmin">
          <ion-row>
            <ion-col>
              <UsersChart />
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <UsersGenderChart />
            </ion-col>
          </ion-row>
        </div>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script setup lang="js">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { userInfo } from '../assets/api/base';
import { ref } from 'vue';
import FollowersChart from '../components/charts/FollowersChart.vue';
import UsersChart from '../components/charts/UsersChart.vue';
import UsersGenderChart from '../components/charts/UsersGenderChart.vue';


const isAdmin = ref(userInfo.role === 'admin');
</script>

<style scoped></style>
