import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { deliveryNotesService } from '../deliveryNotes.service';
import { DeliveryNotesModel } from '../model/deliveryNotes.model';
import { formatCurrency, formatDate } from '@angular/common';
import { DeliveryNotesViewDrawerComponent } from '../deliveryNotes-view-drawer/deliveryNotes-view-drawer.component';
import { pStatusType } from '../model/status.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-deliveryNotes-list',
  templateUrl: './deliveryNotes-list.component.html',
  styleUrls: ['./deliveryNotes-list.component.css'],
})
export class DeliveryNotesListComponent implements OnInit {
  permissions = Permission;
  dia:any;
  index!: number;
  id!: number;
  dato!: any
  /*
   ** Cantidad total de remitos
   */

  totalItems!: number;
  /*
   ** Indicador de carga de la grilla
   */
  loading = false;
  /*
   ** Lista de Remitos
   */
  deliveryNotesList: DeliveryNotesModel[] = [];
  /*
   ** Parametros de busqueda
   */
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 35,
  };

  SpecificFilter = {
    filter: {
      supplier: "",
      category: "",
      statusid: 0,
      number: 0,
      cuit: "",
      date:"",
    },
    page: 0,
    pageSize: 26
  }
  constructor(
    private service: deliveryNotesService,
    @Inject(LOCALE_ID) public locale: string,
    private drawerService: NzDrawerService,
    private router: Router,
    private route: ActivatedRoute, 
  ) { }

  selectedIndex!: number;
  selectedDeliveryNotes: any;
    ngOnInit(): void {
        this.getData(this.SpecificFilter)
    }

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
      this.service.getDeliveryNotes(params).subscribe({
        next: (r) => {
          this.deliveryNotesList = r.data;
          this.totalItems = r.totalCount;
          this.loading = false;
          this.selectedIndex = 0;
          this.selectedDeliveryNotes = this.deliveryNotesList[this.selectedIndex];
          document.getElementById(this.selectedIndex.toString())?.focus();
        },
        error: () => {
          this.loading = false;
          this.deliveryNotesList = [];
        },
      });
    }
  
    
    formaterDate(date: string | number | Date): string {
      return formatDate(date, 'YYYY-MM-dd', this.locale);
    }
   
    dateChange(date:any):void{
      if(date){
        this.dia = date
        this.SpecificFilter.filter.date =this.formaterDate(date)
      }else{
        this.SpecificFilter.filter.date = ''
      }
    }
  
    currencyFormat(data: any): string {
      if (!this.locale) return '';
      return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2');
    }
  
    onDoubleClicked(datos: DeliveryNotesModel) {
      this.id = datos.id;
      this.openComponentDeliveryNotesView()
      
    }
  
    onClick(datos: DeliveryNotesModel, index: number): void {
      this.index = index;
      this.selectedIndex = index;
      this.selectedDeliveryNotes = datos;
    }
  
    onEnter(id: any) {
      this.selectedDeliveryNotes = this.deliveryNotesList[this.index];
      this.id = this.deliveryNotesList[this.index].id;
      this.router.navigate(['/home/deliveryNotes/edit', this.id]); 
    }
  
  
  
    /*
     ** Evento de navegacion por teclado
     */
    myNavegation(event: any) {
      switch (event.key) {
        case 'ArrowDown':
          let nextCell =
            this.deliveryNotesList.length > this.selectedIndex
              ? ++this.selectedIndex
              : this.deliveryNotesList.length;
          if (this.deliveryNotesList[nextCell] !== undefined) {
            this.selectedDeliveryNotes = this.deliveryNotesList[nextCell];
            this.index = nextCell;
            document.getElementById(nextCell.toString())?.focus();
          }
          break;
        case 'ArrowUp':
          let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
          if (this.deliveryNotesList[previousCell] !== undefined) {
            this.selectedDeliveryNotes = this.deliveryNotesList[previousCell];
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
          this.service.getDeliveryNotes(this.SpecificFilter).subscribe({
            next: (r) => {
              r.data.map((deliveryNotes: DeliveryNotesModel) =>
                this.deliveryNotesList.push(deliveryNotes)
              );
              this.loading = false;
            },
            error: () => {
              this.loading = false;
              this.deliveryNotesList = [];
            },
          });
        } else {
          this.SpecificFilter.page = page;
        }
      }
    }

    openComponentDeliveryNotesView(): void {
      const drawerRefCustomer = this.drawerService.create<
        DeliveryNotesViewDrawerComponent,
        { filter: number },
        number
      >({
        nzContent: DeliveryNotesViewDrawerComponent,
        nzSize: 'large',
        nzWidth: 1050,
        nzContentParams: {
          filter: this.id > 0 ? this.id : 0,
        },
        nzClosable: false,
      });
    } 
    getStatusName(id: number) {
      return pStatusType [id];
    }

    print(id: Number){
      window.open('__/'+id,"_blank");
    }
}

