import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { GooglePayService } from '../services/google-pay.service';

@Component({
  selector: 'app-npcreate',
  templateUrl: './npcreate.page.html',
  styleUrls: ['./npcreate.page.scss'],
})

export class NpcreatePage implements OnInit {

  @ViewChild('googlePayButton', { static: true }) googlePayButton: ElementRef;

  constructor(private googlePayService: GooglePayService) { }

  ngOnInit(): void {
    const button = this.googlePayService.createButton(() => this.onGooglePayButtonClick());
    this.googlePayButton.nativeElement.appendChild(button);
  }

  onGooglePayButtonClick() {
    this.googlePayService.loadPaymentData()
      .then(paymentData => {
        // handle the response
        console.log('Payment successful', paymentData);
      })
      .catch(err => {
        // handle the error
        console.error('Payment failed', err);
      });
  }
}
