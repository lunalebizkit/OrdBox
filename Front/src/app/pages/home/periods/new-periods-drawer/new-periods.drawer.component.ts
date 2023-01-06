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
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-new-periods-drawer',
  templateUrl: './new-periods.drawer.component.html',
})
export class periodsDrawerComponent  extends BaseComponent implements OnInit {
  @Input() set filter(value: number) {
    this.id = value;
  }

  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;

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
     this.save();
   } else{
     this.showMessageError('Formulario Vacío')
   }
   } catch (error) {
     console.log(error);
     
   }
}
formaterDate(date: string | number | Date): string {
  return formatDate(date, 'YYYY-MM-dd', this.locale);
}
  
}

  


 
