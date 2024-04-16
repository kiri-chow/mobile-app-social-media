<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();

onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.push('/login');
  }
})
</script>
<style scoped></style>