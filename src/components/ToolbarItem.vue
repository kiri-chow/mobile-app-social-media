<template>
    <ion-header :translucent="translucent">
        <ion-toolbar ref="toolbar">
            <ion-row class="ion-justify-content-center">
                <ion-col size="auto">
                    <img class="logo" src="@/assets/logo-white.svg" id="about-us" />
                </ion-col>
                <ion-col>
                    <ion-title class="header-name">{{ name }}</ion-title>
                </ion-col>
            </ion-row>
        </ion-toolbar>
        <ion-alert trigger="about-us" header="About Group K" :buttons="['OK']" :inputs="groupMembers" />
    </ion-header>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { IonHeader, IonToolbar, IonRow, IonCol, IonTitle, createGesture, IonAlert } from '@ionic/vue';


const toolbar = ref();
const props = defineProps({
    name: {
        type: String,
        requierd: true,
    },
    translucent: {
        type: Boolean,
        default: false,
    }
});
const DOUBLE_CLICK_THRESHOLD = 500;
let lastOnStart = 0;


onMounted(() => {
    const gesture = createGesture({
        el: toolbar.value.$el,
        threshold: 0,
        gestureName: 'doubleClickForReload',
        onStart,
    });
    gesture.enable();
});

// double click for reload
function onStart() {
    const now = Date.now();

    if (Math.abs(now - lastOnStart) <= DOUBLE_CLICK_THRESHOLD) {
        // double click for reload
        location.reload();
        lastOnStart = 0;
    } else {
        lastOnStart = now;
    }
};

const groupMembers = [
    {
        value: 'Kwok Pui Hei - Web',
        disabled: true,
    },
    {
        value: 'Zhou Huisheng - Mobile',
        disabled: true,
    },
    {
        value: 'Lam Wai Hung - Backend',
        disabled: true,
    }
]
</script>