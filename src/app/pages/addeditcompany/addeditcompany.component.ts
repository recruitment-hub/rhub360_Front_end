import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-addeditcompany',
  templateUrl: './addeditcompany.component.html',
  styleUrls: ['./addeditcompany.component.css']
})
export class AddeditcompanyComponent implements OnInit {
  companyId: any;
  userId: string;
  message: string;
  public ngForm = new FormGroup({
    companyName: new FormControl('', [Validators.required]),
    companyUrl: new FormControl('', [Validators.required]),
    companyLinkedin: new FormControl('', [Validators.required]),
    companyDescription: new FormControl('', [Validators.required]),
    companyIndustry: new FormControl('', [Validators.required]),
    companyLocations: new FormControl('', [Validators.required])
  })
  companyData: any;
  industryData: any;
  constructor(public route: ActivatedRoute, public service: CommonService, public router: Router) {
    this.companyId = this.route.snapshot.params['id'];
    console.log("company id", this.companyId);
  }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');
    console.log("userId", this.userId);
    this.service.get(`company/viewAllIndustryTypes`).subscribe((resp: any) => {
      console.log("view industry type res", resp);
      this.industryData = resp.value;
      if (this.companyId !== undefined) {
        this.service.get(`company/viewCompanyDetails/${this.companyId}`).subscribe((res: any) => {
          console.log("view company res", res);
          this.companyData = res.value;
          this.ngForm.value.companyName = this.companyData.companyName;
          this.ngForm.value.companyUrl = this.companyData.companyUrl;
          this.ngForm.value.companyLinkedin = this.companyData.companyLinkedin;
          this.ngForm.value.companyDescription = this.companyData.companyDescription;
          this.ngForm.value.companyIndustry = this.companyData.companyIndustry;
          this.ngForm.value.companyLocations = this.companyData.companyLocations;
        })
      }
    })
  }
  companySubmit() {
    this.message = '';
    if (this.ngForm.value.companyDescription === '' || this.ngForm.value.companyIndustry === '' ||
      this.ngForm.value.companyLinkedin === '' || this.ngForm.value.companyLocations === '' ||
      this.ngForm.value.companyName === '' || this.ngForm.value.companyUrl === '') {
      this.message = 'warning';
    }
    else {
      if (this.companyId === undefined) {
        const obj = {
          recruiterId: this.userId,
          companyName: this.ngForm.value.companyName,
          companyUrl: this.ngForm.value.companyUrl,
          companyLinkedin: this.ngForm.value.companyLinkedin,
          companyDescription: this.ngForm.value.companyDescription,
          companyIndustry: this.ngForm.value.companyIndustry,
          companyLocations: this.ngForm.value.companyLocations
        }
        console.log("data", obj);
        this.service.post(`company/addCompany`, obj).subscribe((res: any) => {
          console.log("post company res", res);
          if (res.status === '7400') {
            this.message = 'success';
          }
          else {
            this.message = 'warning';
          }
        })
      }
      else {
        const obj = {
          recruiterId: this.userId,
          companyName: this.ngForm.value.companyName,
          companyUrl: this.ngForm.value.companyUrl,
          companyLinkedin: this.ngForm.value.companyLinkedin,
          companyDescription: this.ngForm.value.companyDescription,
          companyIndustry: this.ngForm.value.companyIndustry,
          companyLocations: this.ngForm.value.companyLocations
        }
        console.log("data", obj);
        this.service.put(`company/editCompany/${this.companyId}`, obj).subscribe((res: any) => {
          console.log("edit company res", res);
          if (res.status === '7400') {
            this.message = 'success';
          }
          else {
            this.message = 'warning';
          }
        })
      }
    }
  }
}
