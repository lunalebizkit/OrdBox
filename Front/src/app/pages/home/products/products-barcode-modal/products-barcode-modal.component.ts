import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from "ng-zorro-antd/modal";


@Component({
  selector: 'app-products-barcode-modal',
  templateUrl: './products-barcode-modal.component.html',
})
export class ProductCodeBarModal implements AfterViewInit {
  
  @ViewChild('barcodefocus') barCodeFocus!: ElementRef<HTMLInputElement>;

  form!: FormGroup;
  barCode!: string;
  barCodeAutofocus= true;
  constructor(private modal: NzModalRef,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      barCode: ['',]
    })
  } 
  
  destroyModal(): void {
    this.modal.destroy();
  }
  setCodeBar(): void {    
      this.barCode= this.form.controls['barCode'].value;  
      this.modal.close(this.barCode)
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.barCodeFocus.nativeElement.focus();
      
    }, 500);
  }
  
}