<template>
  <ion-page>
    <ToolbarItem name="Login"/>
    <ion-content :fullscreen="true">
      <ion-card id="container">
          <img src="@/assets/logo.svg" alt="Logo" width="60" height="60" />
          <ion-card-header>
            <ion-text color="primary">
              <h5>
                Login for our incredible social network!
              </h5>
            </ion-text>
          </ion-card-header>
        <ion-grid>
          <ion-row>
            <ion-col>
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
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup >
import {
  IonContent, IonPage, IonSegment, IonSegmentButton, IonLabel,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
  IonText,
} from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import RegisterItem from '../components/RegisterItem.vue';
import LoginItem from '../components/LoginItem.vue';
import ToolbarItem from '../components/ToolbarItem.vue';

const currentSegment = ref('login');

</script>
  
<style scoped>
#container {
  padding-top: 2.5rem;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
  