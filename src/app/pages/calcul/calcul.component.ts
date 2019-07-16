import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CalculService } from 'src/app/services/calcul/calcul.service';

@Component({
  selector: 'app-calcul',
  templateUrl: './calcul.component.html',
  styleUrls: ['./calcul.component.scss']
})
export class CalculComponent implements OnInit {

    generateForm: FormGroup;
    calculations: Array<String> = [];
    errorMessage: any = {};
    loadingGeneration: boolean = false;

    constructor(private formBuilder: FormBuilder,
      private calculService: CalculService) { }

    ngOnInit() {
      this.initForm();
      this.errorMessage.header = "";
      this.errorMessage.information = "";
      this.errorMessage.display = false;
    }

    initForm() {
      this.generateForm = this.formBuilder.group({
        minA: ['', Validators.required],
        maxA: ['', Validators.required],
        minB: ['', Validators.required],
        maxB: ['', Validators.required],
        bUnderA: [''],
        add: [''],
        nbAdd: [''],
        sub: [''],
        nbSub: [''],
        mul: [''],
        nbMul: [''],
        div: [''],
        nbDiv: ['']
      });
    }

    generateCalculations() {

      let minA = this.generateForm.value['minA'];
      let maxA = this.generateForm.value['maxA'];
      let minB = this.generateForm.value['minB'];
      let maxB = this.generateForm.value['maxB'];
      let nbAdd = this.generateForm.value['nbAdd'];
      let nbSub = this.generateForm.value['nbSub'];
      let nbMul = this.generateForm.value['nbMul'];
      let nbDiv = this.generateForm.value['nbDiv'];
      let bUnderA = this.generateForm.value['bUnderA'];

      this.calculService.setInformations(bUnderA, minA, maxA, minB, maxB);

      if( nbAdd != undefined) {
        this.calculations = this.calculations.concat(this.calculService.generateCalculations(nbAdd, ' + '));
      }

      if( nbSub != undefined) {
        this.calculations = this.calculations.concat(this.calculService.generateSubCalculations(nbSub));
      }

      if( nbMul != undefined) {
        this.calculations = this.calculations.concat(this.calculService.generateCalculations(nbMul, ' x '));
      }

      if( nbDiv != undefined) {
        this.calculations = this.calculations.concat(this.calculService.generateCalculations(nbDiv, ' : '));
      }
    }

    generatePDF() {
      this.calculService.generatePDF(this.calculations);
    }

    submit() {
      this.loadingGeneration = true;
      setTimeout(() => {
        this.calculations = [];
        this.generateCalculations();
        this.generatePDF();
        this.loadingGeneration = false;
      }, 100);

    }

    checkBornes() {
      if(this.generateForm.value['minA'] != "" && this.generateForm.value['maxA'] != "" && this.generateForm.value['maxA'] <= this.generateForm.value['minA']) {
        this.errorMessage.header = "Generation impossible dans cette configuration !";
        this.errorMessage.information = "Le borne supérieure de A ne peut pas être inférieure à la borne inférieure de A.";
        this.errorMessage.display = true;

      } else if (this.generateForm.value['minB'] != "" && this.generateForm.value['maxB'] != "" && this.generateForm.value['maxB'] <= this.generateForm.value['minB']) {
        this.errorMessage.header = "Generation impossible dans cette configuration !";
        this.errorMessage.information = "La borne supérieure de B ne peut pas être inférieure à la borne inférieure de B."
        this.errorMessage.display = true;

      } else {
        this.errorMessage.header = "";
        this.errorMessage.information = "";
        this.errorMessage.display = false;

      }
    }

    checkMaxDifferentCalculations() {

      this.errorMessage.header = "";
      this.errorMessage.information = "";
      this.errorMessage.display = false;

      if(this.generateForm.value['minA'] != ""
          && this.generateForm.value['maxA'] != ""
          && this.generateForm.value['minB'] != ""
          && this.generateForm.value['maxB'] != "") {
        let nbMaxNumberA = (this.generateForm.value['maxA'] - this.generateForm.value['minA']) + 1 ;
        let nbMaxNumberB = (this.generateForm.value['maxB'] - this.generateForm.value['minB']) + 1 ;

        let max = nbMaxNumberA * nbMaxNumberB;


        let nbAdd = this.generateForm.value['nbAdd'];
        let nbSub = this.generateForm.value['nbSub'];
        let nbMul = this.generateForm.value['nbMul'];
        let nbDiv = this.generateForm.value['nbDiv'];
        let bUnderA = this.generateForm.value['bUnderA'];

        if(nbAdd != undefined && nbAdd > max) {

          this.errorMessage.header = "Generation impossible dans cette configuration !";
          this.errorMessage.information = "Il n'est pas possible de générer plus de " + max + " additions différentes."
          this.errorMessage.display = true;

        } else if(nbSub != undefined) {
          if(bUnderA == true) {
            let maxPositives = this.maxPositivesCalculations(this.generateForm.value['minA'], this.generateForm.value['maxA'], this.generateForm.value['minB'], this.generateForm.value['maxB']);
            if( nbSub > maxPositives) {
              this.errorMessage.header = "Generation impossible dans cette configuration !";
              this.errorMessage.information = "Il n'est pas possible de générer plus de " + maxPositives + " soustractions différentes."
              this.errorMessage.display = true;
            }
          } else {
            if( nbSub > max) {
              this.errorMessage.header = "Generation impossible dans cette configuration !";
              this.errorMessage.information = "Il n'est pas possible de générer plus de " + max + " soustractions différentes."
              this.errorMessage.display = true;
            }
          }


        } else if(nbMul != undefined && nbMul > max) {

          this.errorMessage.header = "Generation impossible dans cette configuration !";
          this.errorMessage.information = "Il n'est pas possible de générer plus de " + max + " multiplications différentes."
          this.errorMessage.display = true;

        }else if(nbDiv != undefined && nbDiv > max) {

          this.errorMessage.header = "Generation impossible dans cette configuration !";
          this.errorMessage.information = "Il n'est pas possible de générer plus de " + max + " divisions différentes."
          this.errorMessage.display = true;

        }

      }

    }

    maxPositivesCalculations(minA, maxA, minB, maxB) {
      let positif = 0;
        for(var i = minA; i <= maxA; i ++ ) {

          for(var j = minB; j <= maxB; j ++ ) {

            let res = i - j;
            if(res >= 0)
                positif += 1;
          }
        }

      return positif;
    }

}
