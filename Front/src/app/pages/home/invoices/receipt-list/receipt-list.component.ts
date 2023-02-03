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
    pageSize: 10,
  };
  specificFilter = {
    filter: {
      supplier: "",
      category: "",
      statusid: 0,
      number: 0,
      cuit: ""
    },
    page: 0,
    pageSize: 20
  }

  receiptList: receiptModel[] = [];

  selectedIndex!: number;
  selectedReceipt: any;
  index!: number;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private service: InvoiceService,
    private drawerService: NzDrawerService
  ) {}

  ngOnInit(): void {
    this.getData(this.specificFilter); 
  }

  /*
   ** Catidad total de entidades
   */

  totalItems=0;

  /*
   ** Evento al presionar buscar o presionar enter
   */
  search(): void {
    this.getData(this.specificFilter);
    this.specificFilter.page = 0;
    this.specificFilter.pageSize = 20;
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
  onClick(datos: receiptModel, index: number): void {
    this.index = index;
    this.selectedIndex = index;
    this.selectedReceipt = datos;
  }

  openComponentReceiptView(): void {
    const drawerRefCustomer = this.drawerService.create<
      ReceiptViewDrawerComponent,
      { filter: number },
      number
    >({
      nzContent: ReceiptViewDrawerComponent,
      nzSize: 'large',
      nzWidth: 1050,
      nzContentParams: {
        filter: this.id > 0 ? this.id : 0,
      },
      nzClosable: false,
    });
  }
  myNavegation(event: any) {
    switch (event.key) {
      case 'ArrowDown':
        let nextCell =
          this.receiptList.length > this.selectedIndex
            ? ++this.selectedIndex
            : this.receiptList.length;
        if (this.receiptList[nextCell] !== undefined) {
          this. selectedReceipt = this.receiptList[nextCell];
          this.index = nextCell;
          document.getElementById(nextCell.toString())?.focus();
        }
        break;
      case 'ArrowUp':
        let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
        if (this.receiptList[previousCell] !== undefined) {
          this. selectedReceipt= this.receiptList[previousCell];
          this.index = previousCell;
          document.getElementById(previousCell.toString())?.focus();
        }
        break;
    }
  }

  /*
   ** Evento de scroll infinito
   */

  onScroll(event: any): void {
    let scrollHeight = event.target.scrollHeight;
    let scrolltop = event.target.scrollTop;
    let client = event.target.clientHeight;
    let ScrollPosition = Math.abs(
      Math.round(scrollHeight - (scrolltop + client))
    );
    if (
      ScrollPosition <= 5 &&
      this.totalItems / this.specificFilter.page > this.specificFilter.page
    ) {
      let page = this.specificFilter.page;
      this.specificFilter .page = this.specificFilter.page + 1;
      if (
        this.totalItems === undefined ||
        this.specificFilter.page * this.specificFilter.pageSize <= this.totalItems
      ) {
        this.service.getReceipt(this.specificFilter).subscribe({
          next: (r) => {
            r.data.map((data: receiptModel) =>
              this.receiptList.push(data)
            );
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.receiptList= [];
          },
        });
      } else {
        this.specificFilter.page = page;
      }
    }
  }
}
