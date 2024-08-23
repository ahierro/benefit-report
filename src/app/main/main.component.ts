import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { Benefit } from '../dto/Benefit';
import { Rule } from '../dto/Rule';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [InputTextModule, TableModule, FormsModule, InputTextareaModule, ButtonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  benefitsText = '';
  benefits: Benefit[] = [] as Benefit[];
  rules: Rule[] = [] as Rule[];

  constructor() { }

  ngOnInit() {
  }
  submitBenefits() {
    let allLogLines = this.benefitsText.split(/\r?\n/);
    this.benefits = [];
    let preBenefits: Benefit[] = [] as Benefit[];
    let postBenefits: Benefit[] = [] as Benefit[];

    this.rules = [];
    let filterOut = 'Y';
    let scope = '';
    let rule = '';
    let idRule = 1;
    let idBenefit = 1;

    let gotToFirstBenefitTable = false;
    allLogLines.forEach((line) => {
      var scopeLine = line.match('.*Hit scope: (.*) at.*');
      if (scopeLine && scopeLine.length > 1) {
        scope = this.getVal(scopeLine || [], 1);
      }
      var ruleLine = line.match('.*Hit rule: (.*) -- .*');
      if (ruleLine && ruleLine.length > 1) {
        rule = this.getVal(ruleLine || [], 1);
        if (rule) {
          this.rules.push({
            id: idRule++,
            scope, rule
          } as Rule);
        }
      }
      var benefitLine = line.match('.*STC: (.*) Type: (.*) InsurTypeCode .* CvgQual (.*) PlanDesc: (.*) Value: (.*) InNetwork: (.*) BnftCvgeCode: .* RefId: .* ALLMSG: (.*) IIIs: (.*) Src: .*');
      if (benefitLine && benefitLine.length > 1) {
        gotToFirstBenefitTable = true;
      } else if (gotToFirstBenefitTable) {
        filterOut = 'N';
      }
      const benefit: Benefit = {
        id: idBenefit++,
        stc: this.getVal(benefitLine || [], 1),
        bType: this.getVal(benefitLine || [], 2),
        val: this.getVal(benefitLine || [], 5),
        msg: this.getVal(benefitLine || [], 7),
        cvgQual: this.getVal(benefitLine || [], 3),
        iIIs: this.getVal(benefitLine || [], 8),
        planDesc: this.getVal(benefitLine || [], 4),
        inNetwork: this.getVal(benefitLine || [], 6),
        filteredOut: filterOut
      };
      if (benefit.stc) {
        if (filterOut == 'Y') {
          preBenefits.push(benefit);
        }
        if (filterOut == 'N') {
          postBenefits.push(benefit);
        }
      }
    });
    preBenefits.forEach(preb => {
      if (!postBenefits.find(postb =>
        preb.stc === postb.stc &&
        preb.bType === postb.bType &&
        preb.val === postb.val &&
        preb.msg === postb.msg &&
        preb.cvgQual === postb.cvgQual &&
        preb.iIIs === postb.iIIs &&
        preb.planDesc === postb.planDesc &&
        preb.inNetwork === postb.inNetwork
      )) {
        this.benefits.push(preb);
      }
    });
    postBenefits.forEach(postb => {
      this.benefits.push(postb);
    });
  }
  getVal(arrLine: string[], index: number): string {
    return arrLine && arrLine[index] ? arrLine[index] : ''
  }
}
