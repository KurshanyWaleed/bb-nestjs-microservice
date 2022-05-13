import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from './utils/bbrains-firebase-adminsdk-uocdn-9bcdbf9ed1.json';

@Injectable()
export class PushNotificationService {
  constructor() {
    console.log('constructor called()');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
    console.log('constructor executed()');
  }
  async send(pushNotificationDTO: any) {
    const { title, body, deviceToken } = pushNotificationDTO;
    const payload = {
      notification: {
        title: 'Check the New activities of THis week ',
        body: '  ',
      },
    };

    Promise.all([await admin.messaging().sendToDevice(deviceToken, payload)]);
    console.log(`${this.send.name} executed with notification payload`);
  }
}
