import * as admin from 'firebase-admin';
import firebase from "./firebase";

const messaging = firebase.messaging()

const sendNotificationToDevice : (registrationToken: string | string[], payload: admin.messaging.MessagingPayload) => Promise<admin.messaging.MessagingDevicesResponse> =  (registrationToken: string | string[], payload: admin.messaging.MessagingPayload) =>{
   console.log("*****")
    console.log(registrationToken)
    console.log(payload)
    return messaging.sendToDevice(registrationToken, payload)
}

export default sendNotificationToDevice