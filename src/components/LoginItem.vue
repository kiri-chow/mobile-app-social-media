<template>
  <form id="loginForm" @submit.prevent="submitForm">
    <ion-grid>
      <ion-row>
        <ion-col>


          <ion-item>
            <ion-input v-model="loginData.username" label-placement="floating" required>
              <div slot="label">User Name <ion-text color="danger">*</ion-text></div>
            </ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-input id="password" v-model="loginData.password" label-placement="floating" type="password" required>
              <div slot="label">Password <ion-text color="danger">*</ion-text></div>
            </ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-button id="submit" type="submit" :disabled="isDisabled">Submit</ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </form>
</template>

<script lang="js" setup>
import { IonInput, IonItem, IonButton, IonText, loadingController, alertController, IonGrid, IonCol, IonRow } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const loginData = ref({
  username: '',
  password: ''
});
const isDisabled = ref(false); // computed(() => !(loginData.value.password && loginData.value.username))

async function submitForm() {
  const loading = await loadingController.create({ message: "Logging in..." });
  loading.present();
  try {
    // register
    const url = `/api/login`;
    const response = await fetch(url, { method: "POST", body: JSON.stringify(loginData.value), headers: { "Content-Type": "application/json" } });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    // register success
    localStorage.setItem('token', data.token);
    router.push('/home');

  } catch (err) {
    showAlert(err.message);
  } finally {
    loading.dismiss();
  }

  async function showAlert(message) {
    const alert = await alertController.create({
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}

</script>