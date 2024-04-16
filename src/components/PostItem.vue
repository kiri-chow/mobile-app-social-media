<template>
    <ion-card :id="post._id" :class="hidden ? 'ion-hide' : ''">
        <!-- post meta -->
        <ion-grid>
            <ion-row>
                <ion-col size="auto" class="ion-aligin-items-top">
                    <avatar-item :user="creator" size="small" />
                </ion-col>
                <ion-col>
                    <!-- creator and time -->
                    <ion-row class="ion-aligin-items-center">
                        <ion-col size="auto">
                            <h4 class="ion-no-margin">{{ creator.username }}</h4>
                        </ion-col>
                        <ion-col class="ion-text-start ion-aligin-items-center">
                            <ion-text color="medium">{{ postTime }}</ion-text>
                        </ion-col>
                    </ion-row>
                    <!-- post content -->
                    <ion-row>
                        <ion-card-content>
                            {{ post.content }}
                        </ion-card-content>
                        <ion-img v-if="post.image_url" :src="post.image_url" alt="post image" />
                    </ion-row>
                    <!-- control bar -->
                    <ion-row class="ion-justify-content-between">
                        <ion-col class="ion-text-start">
                            <ion-icon class="post-control" :icon="arrowRedoOutline"></ion-icon>
                        </ion-col>
                        <ion-col class="ion-text-center">
                            <ion-icon class="post-control" :icon="brushOutline"></ion-icon>
                        </ion-col>
                        <ion-col class="ion-text-end">
                            <ion-icon :id="`delete-${post._id}`" class="post-control" :icon="closeCircleOutline"></ion-icon>
                        </ion-col>
                    </ion-row>
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-card>
    <!-- alerts -->
    <ion-alert :trigger="`delete-${post._id}`" header="Delete Post" message="Are you sure?" :buttons="deleteButtons"/>
</template>
<script setup>
import { IonImg, IonIcon, IonCard, IonCardContent, IonAlert, toastController } from "@ionic/vue";
import { arrowRedoOutline, brushOutline, closeCircleOutline } from 'ionicons/icons';
import { defineProps, computed, ref } from "vue";
import { deletePost } from "../assets/api/post";
import AvatarItem from "./AvatarItem.vue";

const props = defineProps({
    userId: String,
    post: Object,
});


const creator = computed(() => {
    return props.post.user ? props.post.user[props.post.user.length - 1] : {};
});

const postTime = computed(() => {
    if (!props.post.created_at) {
        return null;
    } else {
        return (props.post.created_at === props.post.modified_at ?
            props.post.created_at : `${props.post.modified_at} edited`
        ).split('.')[0].replace('T', ' ');
    }
})

const editable = computed(() => {
    return props.userId === props.post.user_id;
})

// toast
async function notice(message) {
    const toast = await toastController.create({
        message: message,
        duration: 1500,
        position: 'bottom',
    });
    await toast.present();
}

// delete a post
const hidden = ref(false);

async function handleDelete() {
    try {
        await deletePost(props.post._id);
        notice("Post deleted.");
        hidden.value = true;
    } catch (err) {
        notice(err.message);
        console.error(err);
    }
}

const deleteButtons = [
    {
        text: 'Cancel',
        role: 'cancel',
    },
    {
        text: 'OK',
        role: 'confirm',
        handler: async () => {
            handleDelete();
        },
    },
];

</script>
<style>
ion-icon.post-control {
    font-size: 1.2rem;
}
</style>