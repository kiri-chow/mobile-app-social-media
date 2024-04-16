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
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol } from '@ionic/vue';
import FollowersChart from '../components/charts/FollowersChart.vue';
</script>

<style scoped></style>
