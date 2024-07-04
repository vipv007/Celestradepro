import { Component, AfterViewInit } from '@angular/core';
import { loadScript } from '@paypal/paypal-js';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.page.html',
  styleUrls: ['./graph.page.scss'],
})
export class GraphPage implements AfterViewInit {
  constructor() { }

  ngAfterViewInit() {
    loadScript({ "clientId": "test" }).then((paypal) => {
      paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [{
              amount: {
                currency_code: 'USD',
                value: '0.01'
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            alert('Transaction completed by ' + details.payer.name.given_name);
          });
        }
      }).render('#paypal-button-container');
    }).catch((err) => {
      console.error('failed to load the PayPal JS SDK script', err);
    });
  }
}
