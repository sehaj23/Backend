import * as admin from 'firebase-admin';
import firebase from "./firebase";

const messaging = firebase.messaging()

const sendNotificationToDevice : (registrationToken: string | string[], payload: admin.messaging.MessagingPayload) => Promise<admin.messaging.MessagingDevicesResponse> =  (registrationToken: string | string[], payload: admin.messaging.MessagingPayload) =>{
    if(registrationToken){
      return messaging.sendToDevice(registrationToken, payload)
    }
    return
  }

export default sendNotificationToDevice