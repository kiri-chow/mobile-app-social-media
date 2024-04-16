<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar >
                <ion-row>
                    <ion-col size="auto">
                        <img class="logo" src="@/assets/logo-white.svg" />
                    </ion-col>
                    <ion-col>
                        <ion-title>Profile</ion-title>
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
                            <ion-title>Profile</ion-title>
                        </ion-col>
                    </ion-row>
                </ion-toolbar>
            </ion-header>
            <ProfileItem :user="user" :editable="true" />
            <PostItem v-for="post in postList" :userId="user._id" :post="post" />
        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCol, IonRow } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser } from '../assets/api/user';
import { getPostListDescend } from '../assets/postList';
import ProfileItem from '../components/ProfileItem.vue';
import PostItem from '../components/PostItem.vue';

const router = useRouter();
const user = ref({});
const postList = ref([])

onMounted(async () => {
    // get userId
    user.value = await getCurrentUser();

    // get user's posts
    postList.value = await getPostListDescend();
});
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
