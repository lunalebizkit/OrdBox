import { formatCurrency, formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { InvoiceService } from '../invoices.service';
import { receiptModel } from '../model/receipt.model';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
})
export class ReceiptComponent implements OnInit {
  permissions = Permission;

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
    private service: InvoiceService
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
}
