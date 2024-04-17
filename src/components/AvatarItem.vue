<template>
    <div>
        <ion-icon v-if="editable && iconUrl" class="a-del-btn" color="danger" role="img" :icon="closeCircle" @click="removeImage" />
        <ion-avatar class="avatar" :class="`a-${size}`">
            <div v-if="editable" class="hover-layer">
                <ion-icon color="primary" :icon="arrowUpOutline" @click="uploadImage"></ion-icon>
                <input type="file" ref="fileInput" accept="image/*" class="ion-hide" @change="handleFileUpload" />
            </div>
            <img v-if="iconUrl" alt="avatar" :src="iconUrl" />
            <ion-row  v-else>
                <ion-col class="a-init" :class="`a-${size}`">
                    {{ initials }}
                </ion-col>
            </ion-row>
        </ion-avatar>

    </div>
</template>
<script setup>
import { defineProps, onMounted, ref, defineEmits, computed, watch } from "vue";
import { IonAvatar, IonButton, IonIcon } from '@ionic/vue';
import { closeCircle, arrowUpOutline } from "ionicons/icons"

const props = defineProps({
    user: Object,
    size: String,
    editable: Boolean,
});
const initials = computed(() => {
    if (props.user.username) {
        const firstChar = props.user.username.charAt(0);
        return firstChar.toUpperCase();
    }
});
const iconUrl = ref("");
const fileInput = ref(null);
const emit = defineEmits(['iconUrl']);


onMounted(() => {
    getIconUrl(props.user);
})

watch(() => props.user, (newValue, oldValue) => {
    getIconUrl(newValue);
})

// set iconUrl
function getIconUrl(user) {
    iconUrl.value = user.icon ? user.icon : "";
}

// remove avatar
function removeImage() {
    iconUrl.value = "";
    emit('iconUrl', iconUrl.value);
}

// upload avatar
function uploadImage() {
    fileInput.value.click();
}

// read & check & upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            iconUrl.value = reader.result;
            // update for parent
            emit('iconUrl', iconUrl.value);
        };
        reader.readAsDataURL(file);
    }
}

</script>

<style>
.avatar {
    background-color: var(--ion-color-medium-tint);
}

.avatar .a-init {
    color: #ffffff;
    text-align: center;
}

.avatar.a-small {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
}

.avatar.a-medium {
    width: 3.25rem;
    height: 3.25rem;
    font-size: 2.25rem;
}

.avatar.a-large {
    width: 5rem;
    height: 5rem;
    font-size: 3rem;
}

.hover-layer {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(100, 100, 100, 0.1);
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 2.25rem;
    font-weight: bold;
}

.a-del-btn {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 1.2rem;
}

.hover-layer:hover {
    opacity: 0.7;
}
</style>