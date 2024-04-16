<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-title>Stats</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar color="primary">
          <ion-title size="large">Stats</ion-title>
        </ion-toolbar>
      </ion-header>
      <div id="container">
        <NewPostItem />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { ref, inject } from "vue";
import NewPostItem from '../components/NewPostItem.vue';
import PostItem from '../components/PostItem.vue';


</script>

<style scoped>
</style>
