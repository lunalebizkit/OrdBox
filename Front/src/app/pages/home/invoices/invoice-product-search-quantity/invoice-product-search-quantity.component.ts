import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-invoice-product-search-quantity',
  templateUrl: './invoice-product-search-quantity.component.html',
  styleUrls: ['./invoice-product-search-quantity.component.css']
})
export class InvoiceProductSearchQuantityComponent implements OnInit {

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: {};
    drawerRef: NzDrawerRef<string>;
  }>;

  form!: FormGroup;
  quantity = 0;
  constructor(
    private drawerRef: NzDrawerRef<string>,
    private fb: FormBuilder) {

    this.form = this.fb.group({
      quantity: [0, [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  guardar(): void {
   this.quantity=this.form.controls['quantity'].value;
   if (this.quantity > 0){
    this.drawerRef.close(this.quantity);
   }
  }

  cancelar(): void {
    this.drawerRef.close();
  }

}
