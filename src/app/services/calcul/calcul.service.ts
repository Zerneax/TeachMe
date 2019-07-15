import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf'

@Injectable({
  providedIn: 'root'
})
export class CalculService {

  bUnderA: boolean = false;
  minA: number = 0;
  minB: number = 0;
  maxA: number = 0;
  maxB: number = 0;

  constructor() { }


  setInformations(isInf, minA, maxA, minB, maxB) {
    if(isInf != "")
      this.bUnderA = isInf;
    this.minA = minA;
    this.minB = minB;
    this.maxA = maxA;
    this.maxB = maxB;
  }

  generateRandomNumber(min, max) {
    // min = Math.ceil(min);
    // max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
    //Math.floor(Math.random() * (max - (min + 1))) + min;
  }

  generateCalculations(nbcalculation, operand) {
    let calculations: Array<String> = [];
    for(var i = 0; i < nbcalculation;) {
      let a, b;
      a = this.generateRandomNumber(this.minA, this.maxA);
      b = this.generateRandomNumber(this.minB, this.maxB);

      let calculation = '' + a + operand + b + " = ______";
       if(!calculations.includes(calculation)) {
        calculations.push(calculation);
        i ++;
      }

    }
    return calculations;
  }

  generateSubCalculations(nbcalculation) {
    let calculations: Array<String> = [];
    for(var i = 0; i < nbcalculation;) {
      let a, b;

      if(this.bUnderA) {
        do {
          a = this.generateRandomNumber(this.minA, this.maxA);
          b = this.generateRandomNumber(this.minB, this.maxB);
        } while(b > a);
      } else {
        a = this.generateRandomNumber(this.minA, this.maxA);
        b = this.generateRandomNumber(this.minB, this.maxB);
      }
      let calculation = '' + a + ' -' + b + " = ______";
       if(!calculations.includes(calculation)) {
        calculations.push(calculation);
        i ++;
      }

    }
    return calculations;
  }


  generatePDF(calculations) {

    var nbPages = 1;

    var maxPages = 1;
    if(calculations.length > 24  )
      maxPages = Math.round(calculations.length / 24);

    var doc = new jsPDF();

    doc.setLineWidth(1);
    doc.rect(5, 5, 100, 25);
    doc.rect(105, 5, 100, 25);
    doc.setFontStyle("bold");
    doc.setFontSize(22);
    doc.text('Calculs', 40, 20);

    doc.setFontStyle("normal");
    doc.setFontSize(14);
    var x = 20;
    var y = 50;

    for(var i = 0; i < calculations.length; i ++) {
      doc.text(calculations[i], x, y);
      x += 60;

      if(i != 0 && i % 23 == 0) {
        x = 20;
        y = 50;
        doc.text('Page ' + nbPages + '/' + maxPages, 180, 290);
        nbPages ++;

        doc.addPage(nbPages, 'a6');
        doc.setLineWidth(1);
        doc.rect(5, 5, 100, 25);
        doc.rect(105, 5, 100, 25);
        doc.setFontStyle("bold");
        doc.setFontSize(22);
        doc.text('Calculs', 40, 20);

        doc.setFontStyle("normal");
        doc.setFontSize(14);
      }

      if(x > 140) {
        x = 20;
        y += 30;
      }

    }

    doc.text('Page ' + nbPages + '/' + maxPages, 180, 290);
    doc.save('Fiche calculs.pdf');
  }
}
