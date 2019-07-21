import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactService } from 'src/app/services/contact/contact.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup;
  errorMessage: string;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private contactService: ContactService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.contactForm = this.formBuilder.group({
      type: ['', Validators.required],
      titre: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  submit() {

    let informations: any = {};
    informations.title = this.contactForm.controls['titre'].value;
    informations.body = this.contactForm.controls['description'].value

    switch(this.contactForm.controls['type'].value) {
      case "Bug": {
        informations.labels = new Array("bug");
        break;
      }
      case "Proposition": {
        informations.labels = new Array("enhancement");
        break;
      }
      default: {
        informations.labels = new Array("bug");
        break;
      }
    }

    this.contactService.createIssueGithub(null).subscribe(
      (response:any) => {
        this.router.navigate(['']);
      }, (error) => {
        this.errorMessage = "Une erreur est survenue lors de l'envoi de votre requête. Merci de reessayer plus tard."
      }
    );


  }
}
