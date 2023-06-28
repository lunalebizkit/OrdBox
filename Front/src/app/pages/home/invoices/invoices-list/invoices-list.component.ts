import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { InvoiceService } from '../invoices.service';
import { eInvoiceType } from '../model/invoice-type.Enum';
import { InvoiceModel } from '../model/invoice.model';
import { formatCurrency, formatDate } from '@angular/common';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { InvoicesViewDrawerComponent } from '../invoices-view-drawer/invoices-view.drawer.component';
import { Permission } from 'src/app/common/auth/models/permissions.enum';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css'],
})
export class InvoicesListComponent implements OnInit {
  router: any;
  permissions = Permission;
  dia: any;
  index!: number;
  id!: number;
  dato!: any
  /*
   ** Catidad total de entidades
   */

  totalItems!: number;
  /*
   ** Indicador de carga de la grilla
   */
  loading = false;
  /*
   ** Lista de Productos
   */
  invoicesList: InvoiceModel[] = [];
  /*
   ** Parametros de busqueda
   */
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 20,
  };

  SpecificFilter = {
    filter: {
      supplier: "",
      category: "",
      statusid: 0,
      number: 0,
      cuit: "",
      date: "",
    },
    page: 0,
    pageSize: 20
  }

  /*
   ** Constructor
   */
  constructor(
    private service: InvoiceService,
    @Inject(LOCALE_ID) public locale: string,
    private drawerService: NzDrawerService
  ) { }

  selectedIndex!: number;
  selectedInvoice: any;

  /*
   ** Evento de inicio de angular
   */
  ngOnInit(): void {
    this.getData(this.SpecificFilter);
  }
  /*
   ** Evento al presionar buscar o presionar enter
   */
  search(): void {
    this.getData(this.SpecificFilter);
    this.SpecificFilter.page = 0;
    this.SpecificFilter.pageSize = 20;

  }
  /*
   ** Evento de busqueda datos en el server
   */

  getData(params: any): void {
    this.loading = true;
    this.service.getInvoices(params).subscribe({
      next: (r) => {
        this.invoicesList = r.data;
        this.totalItems = r.totalCount;
        this.loading = false;
        this.selectedIndex = 0;
        this.selectedInvoice = this.invoicesList[this.selectedIndex];
        document.getElementById(this.selectedIndex.toString())?.focus();
      },
      error: () => {
        this.loading = false;
        this.invoicesList = [];
      },
    });
  }

  getInvoiceType(id: number) {
    return eInvoiceType[id];
  }

  formaterDate(date: string | number | Date): string {
    return formatDate(date, 'YYYY-MM-dd', this.locale);
  }

  dateChange(date: any): void {
    if (date) {
      this.dia = date
      this.SpecificFilter.filter.date = this.formaterDate(date)
    } else {
      this.SpecificFilter.filter.date = ''
    }
  }

  currencyFormat(data: any): string {
    if (!this.locale) return '';
    return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2');
  }

  onDoubleClicked(datos: InvoiceModel) {
    this.id = datos.id;
    this.openComponentInvoicesView();
  }

  onClick(datos: InvoiceModel, index: number): void {
    this.index = index;
    this.selectedIndex = index;
    this.selectedInvoice = datos;
  }

  onEnter(e: any) {
    this.selectedInvoice = this.invoicesList[this.index];
    this.id = this.invoicesList[this.index].id;
    this.openComponentInvoicesView();
  }

  /*
   ** Evento de navegacion por teclado
   */
  myNavegation(event: any) {
    switch (event.key) {
      case 'ArrowDown':
        let nextCell =
          this.invoicesList.length > this.selectedIndex
            ? ++this.selectedIndex
            : this.invoicesList.length;
        if (this.invoicesList[nextCell] !== undefined) {
          this.selectedInvoice = this.invoicesList[nextCell];
          this.index = nextCell;
          document.getElementById(nextCell.toString())?.focus();
        }
        break;
      case 'ArrowUp':
        let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
        if (this.invoicesList[previousCell] !== undefined) {
          this.selectedInvoice = this.invoicesList[previousCell];
          this.index = previousCell;
          document.getElementById(previousCell.toString())?.focus();
        }
        break;
    }
  }

  /*
   ** Evento scroll infinito con llamada a la api
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
      this.totalItems / this.SpecificFilter.page > this.SpecificFilter.page
    ) {
      let page = this.SpecificFilter.page;
      this.SpecificFilter.page = this.SpecificFilter.page + 1;
      if (
        this.totalItems === undefined ||
        this.SpecificFilter.page * this.SpecificFilter.pageSize <= this.totalItems
      ) {
        this.service.getInvoices(this.SpecificFilter).subscribe({
          next: (r) => {
            r.data.map((invoice: InvoiceModel) =>
              this.invoicesList.push(invoice)
            );
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.invoicesList = [];
          },
        });
      } else {
        this.SpecificFilter.page = page;
      }
    }
  }

  openComponentInvoicesView(): void {
    const drawerRefCustomer = this.drawerService.create<
      InvoicesViewDrawerComponent,
      { filter: number },
      number
    >({
      nzContent: InvoicesViewDrawerComponent,
      nzSize: 'large',
      nzWidth: '90%',
      nzContentParams: {
        filter: this.id > 0 ? this.id : 0,
      },
      nzClosable: false,
    });
  }

  reimprimirInvoice(id: number): void {
    const fileName = `Factura_Proforma`
    this.service.Reprintinvoice(id).subscribe({
      next: (r) => { this.downloadFile(r, fileName); }

    });
  }

  downloadFile(response: any, fileName: string) {
    const dataType = response.type;
    const binaryData = [];

    binaryData.push(response);

    const filtePath = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }))
    const downloadLink = document.createElement('a');
    downloadLink.href = filtePath;
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }




}
