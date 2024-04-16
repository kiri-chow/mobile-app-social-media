<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue';
import { IonCard, IonRow, IonCol, IonIcon, IonButton, IonText, IonSpinner } from '@ionic/vue';
import { personAdd, personRemove } from 'ionicons/icons';
import { userInfo } from '../assets/api/base';
import { followUser, unfollowUser } from '../assets/api/user';
import { popAlert } from '../assets/alerts';
import AvatarItem from './AvatarItem.vue';


const pending = ref(false);
const props = defineProps({
    user: Object,
    followedId: Set,
});
const buttonType = computed(() => {
    if (props.user._id === userInfo._id) {
        return 0;
    } else if (props.followedId.has(props.user._id)) {
        return -1;
    } else {
        return 1;
    }
});

const emit = defineEmits(['follow', 'unfolllow']);

async function followOrUnfollow() {
    const id = props.user._id;
    pending.value = true;
    try {
        if (buttonType.value === 1) {
            await followUser(id);
            emit('follow', id);
        } else if (buttonType.value === -1) {
            await unfollowUser(id);
            emit('unfollow', id);
        }
    } catch (err) {
        popAlert(err.message);
        console.error(err);
    } finally {
        pending.value = false;
    }
}
</script>
<template>
    <IonCard class="user">
        <ion-row class="ion-align-items-center">
            <ion-col size='auto'>
                <AvatarItem size="small" :user="user" />
            </ion-col>
            <ion-col>
                <ion-text color="primary">
                    <h4 class="ion-no-margin">{{ [user.first_name, user.last_name].join(' ') }}</h4>
                </ion-text>
                <ion-text color="medium">@{{ user.username }}</ion-text>
            </ion-col>
            <ion-col size='auto'>
                <ion-button @click="followOrUnfollow" v-if="buttonType !== 0" :color="buttonType === 1 ? 'primary' : 'danger'"
                    :disabled="pending">
                    <ion-spinner class="btn-icon" v-if="pending"></ion-spinner>
                    <ion-icon class="btn-icon" v-else :icon="buttonType === 1 ? personAdd : personRemove"></ion-icon>
                </ion-button>
            </ion-col>
        </ion-row>
    </IonCard>
</template>
<style>
ion-spinner {
    margin-right: 0;
}

.btn-icon {
    font-size: 1.5rem;
    width: 1.5rem;
    height:1.5rem;
}
</style>