<template>
    <ion-card>
        <ion-card-header>
            <ion-row>
                <ion-col>
                    <h5 color='dark' class="card-title ion-no-margin">
                        {{ `${isEditing ? "Update" : "New"} ${post.parent_id ? "Reply" : "Post"}` }}
                    </h5>
                </ion-col>
                <ion-col class="new-post-control" size="auto">
                    <ion-row>
                        <ion-spinner color="warning" v-if="emojiPending"></ion-spinner>
                        <ion-text v-else role="button" color="warning" @click="suggestEmoji">
                            <ion-icon :icon="sparkles"></ion-icon>
                            {{ isSubBox ? '' : 'Emoji Sugg' }}</ion-text>
                    </ion-row>
                </ion-col>
            </ion-row>
            <ion-text>
            </ion-text>
        </ion-card-header>
        <ion-card-content>
            <form @submit.prevent="submitPost">
                <textarea v-model="post.content" class="form-control" :required="!post.image_url" :auto-grow="true"
                    placeholder="Say something..." fill="outline"></textarea>
                <img v-if="post.image_url" :src="post.image_url" />
                <ion-row class="ion-align-items-center ion-justify-content-between new-post-control">
                    <ion-text @click="uploadImage" :color="post.image_url ? 'danger' : ''" class="new-post-control"
                        role="button">
                        <ion-icon :icon="imageIcon" />
                        {{ isSubBox ? '' : imageText }}
                    </ion-text>
                    <input type="file" ref="fileInput" accept="image/*" class="ion-hide" @change="handleFileUpload" />
                    <ion-button type="submit">
                        <ion-spinner class="ion-text-start" v-if="isPending"></ion-spinner>
                        {{ isEditing ? "Update" : "Submit" }}
                    </ion-button>
                </ion-row>
            </form>
        </ion-card-content>
    </ion-card>
</template>
<script setup>
import { IonIcon, IonCard, IonCardContent, IonSpinner, IonRow, IonText, IonCardHeader, IonButton, alertController, IonCol } from "@ionic/vue";
import { cloudUploadOutline, closeOutline, sparkles } from 'ionicons/icons';
import { defineProps, computed, ref, defineEmits, onMounted } from "vue";
import { createPost, updatePost } from "../assets/api/post";

const emit = defineEmits(['newPost']);
const props = defineProps({
    postData: {
        type: Object,
        default: {},
    },
    isEditing: {
        type: Boolean,
        default: false,
    },
    isSubBox: {
        type: Boolean,
        default: false,
    },
    user: Object,
});
const post = ref({
    content: "",
});
const isPending = ref(false);
const imageIcon = computed(() => post.value.image_url ? closeOutline : cloudUploadOutline);
const imageText = computed(() => `${post.value.image_url ? 'Remove' : 'Upload'} Image`);

onMounted(() => {
    if (props.postData) {
        post.value = {...post.value, ...props.postData};
    }
});

// submit post
async function submitPost() {
    isPending.value = true;
    let data
    try {
        if (props.isEditing) {
            data = await updatePost(post.value._id, post.value);
        } else {
            data = await createPost(post.value, post.value.parent_id);
        }
        // update post info
        if (data.id) {
            post.value._id = data.id;
        }
        post.value.user = [props.user];
        post.value.user_id = props.user._id;

        emit('newPost', {...post.value});

        // clean up
        post.value.content = '';
        delete post.value._id;
    } catch (err) {
        console.error(err);
        const alert = await alertController.create({
            message: err.message,
            buttons: ['OK'],
        })
        alert.present();
    } finally {
        isPending.value = false;
    }
}

// upload image
const fileInput = ref("");

function uploadImage() {
    if (post.value.image_url) {
        delete post.value.image_url;
    } else {
        fileInput.value.click();
    }
}

// read & check & upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            post.value.image_url = reader.result;
        };
        reader.readAsDataURL(file);
    }
}

// emoji suggestion
const emojiPending = ref(false);

async function suggestEmoji() {
    if (post.value.content) {
        emojiPending.value = true;
        try {
            const res = await fetch(`/api/posts/emoji?content=${post.value.content}&size=1`);
            const json = await res.json();
            const emoji = json.emoji[0];
            post.value.content = `${post.value.content}${emoji}`;
        } finally {
            emojiPending.value = false;
        }
    }
}

</script>
<style>
textarea.form-control {
    border-radius: 0.4rem;
    border-style: solid;
    border-color: var(--ion-color-medium);
    width: 100%;
    min-height: calc(1.5em + 0.75rem + calc(var(--bs-border-width) * 2));
}

ion-spinner {
    margin-right: 1rem;
}

.card-title {
    font-weight: bold;
}

ion-row.new-post-control {
    margin-top: 2px;
}

.new-post-control {
    font-size: 1rem;
}

.new-post-control ion-text {
    margin-left: 1px;
}

.new-post-control ion-icon {
    font-size: 1.2rem;
    vertical-align: middle
}
</style>