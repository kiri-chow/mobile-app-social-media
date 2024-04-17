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
                    <ion-row :class="`ion-align-items-center post-title${size ? '-' + size : ''}`">
                        <ion-col size="auto">
                            <ion-text color="primary">
                                <h5 class="ion-no-margin">{{ creator.username }}</h5>
                            </ion-text>
                        </ion-col>
                        <ion-col size="auto" v-if="isEdited">
                            <ion-text color="medium">edited at</ion-text></ion-col>
                        <ion-col class="ion-text-start ion-align-items-center">
                            <ion-text color="medium"><span>{{ post.modified_at ? post.modified_at.split('.')[0].replace('T',
                                ' ') : '' }}</span></ion-text>
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
                        <ion-col size="auto" class="ion-text-start post-control">
                            <ion-text v-if="editable" :color="isEditing ? 'danger' : 'primary'" class="post-control"
                                @click="isEditing = !isEditing">
                                <ion-icon :icon="isEditing ? close : pencil"></ion-icon>
                                {{ isSubBox ? "" : (isEditing ? "Cancel" : "Edit") }}
                            </ion-text>
                        </ion-col>
                        <ion-col class="ion-text-center">
                            <ion-text @click="toggleReplies" v-if="!isSubBox" color="primary" class="post-control">
                                <ion-icon :icon="replyIcon"></ion-icon>
                                {{ `${isSubBox ? "" : "Reply "}(${replies.length})` }}
                            </ion-text>
                        </ion-col>
                        <ion-col size="auto" class="ion-text-end">
                            <ion-text v-if="editable" color="danger" @click="triggerDelete" class="post-control">
                                <ion-icon :icon="trash"></ion-icon>
                                {{ isSubBox ? "" : "Delete" }}
                            </ion-text>
                        </ion-col>
                    </ion-row>
                </ion-col>
            </ion-row>
            <ion-row v-if="isEditing" class="form-section-start">
                <ion-col>
                    <NewPostItem :user="user" :isSubBox="true" :isEditing="true" :postData="post"
                        @newPost="updateContent" />
                </ion-col>
            </ion-row>
        </ion-grid>
        <!-- replies -->
        <ion-grid class="replies" v-if="isShowingReplies">
            <ion-row class="form-section-start">
                <ion-col>
                    <NewPostItem :user="user" :isSubBox="true" :postData="{ parent_id: post._id }"
                        @newPost="updateReplies" />
                </ion-col>
            </ion-row>
            <ion-row v-for="reply in replies">
                <ion-col>
                    <PostItem :user="user" :post="reply" :isSubBox="true" size="small" @postDeleted="handleDeleteReply"
                        @updatePost="updateOneReply" />
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-card>
</template>
<script setup>
import { IonImg, IonIcon, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonText, alertController } from "@ionic/vue";
import { chatbubbleEllipses, pencil, trash, close, caretUp, chevronCollapseOutline } from 'ionicons/icons';
import { defineProps, defineEmits, computed, ref, onMounted, watch } from "vue";
import { notice } from "../assets/alerts";
import { deletePost, getReplyList } from "../assets/api/post";
import AvatarItem from "./AvatarItem.vue";
import NewPostItem from "./NewPostItem.vue";
import { userInfo } from "../assets/api/base";


const isAdmin = userInfo.role === 'admin';
const props = defineProps({
    user: { type: Object, default: {} },
    post: { type: Object, default: {} },
    isSubBox:
    {
        type: Boolean,
        default: false
    },
    size: {
        type: String,
        default: ""
    },
});
const creator = computed(() => {
    const toReturn = props.post.user ? props.post.user[props.post.user.length - 1] : null;
    return toReturn ? toReturn : {};
});
const isEdited = computed(() => props.post.created_at !== props.post.modified_at);

const editable = computed(() => {
    return props.user._id === props.post.user_id || isAdmin;
})

onMounted(async () => {
    // getReplies(props.post);
    replies.value = props.post.replies;
})


// replies
let isRepliesGot = false;
const replies = ref([]);
const isShowingReplies = ref(false);
const replyIcon = computed(() => isShowingReplies.value ? caretUp : chatbubbleEllipses)

let togglePending = false;

async function toggleReplies() {
    if (!togglePending) {
        togglePending = true;
        try {
            if (!isRepliesGot) {
                await getReplies(props.post);
                isRepliesGot = true;
            }
            isShowingReplies.value = !isShowingReplies.value;
        } finally {
            togglePending = false;
        }
    } else {
        notice("Loading Replies...");
    }
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

function updateOneReply(post) {
    const thePost = replies.value.filter((x) => x._id == post._id)[0];
    if (thePost) {
        Object.assign(thePost, post);
    }
}

watch(() => props.post, async (newValue, oldValue) => {
    await getReplies(newValue);
})

// update the post
const isEditing = ref(false);

// post updated
const emit = defineEmits(['updatePost', 'postDeleted']);

function updateContent(val) {
    isEditing.value = false;
    emit("updatePost", val);
}

// delete a post
const hidden = ref(false);

let isDeleting = false;
async function handleDelete() {
    if (!isDeleting) {
        isDeleting = true;
        try {
            await deletePost(props.post._id);
            notice("Post deleted.");
            emit('postDeleted', props.post);
        } catch (err) {
            notice(err.message);
            console.error(err);
        } finally {
            isDeleting = false;
        }
    }
}

function handleDeleteReply(val) {
    replies.value = replies.value.filter((x) => x._id !== val._id);
}


async function triggerDelete() {
    if (!isDeleting) {
        const alert = await alertController.create({
            header: "Warning",
            message: "Do you want to delete the post?",
            buttons: [
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
            ]
        });
        alert.present();
    } else {
        notice("The post is deleting...");
    }
}
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