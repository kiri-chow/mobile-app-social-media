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

<style scoped></style>
