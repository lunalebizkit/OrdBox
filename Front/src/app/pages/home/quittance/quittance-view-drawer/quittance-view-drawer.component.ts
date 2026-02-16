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
import { EntityService } from '../../customers/customer.service';
import { ProductService } from '../../products/product.service';
import { quittanceDetails, quittanceModel, QuittanceProductDetails } from '../model';
import { QuittanceService } from '../quittance.service';

@Component({
  selector: 'app-quittance-view-drawer',
  templateUrl: './quittance-view-drawer.component.html',
  styleUrls: ['./quittance-view-drawer.component.css'],
})
export class QuittanceViewDrawerComponent
  extends BaseComponent
  implements OnInit
{
  descripcion: any;
  price: any;
  customerName!: string;
  customerCuit!: string;
  
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
  customerId!: number;
  name!: string;
  address!:string;
  cuit!: string;
  importTotal!: number;
  productId!: number;
  quittanceNumber!:number;
  concept!: string;
  cash!: number;
  dateTime!: Date;
  paid!: boolean;
  statusId!:number;
  subTotal!: number;
  total!: number;
  ivaTotal!: number;
  type: any;
  
  
 quittanceDetails: quittanceDetails[]=[];
 quittanceProductDetails: QuittanceProductDetails[]=[];

  form!: FormGroup;
  constructor(
    notificacionService: NzNotificationService,
    private service: QuittanceService,
    el: ElementRef,
    message: NzMessageService,
    private drawerRef: NzDrawerRef<string>,
    @Inject(LOCALE_ID) public locale: string
  ) {
    super(notificacionService, el, message);
  }

  ngOnInit(): void {
    if (this.id != null || this.id != undefined || this.id != 0) {
      this.getQuittance(this.id);      
    }
  }
  getQuittance(id: number): void {
    if (id != 0)
      this.service.getById(id).subscribe({
        next: (r: quittanceModel) => {
            this.id= this.id,
            this.quittanceNumber= r.quittanceNumber
            this.customerName= r.customerName
            this.customerCuit= r.customerCuit
            this.address= r.address
            this.dateTime = r.dateTime,
            this.cash=r.cash,
            this.concept= r.concept,
            this.total= r.total
            this.quittanceDetails = r.quittanceDetails;
            this.quittanceProductDetails = r.quittanceProductDetails;
            this.isLoading = false;
          
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  currencyFormat(data: any): string {
    if (!this.locale) return '';
    return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2');
  }
  close(): void {
    this.drawerRef.close();
  }
}