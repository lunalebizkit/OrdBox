import { Component, ElementRef, Inject, Input, LOCALE_ID, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { Router } from '@angular/router';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { PeriodsService } from '../periods.service';
import { PeriodsModel } from '../model/periods.model'; 
import { periodsDrawerComponent } from '../new-periods-drawer/new-periods.drawer.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { formatDate } from '@angular/common';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';


@Component({
    selector: 'app-periods-list',
    templateUrl: './periods-list.component.html',
    styleUrls: ['./periods-list.component.css'],
  })

export class PeriodsListComponent extends BaseComponent implements OnInit {
 
  @ViewChild('drawer') drawerComponent!: periodsDrawerComponent;
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  periodList: PeriodsModel[] = [];

  
   queryData = {
    filter: '',
    page: 0,
    pageSize: 10,
  };
  selectedIndex!: number;
  selectedPeriod: any;
  totalItems= 0;
  loading!: boolean;
  isConfirmLoading!: boolean;
  isVisible!: boolean;
  id!: number;
  form: any;
  fb: any;
  isSaving!: boolean;
  index!: number;
  isDeleteConfirmationVisible!: boolean
  
 
  


  constructor(
    private service: PeriodsService,
    private drawerService: NzDrawerService,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    @Inject(LOCALE_ID) public locale: string,
   
  ) {super(notificacionService, el, message);}



    ngOnInit() {
      this.getPeriod(this.queryData)
    }
   
    getPeriod(params: any): void {
      this.service.getByFilter(params).subscribe({
        next: (r) => {
          this.periodList = r.data;
          this.totalItems = r.totalCount;
          this.loading = false;
          this.selectedIndex = 0;
          this.selectedPeriod = this.periodList[this.selectedIndex];
          document.getElementById(this.selectedIndex.toString())?.focus();
        },
        error: () => {
          this.loading = false;
          this.periodList = [];
        },
      });
    }
    search(): void {
      this.queryData.page = 0;
      this.getPeriod(this.queryData);
    }

    formaterDate(date: string | number | Date): string {
      return formatDate(date, 'YYYY-MM-dd', this.locale);
    }
  
    onDoubleClicked(datos: any) {
      this.id = datos.id;
      if(datos.status === true){
        this.openComponentPeriod();
      }else{
        this.id = 0
        this.isSaving = false;
        this.showMessageError('No se puede editar período cerrado')         
      }
    }

  onClick(datos: any, index: number): void {
    this.index = index;
    this.selectedIndex = index;
    this.selectedPeriod = datos;
  }

  onEnter(e: any, datos:any) {
    this.selectedPeriod = this.periodList[this.index];
    this.id = this.periodList[this.index].id;
    if(datos.status === true){
      this.openComponentPeriod();
    }else{
      this.id = 0
      this.isSaving = false;
        this.showMessageError('No se puede editar período cerrado')
    }
    
  }
  myNavegation(event: any) {
    switch (event.key) {
      case 'ArrowDown':
        let nextCell =
          this.periodList.length > this.selectedIndex
            ? ++this.selectedIndex
            : this.periodList.length;
        if (this.periodList[nextCell] !== undefined) {
          this.selectedPeriod = this.periodList[nextCell];
          this.index = nextCell;
          document.getElementById(nextCell.toString())?.focus();
        }
        break;
      case 'ArrowUp':
        let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
        if (this.periodList[previousCell] !== undefined) {
          this.selectedPeriod = this.periodList[previousCell];
          this.index = previousCell;
          document.getElementById(previousCell.toString())?.focus();
        }
        break;
    }
  }
    openComponentPeriod(): void {
      const drawerRefCustomer = this.drawerService.create<
      periodsDrawerComponent ,
        { filter: number },
        number
      >({
        nzContent: periodsDrawerComponent,
        nzSize: 'large',
        nzContentParams: {
          filter: this.id > 0 ? this.id : 0,
        },
        nzClosable: false,
      });
      drawerRefCustomer.afterClose.subscribe({
        next: (data) => {
          this.id = 0;
          if (data != undefined && data != 0) {
            this.service.getById(data).subscribe({
              next: (r: PeriodsModel) => {
                 this.periodList[this.periodList.findIndex((r) => r.id == data)] !=
                undefined
                  ? (this.periodList[
                      this.periodList.findIndex((r) => r.id == data)
                    ] = r)
                  : this.periodList.unshift(r);
                           
              },
              error: () => {
                this.id = 0;
              },
            });
          }
        },
        error: () => {
          this.id = 0;
        },
      });
    }
    
    status(datos:PeriodsModel){
      if(this.id != 0){
        const model =datos;
        model.status=false;
        this.isSaving = true;
        this.service.savePeriod(model).subscribe({
        next: (r) => {
          this.showNotificationSuccess(
            'Guardado correcto',
            `Se ha creado correctamente el Período `
          );
  
          this.isSaving = false;
        },
        error: () => {
          this.isSaving = false;
          this.showMessageError('No se pudo actualizar el estado del Período')
        },
      });
      }
     
    }
  
    onScroll(event: any): void {
      let scrollHeight = event.target.scrollHeight;
      let scrolltop = event.target.scrollTop;
      let client = event.target.clientHeight;
      let ScrollPosition = Math.abs(
        Math.round(scrollHeight - (scrolltop + client))
      );
      if (
        ScrollPosition <= 5 &&
        this.totalItems / this.queryData.page > this.queryData.page
      ) {
        let page = this.queryData.page;
        this.queryData.page = this.queryData.page + 1;
        if (
          this.totalItems === undefined ||
          this.queryData.page * this.queryData.pageSize <= this.totalItems
        ) {
          this.service.getByFilter(this.queryData).subscribe({
            next: (r) => {
              r.data.map((period: PeriodsModel) =>
                this.periodList.push(period)
              );
              this.loading = false;
            },
            error: () => {
              this.loading = false;
              this.periodList = [];
            },
          });
        } else {
          this.queryData.page = page;
        }
      }
    }
   handleOk(){
      try {
       if (this.id != 0){
        this.popupComponent.elementSelectedToDelete= this.id
         this.status(this.selectedPeriod); 
         this.periodList
         this.popupComponent.isDeleteConfirmationVisible=false
       } else{
         this.showMessageError('Formulario vacio') 
       }
       } catch (error) {
         console.log(error);
       }   
    }
    
}  
  