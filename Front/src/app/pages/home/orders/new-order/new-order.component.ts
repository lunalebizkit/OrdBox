import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { OrderAddModel } from '../models/order.add.model';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
})
export class NewOrderComponent extends BaseComponent implements OnInit {
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;

  constructor(
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ordersService: OrdersService
  ) {
    super(notificacionService, el, message);
    this.form = this.fb.group({
      supplier: ['', [Validators.required]],
      date: ['', [Validators.required]],
      isPaid: ['', [Validators.required]],
      email: ['', [Validators.required]],
      send: ['', [Validators.required]],
      email2: ['', [Validators.required]],
      send2: ['', [Validators.required]],
    });
    this.formModal = this.fb.group({
      description: ['', [Validators.required]],
      code: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  form!: FormGroup;
  formModal!: FormGroup;
  isSaving!: boolean;
  isVisible = false;
  switchValue = false;
  date = null;
  fecha = 'Elige una fecha';
  isConfirmLoading = false;
  id!: number;

  save(): void {
    if (this.isValidForm(this.form)) {
      const model: OrderAddModel = {
        id: this.id !== undefined ? this.id : 0,
        supplier: this.form.controls['supplier'].value,
        date: this.form.controls['date'].value,
        isPaid: this.form.controls['isPaid'].value,
        email: this.form.controls['email'].value,
        send: this.form.controls['send'].value,
        email2: this.form.controls['email2'].value,
        send2: this.form.controls['send2'].value,
      };
      this.isSaving = true;
      this.ordersService.saveOrder(model).subscribe({
        next: (r) => {
          this.showNotificationSuccess(
            'Guardado correcto',
            `Se guardo correctamente el pedido`
          );
          this.isSaving = false;
          this.headerComponent.goBack();
        },
        error: () => {
          this.isSaving = false;
          this.showMessageError('No se pudo Guardar el pedido');
        },
      });
    }
  }
  queryData = {
    filter: '',
    page: 0,
    pageSize: 10,
  };

  showModal(): void {
    this.isVisible = true;
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  handleOk(): void {
    // this.isConfirmLoading = true;
    // setTimeout(() => {
    //   this.isVisible = false;
    //   this.isConfirmLoading = false;
    // }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
