<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar >
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
        <ion-toolbar >
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
      <div id="container">
        <NewPostItem @newPost="updatePostList" />
        <PostItem v-for="post in postList" :userId="user._id" :post="post" @updatePost="updateOnePost" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { jwtDecode } from "jwt-decode";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/vue';
import { ref, inject, onMounted } from "vue";
import { getPostListDescend } from '../assets/postList';
import NewPostItem from '../components/NewPostItem.vue';
import PostItem from '../components/PostItem.vue';

const user = ref({});
const postList = ref([]);

onMounted(async () => {
  // get user info
  const token = localStorage.getItem('token');
  user.value = jwtDecode(token);

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
