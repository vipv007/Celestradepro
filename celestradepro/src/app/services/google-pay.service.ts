// src/app/services/google-pay.service.ts
import { Injectable } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GooglePayService {
  paymentsClient: any;

  constructor() {
    this.initPaymentsClient();
  }

  initPaymentsClient() {
    this.paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });
  }

  getGooglePayConfiguration() {
    return {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [{
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA']
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            'gateway': 'example',
            'gatewayMerchantId': 'exampleGatewayMerchantId'
          }
        }
      }],
      merchantInfo: {
        merchantId: '01234567890123456789',
        merchantName: 'Example Merchant'
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: '1.00',
        currencyCode: 'USD',
        countryCode: 'US'
      }
    };
  }

  createButton(onClick: () => void) {
    const button = this.paymentsClient.createButton({ onClick });
    return button;
  }

  loadPaymentData() {
    const paymentDataRequest = this.getGooglePayConfiguration();
    return this.paymentsClient.loadPaymentData(paymentDataRequest);
  }
}
