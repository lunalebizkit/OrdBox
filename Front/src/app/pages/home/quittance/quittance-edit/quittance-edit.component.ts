import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormArray, FormArrayName, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { environment } from '../../../../../environments/environment';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { EntityService } from "../../customers/customer.service";
import { PopupConfirmationComponent } from "src/app/common/components/popup-confirmation/popup-confirmation.component";
import { ActivatedRoute, Router } from "@angular/router";
import { formatCurrency, formatDate } from '@angular/common';
import { Inject, LOCALE_ID } from '@angular/core';
import { QuittanceService } from "../quittance.service";
import { quittanceDetails, quittanceModel } from "../model";
import { InvoiceCustomerSearchComponent } from "../../invoices/invoice-customer-search/invoice-customer-search.component";
import { CustomerModel } from "../../customers/model/customer.model";


@Component({
  selector: 'app-quittance-edit',
  templateUrl: './quittance-edit.component.html',
  styleUrls: ['./quittance-edit.component.css']
})
export class QuittanceEditComponent extends BaseComponent implements OnInit {
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('pop') popComponent!: PopupConfirmationComponent;

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: { filter: string },
    drawerRef: NzDrawerRef<string>;
  }>;
  edit: boolean = false;
  form: any;
  @Input() set filter(value: number) {
    this.id = value;
  }
  showPasswordChange = true;
  loading = false;
  startDate = this.formaterDate(Date.now());
  formQuittance!: FormGroup;
  formCustomerSearch!: FormGroup;
  quittanceDetails:Array<any>[]=[];
  quittanceDetailsList: quittanceDetails[] = [];
  formQuittanceDetails!:FormGroup
  isLoading: boolean = false;
  id!: number;
  cuit!: string;
  customerId!: number;
  editId: number | null = null;
  isSaving!: boolean;
  totalItems: number = 0;
  total!: number;
  userId!: number;
  name!: string;
  address!: string;
  bank!: string; 
  checkNumber!:string;
  dateTime!: Date;
  subtotal: number = 0;
  quittance!:Array<quittanceDetails>

  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10,
  };

  constructor(notificacionService: NzNotificationService,
    private serviceEntity: EntityService,
    private service: QuittanceService,
    private router: Router,
    private route: ActivatedRoute,
    el: ElementRef,
    message: NzMessageService,
    private drawerService: NzDrawerService,
    private fb: FormBuilder,
    @Inject(LOCALE_ID) public locale: string) {
    super(notificacionService, el, message)
    this.formQuittance = this.fb.group({
      dateTime: [new Date(this.startDate), Validators.required],
      quittanceNumber: [0, Validators.required],
      address: ['', Validators.required],
      customerCuit: ['', [Validators.required, Validators.pattern('[0-9]{11}'),]],
      customerName: ['', Validators.required],
      concept:['', Validators.required],
      cash:['', Validators.required],
    total:[0],
    quittanceDetails: new FormArray([])  }); 

    this.formCustomerSearch = this.fb.group({})
    
  }

  get quittanceDetailsFormGroups() : FormArray {
    return this.formQuittance.get('quittanceDetails') as FormArray
  } 

  ngOnInit() {
    this.route.params.subscribe(params => { this.id = params['id']; })
    if (this.id != undefined) {
      this.getQuittance(this.id);
      this.edit=false
    }
    
  }
  getQuittance(id: number): void {
    if (this.id != 0 || this.id !== undefined)
      this.service.getById(this.id).subscribe({
        next: (r) => {
          this.id = id
          this.formQuittance.controls['quittanceNumber'].setValue(r.id)
            this.formQuittance.controls['address'].setValue(r.address),
            this.formQuittance.controls['customerCuit'].setValue(r.customerCuit),
            this.formQuittance.controls['customerName'].setValue(r.customerName),
            this.formQuittance.controls['cash'].setValue(r.cash)
            this.formQuittance.controls['concept'].setValue(r.concept),
            this.dateTime = r.dateTime
            this.isLoading = false;
            this.subtotal = r.total; 
            r.quittanceDetails.map((data:any,key:any)=>{
              this.showPasswordChangeBox(data,key)
              this.quittanceDetails.push(data)
            })
        
        },
          
        error: () => {
          this.isLoading = false;
        },
        
      });   
  }

  currencyFormat(data: any): string {
    return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2');
  }


  formaterDate(date: string | number | Date): string {
    return formatDate(date, 'MM/dd/YYYY', this.locale);
  }
  direction() {
    this.router.navigate(['/home/quittance']);
  }
  
  showPasswordChangeBox(data?:any,key?:any): void {
    let newQuittancegroup = this.fb.group({
          checkNumber:[''],    
          bank: [''], 
          total: [''],
          
    })
    
    this.quittanceDetailsFormGroups.push(newQuittancegroup );
    if(data != undefined){
    this.quittanceDetailsFormGroups.controls[key].get('checkNumber')?.setValue(data.checkNumber)
    this.quittanceDetailsFormGroups.controls[key].get('bank')?.setValue(data.bank)
    this.quittanceDetailsFormGroups.controls[key].get('total')?.setValue(data.total)
    }
    
}

removeCheck( e: MouseEvent, index: any): void {
  
  e.preventDefault();
 this.quittanceDetailsFormGroups.removeAt(index)
};

  save(): void {
    {
      //EDITAR
      if (this.id > 0) {
        const model = this.formQuittance.getRawValue();
        model.id = this.id;  
        console.log(model)
        this.isSaving = true;
        this.service.editQuittance(model)
          .subscribe({
            next: (r) => {
              this.showNotificationSuccess(
                'Guardado correcto',
                `Recibo editado correctamente`
              );
              this.isSaving = false;
              this.router.navigate(['/home/quittance']);
            },
            error: (r) => {
              this.isSaving = false;
              this.showMessageError(r.error)
            }
          });
        //GUARDAR
      } else {
       const model = this.formQuittance.getRawValue();
        model.id = this.id;  
        console.log(model);
        console.log(this.formQuittance.getRawValue());
        
        
         
        this.isSaving = true;
        this.service.saveQuittance(model)
          .subscribe({
            next: (r) => {
              this.showNotificationSuccess(
                'Guardado correcto',
                `Recibo creado correctamente`
              );
              this.isSaving = false;
              this.router.navigate(['/home/quittance']);
            },
            error: (r) => {
              this.isSaving = false;
              this.showMessageError(r.error)
            }
          });
      }
    }

  };
  searchCustomer(): void {
    this.cuit =
      this.formQuittance.controls['customerCuit'].value;
    if (this.cuit == '00'){
      this.formQuittance.controls['address'].setValue('S/D');
      this.formQuittance.controls['customerCuit'].setValue('00');
      this.formQuittance.controls['customerName'].setValue('Admin');  
      this.customerId= 0;
      return;
    }else{
    if (this.cuit.length >= 6) {
      this.serviceEntity.getByCuit(this.cuit).subscribe({
        next: (data) => {
          this.formQuittance.controls['address'].setValue(data.address);
          this.formQuittance.controls['customerCuit'].setValue(data.cuit);
          this.formQuittance.controls['customerName'].setValue(data.name);
          console.log(data);
          
          
        },
        error: () => {this.showMessageError('No se encontro Cliente'); }
      });
    }}
  };

  openComponentCustomer(): void {
    const drawerRefCustomer = this.drawerService.create<InvoiceCustomerSearchComponent, {}, CustomerModel>({
      nzTitle: 'Cliente',
      nzContent: InvoiceCustomerSearchComponent,
      nzSize: 'large',
      nzWidth: '90%',
      nzClosable: false
    });
    drawerRefCustomer.afterClose.subscribe({
      next: (data) => {
        if (data != undefined) {
          this.customerId = data.id;
          this.formQuittance.controls['address'].setValue(data.address);
          this.formQuittance.controls['customerCuit'].setValue(data.cuit);
          this.formQuittance.controls['customerName'].setValue(data.name);
        }
      },
      error: () => {

      }

    })
  };

  msjConfirmOk() {
    try {
      if (this.isValidForm(this.formCustomerSearch)) {
        this.popComponent.showConfirmation()
      } else {
        this.showMessageError('Error de formulario');
      }
    } catch (error) { }
  }
}