import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { InvoiceService } from '../invoices.service';
import { InvoiceListModel } from '../model/invoice.model';
import { formatCurrency, formatDate } from '@angular/common';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { InvoicesViewDrawerComponent } from '../invoices-view-drawer/invoices-view.drawer.component';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { SearchCustomFilterModel, parseFilterCustomSeachData, resetQuerySearchFilter } from 'src/app/common/components/model/search.custom.filter.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InvoiceVersion } from 'src/app/common/auth/models/invoice-versions.enum';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css'],
})
export class InvoicesListComponent implements OnInit {

  customSearchForm!: FormGroup;
  router: any;
  permissions = Permission;
  dia: any;
  index!: number;
  id!: number;
  dato!: any;
  invoiceVersion= InvoiceVersion;
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
  invoicesList: InvoiceListModel[] = [];
  /*
   ** Parametros de busqueda
   */
  queryParams: SearchCustomFilterModel = resetQuerySearchFilter();

  /*
   ** Constructor
   */
  constructor(
    private service: InvoiceService,
    @Inject(LOCALE_ID) public locale: string,
    private drawerService: NzDrawerService,
    private fb: FormBuilder
  ) {
    this.customSearchForm = this.fb.group({
      cuit: [''],
      customerName: [''],
      invoicenumber: [0],
      date: [null]  
    })}

  selectedIndex!: number;
  selectedInvoice: any;

  /*
   ** Evento de inicio de angular
   */
  ngOnInit(): void {    

    this.getData(this.queryParams);
  }
  /*
   ** Evento al presionar buscar o presionar enter
   */
  search(): void {
    this.getData(this.queryParams);
    this.queryParams.page = 0;
    this.queryParams.pageSize = 20;

  }
  /*
   ** Evento de busqueda datos en el server
   */

  getData(params: any): void {
    this.loading = true;
    let loadedparams = parseFilterCustomSeachData(params, this.customSearchForm, this.locale);
    this.service.getInvoices(loadedparams).subscribe({
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
  
  formaterDate(date: string | number | Date): string {
    return formatDate(date, 'YYYY-MM-dd hh:mm', this.locale);
  }

  currencyFormat(data: any): string {
    if (!this.locale) return '';
    return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2');
  }

  onDoubleClicked(datos: InvoiceListModel) {
    this.id = datos.id;
    this.openComponentInvoicesView();
  }

  onClick(datos: InvoiceListModel, index: number): void {
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
      this.totalItems / this.queryParams.page > this.queryParams.page
    ) {
      let page = this.queryParams.page;
      this.queryParams.page = this.queryParams.page + 1;
      if (
        this.totalItems === undefined ||
        this.queryParams.page * this.queryParams.pageSize <= this.totalItems
      ) {
        this.service.getInvoices(this.queryParams).subscribe({
          next: (r) => {
            r.data.map((invoice: InvoiceListModel) =>
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
        this.queryParams.page = page;
      }
    }
  }

  openComponentInvoicesView(): void {
    const drawerRefCustomer = this.drawerService.create<
      InvoicesViewDrawerComponent,
      { filter: number }
      
    >({
      nzContent: InvoicesViewDrawerComponent,
      nzSize: 'large',
      nzWidth: '90%',
      nzContentParams: {
        filter: this.id > 0 ? this.id : 0,
      },
      nzClosable: false,
    });

    drawerRefCustomer.afterClose.subscribe({
      next: (isRefresh : [boolean]) =>{
        if (isRefresh){
          this.queryParams = resetQuerySearchFilter();
        this.search();}
      },
      error: ()=>{}
    })
  }

  reimprimirInvoice(id: number, invoiceNumber: number): void {
    let fecha: Date = new Date();
    let año: string = fecha.getFullYear().toString();
    let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    let dia = fecha.getDate().toString().padStart(2, '0');
    let hora: string = fecha.getHours().toString().padStart(2, '0');
    let minutos: string = fecha.getMinutes().toString().padStart(2, '0');
    let segundos: string = fecha.getSeconds().toString().padStart(2, '0');
    const fileName = `Factura_Proforma_${año}${mes}${dia}${hora}${minutos}${segundos}`;
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

  imprimirInvoiceArca(id: number, invoiceNumber: number): void {
    let fecha: Date = new Date();
    let año: string = fecha.getFullYear().toString();
    let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    let dia = fecha.getDate().toString().padStart(2, '0');
    let hora: string = fecha.getHours().toString().padStart(2, '0');
    let minutos: string = fecha.getMinutes().toString().padStart(2, '0');
    let segundos: string = fecha.getSeconds().toString().padStart(2, '0');
    const fileName = `Factura_${año}${mes}${dia}${hora}${minutos}${segundos}`;
    this.service.printInvoiceARCA(id).subscribe({
      next: (r) => { this.downloadFile(r, fileName); }

    });
  }

}
