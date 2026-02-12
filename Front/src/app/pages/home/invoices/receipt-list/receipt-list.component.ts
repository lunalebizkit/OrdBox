import { formatCurrency, formatDate } from '@angular/common';
import { Component, ElementRef, Inject, Input, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { InvoiceService } from '../invoices.service';
import { eInvoiceType } from '../model/invoice-type.Enum';
import { receiptModel } from '../model/receipt.model';
import { ReceiptViewDrawerComponent } from '../receipt-view-drawer/receipt-view-drawer.component';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { initialSearchFilter, parseFilterCustomSeachData, SearchCustomFilterModel } from 'src/app/common/components/model/search.custom.filter.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.css'],
})
export class ReceiptListComponent extends BaseComponent implements OnInit {
  permissions = Permission;
  dia:any;
  id!: number;
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  customRSearchForm!: FormGroup;
  /*
   ** Indicador de carga de la grilla
   */
  loading = false;

  /*
   ** Parametros de busqueda
   */
  queryParams: SearchCustomFilterModel = initialSearchFilter;

  receiptList: receiptModel[] = [];

  selectedIndex!: number;
  selectedReceipt: any;
  index!: number;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private service: InvoiceService,
    private drawerService: NzDrawerService,    
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private fb: FormBuilder
  ) {super( notificacionService, el, message);
    this.customRSearchForm = this.fb.group({
      cuit: [''],
      customerName: [''],
      invoicenumber: [0],
      date: [null]  
    })
  }

  ngOnInit(): void {
    this.getData(this.queryParams); 
  }

  /*
   ** Catidad total de entidades
   */

  totalItems=0;

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
    let loadedparams = parseFilterCustomSeachData(params, this.customRSearchForm, this.locale);
    this.service.getReceipt(loadedparams).subscribe({
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
      this.totalItems / this.queryParams.page > this.queryParams.page
    ) {
      let page = this.queryParams.page;
      this.queryParams .page = this.queryParams.page + 1;
      if (
        this.totalItems === undefined ||
        this.queryParams.page * this.queryParams.pageSize <= this.totalItems
      ) {
        this.service.getReceipt(this.queryParams).subscribe({
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
        this.queryParams.page = page;
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

  handleOk() {
    this.service.delete(this.popupComponent.elementSelectedToDelete).subscribe(
     {next: (r) => {
        this.popupComponent.isDeleteConfirmationVisible = false;
        this.showMessageSuccess("Comprobante eliminado");
        this.search();
      },
      error:(r) => { 
        this.showMessageError(r.error.descripcion);
        this.popupComponent.isDeleteConfirmationVisible = false;
      }
  });
  }
}
