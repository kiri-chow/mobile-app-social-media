<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar color="primary">
                <ion-title>Login</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar color="primary">
                    <ion-title size="large">Login</ion-title>
                </ion-toolbar>
            </ion-header>
            <div id="container">
                <img src="@/assets/logo.svg" alt="Logo" width="50" height="50" />
                <ion-segment v-model="currentSegment">
                    <ion-segment-button value="login">
                        <ion-label>Login</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="register">
                        <ion-label>Register</ion-label>
                    </ion-segment-button>
                </ion-segment>
                <LoginItem v-if="currentSegment === 'login'" />
                <RegisterItem v-else />
            </div>
        </ion-content>
    </ion-page>
</template>
  
<script setup >
import { IonContent, IonHeader, IonPage, IonTitle,
    IonToolbar, IonSegment, IonSegmentButton,
 } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import RegisterItem from '../components/RegisterItem.vue';
import LoginItem from '../components/LoginItem.vue';

const currentSegment = ref('login');

</script>
  
<style scoped>
#container {
    text-align: center;

    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}

#container strong {
    font-size: 20px;
    line-height: 26px;
}

#container p {
    font-size: 16px;
    line-height: 22px;

    color: #8c8c8c;

    margin: 0;
}

#container a {
    text-decoration: none;
}
</style>
  