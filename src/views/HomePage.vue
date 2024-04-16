<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-row>
          <ion-col size="auto">
            <img class="logo" src="@/assets/logo-white.svg" />
          </ion-col>
          <ion-col>
            <ion-title>Home</ion-title>
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
              <ion-title>Home</ion-title>
            </ion-col>
          </ion-row>
        </ion-toolbar>
      </ion-header>
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="6" size-lg="4">
            <NewPostItem @newPost="updatePostList" />
          </ion-col>
        </ion-row>
        <ion-row class="ion-justify-content-center" v-for="post in postList">
          <ion-col size="12" size-md="6" size-lg="4">
            <PostItem :post="post" :user="user" @updatePost="updateOnePost" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonGrid, IonRow, IonCol, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/vue';
import { ref, onMounted } from "vue";
import { getPostListDescend } from '../assets/postList';
import { getCurrentUser } from '../assets/api/user';
import { popLoading } from '../assets/alerts';
import NewPostItem from '../components/NewPostItem.vue';
import PostItem from '../components/PostItem.vue';


const user = ref({});
const postList = ref([]);

onMounted(async () => {
  // get user info
  user.value = await getCurrentUser();

  // get post list
  updatePostList();
})

async function updatePostList() {
  postList.value = await getPostListDescend();
}

function updateOnePost(post) {
  const thePost = postList.value.filter((x) => x._id == post._id)[0];
  if (thePost) {
    Object.assign(thePost, post);
  }

}

</script>

<style scoped></style>
