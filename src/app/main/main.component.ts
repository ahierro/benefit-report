import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { Benefit } from '../dto/Benefit';

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

  constructor() { }

  ngOnInit() {
  }
  submitBenefits() {
    let arr = this.benefitsText.split(/\r?\n/);
    this.benefits = [];
    let preOrPostFilter = 'PRE';
    let gotToFirstBenefitTable = false;
    arr.forEach((line) => {
      var arrLine = line.match('.*STC: (.*) Type: (.*) InsurTypeCode .* CvgQual (.*) PlanDesc: (.*) Value: (.*) InNetwork: (.*) BnftCvgeCode: .* RefId: .* ALLMSG: (.*) IIIs: (.*) Src: .*');
      if (arrLine && arrLine.length > 1) {
        gotToFirstBenefitTable = true;
      } else if (gotToFirstBenefitTable) {
        preOrPostFilter = 'POST';
      }
      const benefit: Benefit = {
        stc: this.getVal(arrLine || [], 1),
        bType: this.getVal(arrLine || [], 2),
        val: this.getVal(arrLine || [], 5),
        msg: this.getVal(arrLine || [], 7),
        cvgQual: this.getVal(arrLine || [], 3),
        iIIs: this.getVal(arrLine || [], 8),
        planDesc: this.getVal(arrLine || [], 4),
        inNetwork: this.getVal(arrLine || [], 6),
        preOrPostFilter: preOrPostFilter
      };
      if (benefit.stc) {
        this.benefits.push(benefit);
      }
    });
  }
  getVal(arrLine: string[], index: number): string {
    return arrLine && arrLine[index] ? arrLine[index] : ''
  }
}
