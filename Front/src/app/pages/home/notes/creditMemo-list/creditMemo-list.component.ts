import { formatCurrency, formatDate } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { CreditMemoViewDrawerComponent } from '../creditMemo-view-drawer/creditMemo-view-drawer.component';
import { CreditMemoModel } from '../model/creditMemo.model';
import { NoteService } from '../notes.service';
import { initialSearchFilter, parseFilterCustomSeachData, resetQuerySearchFilter, SearchCustomFilterModel } from 'src/app/common/components/model/search.custom.filter.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InvoiceVersion } from 'src/app/common/auth/models/invoice-versions.enum';

@Component({
  selector: 'app-creditMemo-list',
  templateUrl: './creditMemo-list.component.html',
  styleUrls: ['./creditMemo-list.component.css'],
})
export class creditMemoListComponent implements OnInit {
  
  customNCSearchForm!: FormGroup;
  queryParams: SearchCustomFilterModel = resetQuerySearchFilter();
  id!: number;
  isLoading: boolean= false;
  loading!: boolean;
  isSaving!: boolean; 
  totalItems!: number;
  creditMemoList: CreditMemoModel[] = [];
  selectedIndex!: number;
  selectedCreditMemo: any;
  permissions = Permission;
  dia:any;
  invoiceVersion= InvoiceVersion;
  
  index!: number;
  constructor(
    private service: NoteService,
    @Inject(LOCALE_ID) public locale: string,
    private drawerService: NzDrawerService,
    private fb: FormBuilder
  ){
    this.customNCSearchForm = this.fb.group({
          cuit: [''],
          customerName: [''],
          invoicenumber: [0],
          date: [null]  
        })
  }


    ngOnInit(): void {
        this.getData(this.queryParams)
    }

    getData(params: any): void {
      this.loading = true;
      let loadedparams = parseFilterCustomSeachData(params, this.customNCSearchForm, this.locale);
      this.service.getCreditMemo(loadedparams).subscribe({
        next: (r) => {
          this.creditMemoList = r.data;
          this.totalItems = r.totalCount;
          this.loading = false;
          this.selectedIndex = 0;
          this.selectedCreditMemo = this.creditMemoList[this.selectedIndex];
          document.getElementById(this.selectedIndex.toString())?.focus();
        
        },
        error: () => {
          this.loading = false;
          this.creditMemoList = [];
        },
      });
    }
    formaterDate(date: string | number | Date): string {
      return formatDate(date, 'YYYY-MM-dd', this.locale);
    }
    
    search(): void {
      this.getData(this.queryParams);
      this.queryParams.page = 0;
      this.queryParams.pageSize = 20;
    }
    openComponentCreditMemoView(): void {
      const drawerRefCustomer = this.drawerService.create<
        CreditMemoViewDrawerComponent,
        { filter: number },
        number
      >({
        nzContent: CreditMemoViewDrawerComponent,
        nzSize: 'large',
        nzWidth: '90%',
        nzContentParams: {
          filter: this.id > 0 ? this.id : 0,
        },
        nzClosable: false,
      });
    }
    onClick(datos: CreditMemoModel, index: number): void {
      this.index = index;
      this.selectedIndex = index;
      this.selectedCreditMemo = datos;
    }

    onDoubleClicked(datos: CreditMemoModel) {
      this.id = datos.id;
      this.openComponentCreditMemoView();
    }
    onDoubleClick(datos: CreditMemoModel) {
      this.id = datos.id;
      this.openComponentCreditMemoView();
    }
    currencyFormat(data: any):string  {    
      return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2')
    } 

     /*
   ** Evento de navegacion por teclado
   */
  myNavegation(event: any) {
    switch (event.key) {
      case 'ArrowDown':
        let nextCell =
          this.creditMemoList.length > this.selectedIndex
            ? ++this.selectedIndex
            : this.creditMemoList.length;
        if (this.creditMemoList[nextCell] !== undefined) {
          this.selectedCreditMemo = this.creditMemoList[nextCell];
          this.index = nextCell;
          document.getElementById(nextCell.toString())?.focus();
        }
        break;
      case 'ArrowUp':
        let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
        if (this.creditMemoList[previousCell] !== undefined) {
          this.selectedCreditMemo = this.creditMemoList[previousCell];
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
        this.service.getCreditMemo(this.queryParams).subscribe({
          next: (r) => {
            r.data.map((credit: CreditMemoModel) =>
              this.creditMemoList.push(credit)
            );
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.creditMemoList = [];
          },
        });
      } else {
        this.queryParams.page = page;
      }
    }
  }

  imprimirInvoiceArca(id: number): void {
    let fecha: Date = new Date();
    let año: string = fecha.getFullYear().toString();
    let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    let dia = fecha.getDate().toString().padStart(2, '0');
    let hora: string = fecha.getHours().toString().padStart(2, '0');
    let minutos: string = fecha.getMinutes().toString().padStart(2, '0');
    let segundos: string = fecha.getSeconds().toString().padStart(2, '0');
    const fileName = `NotaCredito_${año}${mes}${dia}${hora}${minutos}${segundos}`;
    this.service.printCreditARCA(id).subscribe({
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