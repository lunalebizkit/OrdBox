import {
  OnInit,
  Component,
  TemplateRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { differenceInCalendarDays, setHours } from 'date-fns';

@Component({
  selector: 'app-receipt-edit',
  templateUrl: './receipt-edit.component.html',
  styleUrls: ['./receipt-edit.component.css'],
})
export class ReceiptEditComponent extends BaseComponent implements OnInit {
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: { filter: string };
    drawerRef: NzDrawerRef<string>;
  }>;

  /*
   ** Indicador de carga de la grilla
   */
  loading = false;

  today = new Date();

  formReceipt!: FormGroup;
  formProductSearch!: FormGroup;
  formProduct!: FormGroup;
  formCustomerSearch!: FormGroup;
  formInvoiceModel!: FormGroup;

  constructor(
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService
  ) {
    super(notificacionService, el, message);
  }

  ngOnInit(): void {}

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) > 0;
}
