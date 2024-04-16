<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { ref, provide, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser } from './assets/api/user';


const router = useRouter();
const userId = ref("");
provide('userId', userId.value);


</script>
<style scoped>
</style>