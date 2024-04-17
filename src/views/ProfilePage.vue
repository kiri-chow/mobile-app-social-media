<template>
    <ion-page>
        <ToolbarItem name="Profile"/>
        <ion-content :fullscreen="true">
            <ion-grid>
                <ion-row class="ion-justify-content-center">
                    <ion-col size="12" size-md="6" size-lg="4">
                        <ProfileItem :user="user" :editable="true" />
                    </ion-col>
                </ion-row>
                <ion-row class="ion-justify-content-center" v-for="post in postList">
                    <ion-col size="12" size-md="6" size-lg="4">
                        <PostItem :post="post" :user="user" @updatePost="updateOnePost" />
                    </ion-col>
                </ion-row>
                <ion-row class="end-of-list ion-justify-content-center" :disabled="pending || !isMorePosts"
                    @click="loadMorePost">
                    <ion-spinner color='medium' v-if="pending"></ion-spinner>
                    <ion-text color="medium"> {{ isMorePosts ? 'Click for more posts!!' : 'All posts loaded!!' }}</ion-text>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>
<script setup>
import { IonContent, IonPage, IonCol, IonRow, IonGrid, IonText, IonSpinner } from '@ionic/vue';
import { onMounted, ref, computed } from 'vue';
import { getCurrentUser } from '../assets/api/user';
import { getPostList } from '../assets/api/post';
import ProfileItem from '../components/ProfileItem.vue';
import PostItem from '../components/PostItem.vue';
import ToolbarItem from '../components/ToolbarItem.vue';


const user = ref({});
const postList = ref([]);
const page = ref(1);
const perPage = ref(20);
const maxPage = ref(2);
const isMorePosts = computed(() => page.value < maxPage.value)
const pending = ref(true);

onMounted(async () => {
    // get user info
    user.value = await getCurrentUser();

    // get post list
    reloadPostList();
})


async function getPostByPage() {
    pending.value = true;
    try {
        let data = await getPostList(page.value, perPage.value);
        data = data.result;
        page.value = data.page;
        perPage.value = data.perPage;
        maxPage.value = Math.ceil(data.total / perPage.value);
        return data.data.filter(x => x.user_id === user.value._id);
    } finally {
        pending.value = false;
    }
}

async function reloadPostList() {
    postList.value = await getPostByPage();
}

async function loadMorePost() {
    if (!pending && isMorePosts.value) {
        page.value += 1;
        postList.value = postList.value.concat(await getPostByPage());
    }
}

function updateOnePost(post) {
    const thePost = postList.value.filter((x) => x._id == post._id)[0];
    console.log(post);
    console.log(postList);
    if (thePost) {
        Object.assign(thePost, post);
    }
}

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
