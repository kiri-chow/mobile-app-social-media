<script setup lang="js">
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonGrid, IonRow, IonCol, IonSearchbar, IonText, IonSpinner,
} from '@ionic/vue';
import { ref, onMounted, computed } from "vue";
import userItem from '../components/userItem.vue';
import { getFollowed, getAllUsers } from '../assets/api/user';


const followedId = ref(new Set());
const userList = ref([]);
const search = ref("");
const page = ref(1);
const perPage = ref(20);
const maxPage = ref(2);
const isMoreUsers = computed(() => page.value < maxPage.value)
const pending = ref(true);


onMounted(async () => {
  // get followed id-s
  const followed = await getFollowed();
  followedId.value = new Set(followed.map(x => x.user_id));

  // get user list
  reloadUserList();
})

async function getUserByPage() {
  pending.value = true;
  try {
    let data = await getAllUsers(search.value, page.value, perPage.value);
    page.value = data.page;
    perPage.value = data.perPage;
    maxPage.value = Math.ceil(data.total / perPage.value);
    return data.data;
  } finally {
    pending.value = false;
  }
}

async function reloadUserList() {
  userList.value = await getUserByPage();
}

async function loadMoreUser() {
  if (!pending && isMoreUsers.value) {
    page.value += 1;
    userList.value = userList.value.concat(await getUserByPage());
  }
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
            <ion-searchbar v-model="search" @change="reloadUserList" placeholder="Search user..."></ion-searchbar>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" size-md="6" size-lg="3" v-for="user in userList">
            <userItem :user="user" :followedId="followedId" @follow="handleFollowing" @unfollow="handleUnfollowing" />
          </ion-col>
        </ion-row>
        <ion-row class="end-of-list ion-justify-content-center" :disabled="pending || !isMoreUsers" @click="loadMoreUser">
          <ion-spinner color='medium' v-if="pending"></ion-spinner>
          <ion-text color="medium"> {{ isMoreUsers ? 'Click for more users!!' : 'All users loaded!!' }}</ion-text>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>