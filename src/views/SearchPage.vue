<script setup>
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonGrid, IonRow, IonCol, IonSearchbar
} from '@ionic/vue';
import { ref, onMounted } from "vue";
import userItem from '../components/userItem.vue';
import { getFollowed, getAllUsers } from '../assets/api/user';
import { popLoading } from '../assets/alerts';


const followedId = ref(new Set());
const userList = ref([]);
const search = ref("");


onMounted(async () => {
  const loading = await popLoading();
  try {
    // get followed id-s
    const followed = await getFollowed();
    followedId.value = new Set(followed.map(x => x.user_id));

    // get user list
    await searchUsers();
  } finally {
    loading.dismiss();
  }
})

async function searchUsers() {
  userList.value = await getAllUsers(search.value);
}

function handleFollowing(id) {
  followedId.value.add(id);
}

function handleUnfollowing(id) {
  followedId.value.delete(id);
}

</script>
<style>
.searchbar-input {
  background: var(--ion-item-background) !important;
}
</style>
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-row>
          <ion-col size="auto">
            <img class="logo" src="@/assets/logo-white.svg" />
          </ion-col>
          <ion-col>
            <ion-title>Search</ion-title>
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
              <ion-title>Search</ion-title>
            </ion-col>
          </ion-row>
        </ion-toolbar>
      </ion-header>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-searchbar v-model="search" @change="searchUsers" placeholder="Search user..."></ion-searchbar>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" size-md="6" size-lg="3" v-for="user in userList">
            <userItem :user="user" :followedId="followedId" @follow="handleFollowing" @unfollow="handleUnfollowing" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>