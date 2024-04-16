<template>
    <ion-card>
        <ion-card-header>
            <ion-text>
                <h5 color='dark' class="card-title ion-no-margin">
                    {{ `${editing ? "Update" : "New"} ${post.parent_id ? "Reply" : "Post"}` }}
                </h5>
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
                        {{ imageText }}
                    </ion-text>
                    <input type="file" ref="fileInput" accept="image/*" class="ion-hide" @change="handleFileUpload" />
                    <ion-button type="submit">
                        <ion-spinner class="ion-text-start" v-if="posting"></ion-spinner>
                        {{ editing ? "Update" : "Submit" }}
                    </ion-button>
                </ion-row>
            </form>
        </ion-card-content>
    </ion-card>
</template>
<script setup>
import { IonIcon, IonCard, IonCardContent, IonSpinner, IonRow, IonText, IonCardHeader, IonButton, alertController } from "@ionic/vue";
import { cloudUploadOutline, closeOutline } from 'ionicons/icons';
import { defineProps, computed, ref, defineEmits, onMounted } from "vue";
import { createPost, updatePost } from "../assets/api/post";

const emit = defineEmits(['newPost']);
const props = defineProps({
    postData: Object,
    editing: Boolean,
    user: Object,
});
const post = ref({
    content: "",
});
const posting = ref(false);
const imageIcon = computed(() => post.value.image_url ? closeOutline : cloudUploadOutline);
const imageText = computed(() => `${post.value.image_url ? 'Remove' : 'Upload'} Image`);

onMounted(() => {
    if (props.postData) {
        post.value = Object.assign({}, props.postData);
    }
});

// submit post
async function submitPost() {
    posting.value = true;
    let data
    try {
        if (props.editing) {
            data = await updatePost(post.value._id, post.value);
        } else {
            data = await createPost(post.value, post.value.parent_id);
        }
        post.value._id = data.id;
        post.value.user = [props.user];
        emit('newPost', post.value);
        post.value = { content: '' };
    } catch (err) {
        print(err);
        const alert = await alertController.create({
            message: err.message,
            buttons: ['OK'],
        })
        alert.present();
    } finally {
        posting.value = false;
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
    margin-right: 0.8rem;
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

.new-post-control ion-icon {
    font-size: 1.2rem;
    vertical-align: middle
}
</style>