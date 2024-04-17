<template>
  <form id="loginForm" @submit.prevent="submit">
    <ion-grid>
      <ion-row class="ion-align-items-center">
        <ion-col>
          <!-- name & email -->
          <ion-item>
            <ion-input v-model="user.username" label-placement="floating" required>
              <div slot="label">User Name <ion-text color="danger">*</ion-text></div>
            </ion-input>
          </ion-item>
          <ion-item>
            <ion-input v-model="user.email" label-placement="floating" type="email" required>
              <div slot="label">Email <ion-text color="danger">*</ion-text></div>
            </ion-input>
          </ion-item>
        </ion-col>
        <ion-col size="auto" class="ion-justify-content-center">
          <!-- avatar -->
          <AvatarItem size="large" :user="user" @iconUrl="receiveNewIconUrl" :editable="true" />
        </ion-col>
      </ion-row>
      <!-- names -->
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-input v-model="user.first_name" label-placement="floating" required>
              <div slot="label">First Name <ion-text color="danger">*</ion-text></div>
            </ion-input>
          </ion-item>
        </ion-col>
        <ion-col>
          <ion-item>
            <ion-input v-model="user.last_name" label-placement="floating" required>
              <div slot="label">Last Name <ion-text color="danger">*</ion-text></div>
            </ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-item lines="inset">
            <ion-select placeholder="Your gender" v-model="user.gender">
              <div slot="label">Gender<ion-text color="danger">*</ion-text></div>
              <ion-select-option value="Male">Male</ion-select-option>
              <ion-select-option value="Female">Female</ion-select-option>
              <ion-select-option value="Others">Others</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-col>
      </ion-row>
      <!-- passwords -->
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-input id="password" v-model="user.password" label-placement="floating" type="password"
              :required="!isUpdate">
              <div slot="label">Password <ion-text color="danger" :class="isUpdate ? 'ion-hide' : ''">*</ion-text></div>
            </ion-input>
          </ion-item>
        </ion-col>
        <ion-col>
          <ion-item>
            <ion-input id="password-confirm" v-model="passwordConfirm" label-placement="floating" type="password"
              :required="!isUpdate">
              <div slot="label">Confirm Password <ion-text color="danger" :class="isUpdate ? 'ion-hide' : ''">*</ion-text>
              </div>
            </ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-text v-if="isPasswordMismatch"><ion-text color="danger">*</ion-text>Password mismatch!</ion-text>
        </ion-col>
      </ion-row>
      <ion-row class="ion-justify-content-around">
        <ion-button v-if="isUpdate" color="danger" @click="cancel">Cancel</ion-button>
        <ion-button id="submit" type="submit" :disabled="isPasswordMismatch">
          {{ isUpdate ? "Update" : "Submit" }}
        </ion-button>
      </ion-row>
    </ion-grid>
  </form>
</template>

<script lang="js" setup>
import {
  IonInput, IonButton, IonText, IonSelect, IonSelectOption, IonGrid, IonCol, IonRow, IonItem, loadingController
} from '@ionic/vue';
import { defineProps, onMounted, ref, computed, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import AvatarItem from './AvatarItem.vue';
import { updateUser } from '../assets/api/user';
import { notice } from '../assets/alerts';


const emits = defineEmits(["cancel"]);
const router = useRouter();
const props = defineProps({
  userData: Object,
  isUpdate: { type: Boolean, default: false },
})
const user = ref({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  gender: "Others",
  password: '',
  icon: '',
});
const passwordConfirm = ref("");
const isPasswordMismatch = computed(() => passwordConfirm.value ? passwordConfirm.value !== user.value.password : false)

onMounted(() => {
  if (props.userData) {
    user.value = { ...props.userData };
  }
})

const receiveNewIconUrl = (val) => {
  // get the new icon url
  user.value.icon = val || '';
}

// cancel register
function cancel() {
  emits('cancel', 1);
}

// register & login
async function submit() {
  const loading = await loadingController.create({
    message: props.isUpdate ? "Updating..." : "Registering..."
  });
  loading.present();
  try {
    if (props.isUpdate) {
      await update();
      location.reload();
    } else {
      await register();
    }
    await login();
  } catch (err) {
    showAlert(err.message);
  } finally {
    loading.dismiss();
  }
}


// update
async function update() {
  await updateUser(user.value._id, user.value);
  notice("You're profile is updated");
}

// register
async function register() {
  const url = `/api/register`;
  const response = await fetch(url, { method: "POST", body: JSON.stringify(user.value), headers: { "Content-Type": "application/json" } });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  // register success
  notice('Successed! You are now logging in!');
}

// login
async function login() {
  const url = `/api/login`;
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      username: user.value.username,
      password: user.value.password,
    }),
    headers: { "Content-Type": "application/json" }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  // login success
  localStorage.setItem('token', data.token);
  if (props.isUpdate) {
    location.reload();
  } else {
    router.push("/home")
  }

}
</script>