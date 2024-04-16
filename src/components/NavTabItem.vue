<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon :icon="homeSharp" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="search" href="/search">
          <ion-icon :icon="searchSharp" />
          <ion-label>Search</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="Stats" href="/stats">
          <ion-icon :icon="statsChart" />
          <ion-label>Stats</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/profile">
          <ion-icon :icon="person" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="js">
  import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';

  import { searchSharp, homeSharp, statsChart, person } from 'ionicons/icons';

  export default {
    components: { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon },
    data() {
      return {
        searchSharp,
        homeSharp,
        statsChart,
        person,
      };
    },
  };
</script>