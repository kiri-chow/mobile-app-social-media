<template>
    <ion-card :id="post._id" :class="hidden ? 'ion-hide' : ''">
        <!-- post meta -->
        <ion-grid>
            <ion-row>
                <ion-col size="auto">
                    <avatar-item :user="creator" size="small" />
                </ion-col>
                <ion-col>
                    <!-- creator and time -->
                    <ion-row :class="`ion-align-items-center post-title${size? '-' + size : ''}`">
                        <ion-col size="auto">
                            <ion-text color="primary">
                                <h5 class="ion-no-margin">{{ creator.username }}</h5>
                            </ion-text>
                        </ion-col>
                        <ion-col class="ion-text-start ion-align-items-center">
                            <ion-text color="medium"><span>{{ postTime }}</span></ion-text>
                        </ion-col>
                    </ion-row>
                    <!-- post content -->
                    <ion-row>
                        <ion-card-content>
                            {{ post.content }}
                        </ion-card-content>
                    </ion-row>
                    <ion-row v-if="post.image_url">
                        <ion-col>
                            <ion-img :src="post.image_url" alt="post image" />
                        </ion-col>
                    </ion-row>
                    <!-- control bar -->
                    <ion-row class="ion-justify-content-between post-control">
                        <ion-col class="ion-text-start post-control">
                            <ion-text v-if="editable" :color="editing ? 'danger' : 'primary'" class="post-control"
                                @click="editing = !editing">
                                <ion-icon :icon="editing ? close : pencil"></ion-icon>
                                {{ dontShowText ? "" : (editing ? "Cancel" : "Edit") }}
                            </ion-text>
                        </ion-col>
                        <ion-col class="ion-text-center">
                            <ion-text @click="toggleReplies" color="primary" class="post-control">
                                <ion-icon :icon="replyIcon"></ion-icon>
                                {{ `${dontShowText ? "" : "Reply "}(${replies.length})` }}
                            </ion-text>
                        </ion-col>
                        <ion-col class="ion-text-end">
                            <ion-text v-if="editable" color="danger" :id="`delete-${post._id}`" class="post-control">
                                <ion-icon :icon="trash"></ion-icon>
                                {{ dontShowText ? "" : "Delete" }}
                            </ion-text>
                        </ion-col>
                    </ion-row>
                </ion-col>
            </ion-row>
            <ion-row v-if="editing" class="form-section-start">
                <ion-col>
                    <NewPostItem :user="user" :editing="true" :postData="post" @newPost="updateContent" />
                </ion-col>
            </ion-row>
        </ion-grid>
        <ion-grid class="replies" v-if="isShowingReplies">
            <ion-row class="form-section-start">
                <ion-col>
                    <NewPostItem :user="user" :postData="{ parent_id: post._id }" @newPost="updateReplies" />
                </ion-col>
            </ion-row>
            <ion-row v-for="reply in replies">
                <ion-col>
                    <PostItem :user="user" :post="reply" :dontShowText="true" size="small" />
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-card>
    <!-- alerts -->
    <ion-alert v-if="editing" :trigger="`delete-${post._id}`" header="Delete Post" message="Are you sure?"
        :buttons="deleteButtons" />
</template>
<script setup>
import { IonImg, IonIcon, IonCard, IonCardContent, IonAlert, IonGrid, IonRow, IonCol, IonText, IonItem } from "@ionic/vue";
import { chatbubbleEllipses, pencil, trash, close, caretUp } from 'ionicons/icons';
import { defineProps, defineEmits, computed, ref, onMounted, watch } from "vue";
import { notice } from "../assets/alerts";
import { deletePost, getReplyList } from "../assets/api/post";
import AvatarItem from "./AvatarItem.vue";
import NewPostItem from "./NewPostItem.vue";
import { userInfo } from "../assets/api/base";


const isAdmin = userInfo.role === 'admin';
const props = defineProps({
    user: Object,
    post: Object,
    dontShowText: Boolean,
    size: String,
});
const creator = computed(() => {
    return props.post.user ? props.post.user[props.post.user.length - 1] : {};
});
const postTime = computed(() => {
    if (!props.post.created_at) {
        return null;
    } else {
        return (props.post.created_at === props.post.modified_at ?
            props.post.created_at : `edited at ${props.post.modified_at}`
        ).split('.')[0].replace('T', ' ');
    }
})
const editable = computed(() => {
    return props.user._id === props.post.user_id || isAdmin;
})

onMounted(async () => {
    getReplies(props.post);
})


// replies
const replies = ref([]);
const isShowingReplies = ref(false);
const replyIcon = computed(() => isShowingReplies.value ? caretUp : chatbubbleEllipses)

function toggleReplies() {
    isShowingReplies.value = !isShowingReplies.value;
}

async function getReplies(post) {
    try {
        const data = await getReplyList(post._id);
        replies.value = data.replies;
    } catch (err) {
        notice(err.message);
        console.error(err);
    }
}

async function updateReplies(val) {
    replies.value = [val].concat(replies.value);
}

watch(() => props.post, async (newValue, oldValue) => {
    await getReplies(newValue);
})

// update the post
const editing = ref(false);

// post updated
const emit = defineEmits(['updatePost']);
function updateContent(val) {
    editing.value = false;
    emit("updatePost", val);
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
.post-title-small h5 {
    font-size: medium;
}

.post-title-small span {
    font-size: small;
}

.post-control {
    margin-top: 0;
}

ion-icon.post-control {
    font-size: 1.2rem;
}

ion-card {
    padding: 2px;
}

ion-card ion-card {
    padding: 0px;
    border: 0;
    box-shadow: unset;
}

.form-section-start {
    border-top: 1px solid var(--ion-color-light-shade);
}
</style>