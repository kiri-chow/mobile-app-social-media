<template>
    <ion-card>
        <ion-grid>
            <ion-row>
                <ion-col offset="1" size="auto">
                    <AvatarItem :user="user" size="large" />
                </ion-col>
                <ion-col class="ion-align-items-center">
                    <ion-row class="ion-text-start ion-justify-content-center ion-align-items-end">
                        <ion-col size="auto">
                            <ion-text color="primary">
                                <h1 class="ion-no-margin">{{ user.username }}</h1>
                            </ion-text>
                        </ion-col>
                        <ion-col class="ion-text-start">
                            <ion-icon class="profile-control" role="button" :color="editing ? 'danger' : 'success'"
                                :icon="createOutline" @click="editing = !editing"></ion-icon>
                        </ion-col>
                        <ion-col class="ion-text-end">
                            <ion-icon id="logout" class="profile-control" role="button" color="danger"
                                :icon="exitOutline"></ion-icon>
                            <ion-alert trigger="logout" header="Log out" message="Do you want to log out?"
                                :buttons="logoutButtons" />
                        </ion-col>
                    </ion-row>
                    <ion-row class="ion-text-start">
                        <ion-text color="medium">
                            {{ user.email }}
                        </ion-text>
                    </ion-row>
                    <ion-row class="ion-text-start text-small">
                        <ion-text color="medium">
                            Join Date {{ createdAt }}
                        </ion-text>
                    </ion-row>
                </ion-col>
            </ion-row>
        </ion-grid>
        <RegisterItem v-if="editing" :userData="user" />
    </ion-card>
</template>
<script setup>
import { IonText, IonIcon, IonGrid, IonRow, IonCol, IonCard } from "@ionic/vue";
import { createOutline, exitOutline } from 'ionicons/icons';
import { computed, defineProps, ref } from "vue";
import AvatarItem from './AvatarItem.vue';
import RegisterItem from "./RegisterItem.vue";
import { logout } from "../assets/api/base";

const props = defineProps({
    user: Object,
    editable: Boolean,
});
const editing = ref(false);
const createdAt = computed(() => {
    return props.user.created_at ? props.user.created_at.split('T')[0] : "";
});

// logout
const logoutButtons = [
    {
        text: 'Cancel',
        role: 'cancel',
    },
    {
        text: 'OK',
        role: 'confirm',
        handler: () => {
            logout();
            location.reload();
        }
    },
];

</script>
<style>
ion-icon.profile-control {
    font-size: 1.3rem;
}

.text-small {
    font-size: small;
}
</style>