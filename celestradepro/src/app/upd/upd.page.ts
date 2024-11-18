import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-upd',
  templateUrl: './upd.page.html',
  styleUrls: ['./upd.page.scss'],
})

export class UpdPage implements OnInit {

  vegForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.vegForm = this.fb.group({
      // Define your form controls here
    });
  }


  ngOnInit() { }

  onSubmit() {
    // Handle form submission
  }
  

 }