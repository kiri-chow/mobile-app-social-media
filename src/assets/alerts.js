import { alertController, toastController, loadingController } from "@ionic/vue";


export async function popAlert(message) {
    const ionAlert = await alertController.create({
        message: message,
        buttons: ["OK"],
    });
    ionAlert.present();
    return ionAlert;
}


export async function notice(message) {
    const toast = await toastController.create({
        message: message,
        duration: 1500,
        position: 'bottom',
    });
    await toast.present();
    return toast;
}


export async function popLoading(message='Loading...') {
    const loading = await loadingController.create({
        message: message,
    });
    await loading.present();
    return loading;
}