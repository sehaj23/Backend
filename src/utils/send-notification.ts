import firebase from "./firebase";
import * as admin from 'firebase-admin'

const messaging = firebase.messaging()

const sendNotificationToDevice : (registrationToken: string | string[], payload: admin.messaging.MessagingPayload) => Promise<admin.messaging.MessagingDevicesResponse> =  (registrationToken: string | string[], payload: admin.messaging.MessagingPayload) =>{
    return messaging.sendToDevice(registrationToken, payload)
}

export default sendNotificationToDevice