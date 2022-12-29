import { formatCurrency, formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { InvoiceService } from '../invoices.service';
import { eInvoiceType } from '../model/invoice-type.Enum';
import { receiptModel } from '../model/receipt.model';
import { ReceiptViewDrawerComponent } from '../receipt-view-drawer/receipt-view-drawer.component';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.css'],
})
export class ReceiptListComponent implements OnInit {
  permissions = Permission;

  id!: number;

  /*
   ** Indicador de carga de la grilla
   */
  loading = false;

  /*
   ** Parametros de busqueda
   */
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 20,
  };

  receiptList: receiptModel[] = [];

  selectedIndex!: number;
  selectedReceipt: any;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private service: InvoiceService,
    private drawerService: NzDrawerService
  ) {}

  ngOnInit(): void {
    this.getData(this.queryParams);
  }

  /*
   ** Catidad total de entidades
   */

  totalItems!: number;

  /*
   ** Evento al presionar buscar o presionar enter
   */
  search(): void {
    this.queryParams.page = 0;
    this.getData(this.queryParams);
  }

  /*
   ** Evento de busqueda datos en el server
   */

  getData(params: any): void {
    this.loading = true;
    this.service.getReceipt(params).subscribe({
      next: (r) => {
        this.receiptList = r.data;
        this.totalItems = r.totalCount;
        this.loading = false;
        this.selectedIndex = 0;
        this.selectedReceipt = this.receiptList[this.selectedIndex];
        document.getElementById(this.selectedIndex.toString())?.focus();
      },
      error: () => {
        this.loading = false;
        this.receiptList = [];
      },
    });
  }

  formaterDate(date: string | number | Date): string {
    return formatDate(date, 'YYYY-MM-dd', this.locale);
  }

  currencyFormat(data: any): string {
    if (!this.locale) return '';
    return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2');
  }

  getInvoiceType(id: number) {
    return eInvoiceType[id];
  }

  onDoubleClicked(datos: receiptModel) {
    this.id = datos.id;
    this.openComponentReceiptView();
  }

  openComponentReceiptView(): void {
    const drawerRefCustomer = this.drawerService.create<
      ReceiptViewDrawerComponent,
      { filter: number },
      number
    >({
      nzContent: ReceiptViewDrawerComponent,
      nzSize: 'large',
      nzContentParams: {
        filter: this.id > 0 ? this.id : 0,
      },
      nzClosable: false,
    });
  }
}
