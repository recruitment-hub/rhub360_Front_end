import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  emailId: any;
  res: any;
  clicked = false;
  private _success = new Subject<string>();
  successMessage = '';
  staticAlertClosed = false;
  constructor(public httpService: CommonService) {

  }
  public ngForm = new FormGroup({
    email: new FormControl('', Validators.required),
    check: new FormControl('')
  })

  ngOnInit(): void {
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = '');
  }

  registerSubmit() {
    console.log("check", this.ngForm.value.check);
    this.emailId = this.ngForm.value.email;
    const obj = {
      email: this.ngForm.value.email,
      //verifiedLink: `http://localhost:4200/#/emailvalidate?email=${this.emailId}`
      verifiedLink: `http://app.recruitment-hub.s3-website.us-east-2.amazonaws.com/#/emailvalidate?email=${this.emailId}`,
    };

    this.emailId = this.ngForm.value.email.toString();
    this.httpService.post(`recruiter/verifyEmail`, obj).subscribe((res: any) => {
      if (res.status === '7400') {
        this.emailId = res.email;
        sessionStorage.setItem('email', this.emailId);
        console.log("res", res);
        this._success.next('Successfully Registered');
        //this.successMessage = res.message
        //alert("Successfully Registered");
      }
      else {
        this._success.next("Email already Registered. You can Login directly");
      }

    })
  }
}
