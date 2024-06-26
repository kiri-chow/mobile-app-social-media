<script setup lang="js">
import {
  IonContent, IonPage, IonGrid, IonRow, IonCol, IonSearchbar, IonText, IonSpinner,
} from '@ionic/vue';
import { ref, onMounted, computed } from "vue";
import userItem from '../components/userItem.vue';
import { getFollowedSet, getAllUsers, getFollowerSet } from '../assets/api/user';
import ToolbarItem from '../components/ToolbarItem.vue';


const followingsId = ref(new Set());
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
  followedId.value = await getFollowedSet();

  // get following id-s
  followingsId.value = await getFollowerSet();

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
  if (!pending.value && isMoreUsers.value) {
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
    <ToolbarItem name="Search" />
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="6">
            <ion-searchbar v-model="search" @change="reloadUserList" placeholder="Search user..."></ion-searchbar>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" size-md="6" size-lg="3" v-for="user in userList">
            <userItem :user="user" :isFollowed="followedId.has(user._id)" :isFollower="followingsId.has(user._id)" @follow="handleFollowing" @unfollow="handleUnfollowing" />
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