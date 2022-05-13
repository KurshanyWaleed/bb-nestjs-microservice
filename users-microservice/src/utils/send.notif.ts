import { NotificationMessagePayload } from './../../node_modules/firebase-admin/lib/messaging/messaging-api.d';
import { Injectable } from '@nestjs/common';
import { NotificationBySegmentBuilder } from 'onesignal-api-client-core';
import { OneSignalService } from 'onesignal-api-client-nest';

@Injectable()
export class OneSignalServices {
  constructor(private readonly oneSignalService: OneSignalService) {}

  async viewNotification() {
    return await this.oneSignalService.viewNotifications({
      limit: 50,
      offset: 0,
      kind: 1,
    });
  }

  async createNotification(message: string, users: any) {
    const input1 = new NotificationBySegmentBuilder()
      .setIncludedSegments(['Active Users', 'Inactive Users'])
      .notification() // .email()
      .setContents({ en: message })
      .build();
    const input = new NotificationBySegmentBuilder()
      .setIncludedSegments(['Active Users', 'Inactive Users'])
      .notification() // .email()
      .setContents({ en: message })
      .build();

    return await this.oneSignalService.createNotification(input);
  }
}
