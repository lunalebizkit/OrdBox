import { formatCurrency } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  LOCALE_ID,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { DeliveryNotesDetails, DeliveryNotesModel } from '../model/deliveryNotes.model';
import { deliveryNotesService } from '../deliveryNotes.service';
import { pStatusType } from '../model/status.model';
import { EntityService } from '../../customers/customer.service';
import { ProductService } from '../../products/product.service';

@Component({
  selector: 'app-deliveryNotes-view-drawer',
  templateUrl: './deliveryNotes-view-drawer.component.html',
  styleUrls: ['./deliveryNotes-view-drawer.component.css'],
})
export class DeliveryNotesViewDrawerComponent
  extends BaseComponent
  implements OnInit
{
  descripcion: any;
  price: any;
  supplierName!: string;
  supplierCuit!: string;
  supplierAddress!: string;

  
  @Input() set filter(value: number) {
    this.id = value;
  }

  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;

  // variables Generales
  isLoading = true;
  loading!: boolean;
  isSaving!: boolean;
  id!: number;
  tipo!: string;

  //Variables del comprobante
  userId!: number;
  supplierId!: number;
  name!: string;
  address!:string;
  cuit!: string;
  importTotal!: number;
  productId!: number;
  deliveryNotesNumber!:number;
  observation!: string;
  dateTime!: Date;
  paid!: boolean;
  statusId!:number;
  subTotal!: number;
  total!: number;
  ivaTotal!: number;
  type: any;
  formDeliveryNotes!: FormGroup;
  
  
 deliveryNotesDetails: DeliveryNotesDetails[]=[]

  form!: FormGroup;
  constructor(
    notificacionService: NzNotificationService,
    private service: deliveryNotesService,
    private serviceSupplier: EntityService,
    private serviceProduct: ProductService,
    el: ElementRef,
    message: NzMessageService,
    private drawerRef: NzDrawerRef<string>,
    @Inject(LOCALE_ID) public locale: string
  ) {
    super(notificacionService, el, message);
  }

  ngOnInit(): void {
    if (this.id != null || this.id != undefined || this.id != 0) {
      this.getDeliveryNotes(this.id);      
    }
  }
  getDeliveryNotes(id: number): void {
    if (id != 0)
      this.service.getDeliveryNotesById(id).subscribe({
        next: (r: DeliveryNotesModel) => {
            this.deliveryNotesNumber= this.id
            this.statusId= r.statusId
            this.paid = r.paid
            this.supplierId= r.supplierId
            this.supplierName= r.supplierName
            this.supplierCuit= r.supplierCuit
            this.supplierAddress= r.supplierAddress
            this.dateTime = r.dateTime,
            this.observation = r.observation,
            this.isLoading = false;
            this.deliveryNotesDetails= r.deliveryNotesDetails;
            this.importTotal= r.importTotal;
            this.observation = r.observation;  
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
  getTipo(tipo : number):any {
    switch (tipo){
      case  pStatusType.Entregado:
        return this.tipo = 'Entregado'
      case  pStatusType.Rechazado :
       return this.tipo = 'Rechazado'
      case  pStatusType.Pendiente :
       return this.tipo = 'Pendiente'
    }
}
getStatusName(id: number) {
  return pStatusType [id];
}


  currencyFormat(data: any): string {
    if (!this.locale) return '';
    return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2');
  }
  close(): void {
    this.drawerRef.close();
  }
}