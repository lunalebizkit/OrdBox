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
  dia:any;
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
  SpecificFilter = {
    filter: {
      supplier: "",
      category: "",
      statusid: 0,
      number: 0,
      cuit: "",
      date: ""
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
    this.getData(this.SpecificFilter); 
  }

  /*
   ** Catidad total de entidades
   */

  totalItems=0;

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
  dateChange(date:any):void{
    if(date){
      this.dia = date
      this.SpecificFilter.filter.date = this.formaterDate(date)
    }else{
      this.SpecificFilter.filter.date = ''
    }
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
  onDoubleClick(datos: receiptModel) {
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
      nzWidth: '90%',
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
      this.totalItems / this.SpecificFilter.page > this.SpecificFilter.page
    ) {
      let page = this.SpecificFilter.page;
      this.SpecificFilter .page = this.SpecificFilter.page + 1;
      if (
        this.totalItems === undefined ||
        this.SpecificFilter.page * this.SpecificFilter.pageSize <= this.totalItems
      ) {
        this.service.getReceipt(this.SpecificFilter).subscribe({
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
        this.SpecificFilter.page = page;
      }
    }
  }

  reimprimirReceipt(id:number):void {
    let fecha: Date = new Date();
    let año: string = fecha.getFullYear().toString();
    let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    let dia = fecha.getDate().toString().padStart(2, '0');
    let hora: string = fecha.getHours().toString().padStart(2, '0');
    let minutos: string = fecha.getMinutes().toString().padStart(2, '0');
    let segundos: string = fecha.getSeconds().toString().padStart(2, '0');
    const fileName = `Comprobante_de_Compra_${año}${mes}${dia}${hora}${minutos}${segundos}`;
    this.service.ReprintReceipt(id).subscribe({
      next:(r)=>{  this.downloadFile(r, fileName);}
      
    });
  }
  
  downloadFile(response: any, fileName: string){
    const dataType= response.type;
    const binaryData = [];
  
    binaryData.push(response);
  
    const filtePath = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}))
    const downloadLink = document.createElement('a');
    downloadLink.href = filtePath;
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}
