<template>
  <ion-page>
    <ToolbarItem name="Home" />
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="6" size-lg="4">
            <NewPostItem @newPost="reloadPostList" :user="user" />
          </ion-col>
        </ion-row>
        <ion-row class="ion-justify-content-center" v-for="post in postList">
          <ion-col size="12" size-md="6" size-lg="4">
            <PostItem :post="post" :user="user" @updatePost="updateOnePost" @postDeleted="handleDelete" />
          </ion-col>
        </ion-row>
        <ion-row class="end-of-list ion-justify-content-center" :disabled="pending || !isMorePosts" @click="loadMorePost">
          <ion-spinner color='medium' v-if="pending"></ion-spinner>
          <ion-text color="medium"> {{ isMorePosts ? 'Click for more posts!!' : 'All posts loaded!!' }}</ion-text>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script setup lang="js">
import { IonGrid, IonRow, IonCol, IonText, IonContent, IonPage, IonSpinner } from '@ionic/vue';
import { ref, onMounted, computed } from "vue";
import { getPostList } from '../assets/api/post';
import { getCurrentUser } from '../assets/api/user';
import ToolbarItem from '../components/ToolbarItem.vue';
import NewPostItem from '../components/NewPostItem.vue';
import PostItem from '../components/PostItem.vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const user = ref({});
const postList = ref([]);
const page = ref(1);
const perPage = ref(20);
const maxPage = ref(2);
const isMorePosts = computed(() => page.value < maxPage.value)
const pending = ref(true);

onMounted(async () => {
  // get user info
  try {
    user.value = await getCurrentUser();
  } catch (err) {
    if (!localStorage.getItem('token')) {
      router.replace('/login');
    } else if (err.message === 'Invalid or missing token') {
      location.reload();
    }
  }

  // get post list
  reloadPostList();
})


function handleDelete(val) {
  postList.value = postList.value.filter((x) => x._id !== val._id);
}

async function getPostByPage() {
  pending.value = true;
  try {
    let data = await getPostList(page.value, perPage.value);
    data = data.result;
    page.value = data.page;
    perPage.value = data.perPage;
    maxPage.value = Math.ceil(data.total / perPage.value);
    return data.data;
  } finally {
    pending.value = false;
  }
}

async function reloadPostList() {
  postList.value = await getPostByPage();
}

async function loadMorePost() {
  if (!pending.value && isMorePosts.value) {
    page.value += 1;
    postList.value = postList.value.concat(await getPostByPage());
  }
}

function updateOnePost(post) {
  const thePost = postList.value.filter((x) => x._id == post._id)[0];
  if (thePost) {
    Object.assign(thePost, post);
  }
}
</script>