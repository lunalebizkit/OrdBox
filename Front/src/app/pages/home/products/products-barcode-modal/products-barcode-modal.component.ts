import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";


@Component({
  selector: 'app-products-barcode-modal',
  templateUrl: './products-barcode-modal.component.html',
})
export class ProductCodeBarModal {
  
  @Output() clickevent = new EventEmitter<string>()
  form!: FormGroup;
  barCode!: string;
  constructor(private modal: NzModalRef,
    private fb: FormBuilder,) {
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
}