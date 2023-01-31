import { Component, ElementRef, Inject, Input, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { PeriodsModel } from 'src/app/pages/home/periods/model/periods.model';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PeriodsService } from '../periods.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute } from '@angular/router';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { DatePipe, formatDate } from '@angular/common';
import { DisabledTimeFn, DisabledTimePartial } from 'ng-zorro-antd/date-picker';



@Component({
  selector: 'app-new-periods-drawer',
  templateUrl: './new-periods.drawer.component.html',
})
export class periodsDrawerComponent  extends BaseComponent implements OnInit {
  newInitDate!: any;
  disabled: boolean = false;
  @Input() set filter(value: number) {
    this.id = value;
  }

  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('popup') popComponent!: PopupConfirmationComponent;
  
  periodList:PeriodsModel[] = [];
  period: any ;
  queryData = {
    filter: '',
    page: 0,
    pageSize: 10,
  }; 

  isLoading!: boolean;
  isSaving!: boolean;
  form!: FormGroup;
  id!: number;
  editPeriod :boolean= false
  
  constructor(
    private service: PeriodsService,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private drawerRef: NzDrawerRef<string>,
    @Inject(LOCALE_ID) public locale: string,
  ) {
    super(notificacionService, el, message);
    this.form = this.fb.group({
      initPeriod: ['', Validators.required],
      endPeriod:['', Validators.required],
    });
  }
 ngOnInit(): void {
  if (this.id != null || this.id != undefined || this.id != 0) {
    this.getPeriod(this.id);
  }
  this.getData(this.queryData)
  
 } 
 getPeriod(id: number): void {
  if (id != 0) {
    this.service.getById(id).subscribe({
      next: (r) => {
        this.editPeriod = true
        this.form.controls['initPeriod'].setValue(this.formaterDate(r.initPeriod));
        this.form.controls['endPeriod'].setValue(this.formaterDate(r.endPeriod));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
getData(params: any): void {
  this.service.getByFilter(params).subscribe({
    next: (r) => {
      this.periodList = r.data;
      this.period = this.periodList.find(element => element.endPeriod)?.endPeriod
      this.sumarDias(new Date(this.period), 1)
      
    },
    error: () => {
      this.isLoading = false;
    },
  });
}
sumarDias(fecha:any, dias: any){
  fecha.setDate(fecha.getDate ()+ dias);
  this.period = fecha
  return fecha;
} 

save(): void {
  if (this.isValidForm(this.form)) {
    const model: PeriodsModel = {
      id: this.id !== undefined ? this.id : 0,
      initPeriod: this.form.controls['initPeriod'].value,
      endPeriod: this.form.controls['endPeriod'].value,
      status: true
    };
    this.isSaving = true;
    this.service.savePeriod(model).subscribe({
      next: (r) => {
        this.showNotificationSuccess(
          'Guardado correcto',
          `Se guardo correctamente el Período`
        );

        this.isSaving = false;
         this.close(r.id); 
      },
      error: () => {
        this.isSaving = false;
        this.showMessageError('No se pudo Guardar el Período, verifique si tiene períodos abiertos');
         this.close(); 
      },
    });
  }
}
close(id: number | void): void {
  this.drawerRef.close(id);
}

msjConfirmOk(){
  try {
   if (this.isValidForm(this.form)){
     this.popComponent.showConfirmation();
   } else{
     this.showMessageError
   }
   } catch (error) {
     console.log(error);
     
   }
}
formaterDate(date: string | number | Date): string {
  return formatDate(date, 'MM/dd/YYYY', this.locale);
}
}

  


 

