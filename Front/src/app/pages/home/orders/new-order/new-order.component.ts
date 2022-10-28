import { formatCurrency } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  LOCALE_ID,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { EntityService } from '../../customers/customer.service';
import { CustomerModel } from '../../customers/model/customer.model';
import { InvoiceProductSearchComponent } from '../../invoices/invoice-product-search/invoice-product-search.component';
import { ProductsModel } from '../../products/model/product.model';
import { ProductService } from '../../products/product.service';
import { NewOrder, OrderDetailGrid, orderDetailParser, OrderDetail, orderGridParser } from '../models/order.model';
import { OrdersService } from '../orders.service';
import { differenceInCalendarDays, setHours } from 'date-fns';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
})
export class NewOrderComponent extends BaseComponent implements OnInit {
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: { filter: string };
    drawerRef: NzDrawerRef<string>;
  }>;
 
  

  constructor(
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private fb: FormBuilder,
    private entityService: EntityService,
    private ordersService: OrdersService,
    private drawerService: NzDrawerService,
    private serviceProduct: ProductService,
    @Inject(LOCALE_ID) public locale: string
  ) {
    super(notificacionService, el, message);
    this.form = this.fb.group({      
      isPaid: ['', ],
      email: ['', ],
      send: ['', ],
      email2: ['', ],
      send2: ['', ],
      datetime: [new Date, [Validators.required]],
      emailEntity: new FormArray([]),
    });
    this.formProductSearch = this.fb.group({
      productSearchFilter: [''],
    });
    this.formSupplierSearch = this.fb.group({
      supplierId: [ '', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  form!: FormGroup;
  formProductSearch!: FormGroup;
  formSupplierSearch!: FormGroup;
  isSaving!: boolean;
  loading!: boolean;
  isVisible = false;
  switchValue = false;
  datetime = null;
  fecha = 'Elige una fecha';
  isConfirmLoading = false;
  id!: number;
  product!: string;
  dateFormat = 'dd/MM/yyyy';
  today = new Date();
  orderListGrid: OrderDetailGrid[] = [];
  orderListGridTest: OrderDetailGrid[] = [];
  entityList: CustomerModel[]=[];
  paymentSelected: any;  
  supplierName!: string;
  /*
   ** Lista de Productos
   */
  orderDetailGrid: OrderDetailGrid[] = [];
  orderDetail: OrderDetail[] = [];

  /*
   ** Cantidad total de productos
   */
  totalItems: number = 0;
  subtotal: number = 0;
  iva: number = 21;
  total: number = 0;
  ivaTotal: number = 0;

  /*
   **Variables de la tabla detalle
   */
  editId: number | null = null;

  /*
   ** Parametros de busqueda
   */
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10,
  };

  onSearch(data:string): void { 
    if (data.length > 2){
      this.queryParams.page=0; 
      this.queryParams.filter=data; 
      this.getSupplier(this.queryParams); 
    }   
   }; 
   getSupplier(params: any): void {
    this.loading= true;
    this.entityService.getSuppliers(params).subscribe({
      next: (r)=>{
        this.entityList= r.data;
        this.totalItems = r.totalCount;
        this.loading = false;
      },
      error: ()=>{
        this.loading = false;
        this.entityList = [];
      }
    })}
    
   
  save(): void {
    console.log(this.form);
    
    if (this.isValidForm(this.form) && (this.orderDetail.length > 0)) {     
      const model: NewOrder = {
        id: this.id !== undefined ? this.id : 0,
        supplierId: this.formSupplierSearch.controls['supplierId'].value,
        isPaid: this.form.controls['isPaid'].value,
        email: this.form.controls['email'].value,
        statusId: 1,
        orderDetail: this.orderDetail,
        datetime: this.form.controls['datetime'].value 
      };
      this.isSaving = true;
      this.ordersService.saveOrder(model).subscribe({
        next: (r) => {
          this.showNotificationSuccess(
            'Guardado correcto',
            `Se guardo correctamente el pedido`
          );
          this.isSaving = false;
          this.headerComponent.goBack();
        },
        error: () => {
          this.isSaving = false;
          this.showMessageError('No se pudo Guardar el pedido');
        },
      });
    }
  }
  queryData = {
    filter: '',
    page: 0,
    pageSize: 10,
  };

  get emailsArray() {
    return this.form.controls['emailEntity'] as FormArray;
  }

  get emailsControls() {
    return this.emailsArray.controls as FormControl[];
  }

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) < 0;

  totalCalculate(): void {
    this.subtotal = 0;
    this.total = 0;
    try {
      this.orderDetailGrid.forEach((detail) => {
        this.subtotal +=
          detail.price * detail.quantity;
        this.total += detail.subTotal
      });        
      }
     catch (error) {
      console.log(error);
    }
  }  

  startEdit(id: number): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  changeQuantity(quantity: number): void {
    if (quantity == 0 || quantity == null) {
      quantity = 1;
    }
    let product = this.orderDetail.filter(
      (detail) => detail.id == this.editId
    )[0];
    let productGrid = this.orderDetailGrid.filter(
      (detail) => detail.id == this.editId
    )[0];

    this.orderDetailGrid.filter(
      (detail) => detail.id == this.editId
    )[0].subTotal = quantity * productGrid.price;

    this.totalCalculate();
    this.orderDetail.filter(
      (detail) => detail.productId == this.editId
    )[0].orderedQuantity = quantity;
  }

  searchProduct(): void {
    this.product = this.formProductSearch.controls['productSearchFilter'].value;
    this.queryParams.filter = this.product;
    if (this.product.length > 0) {
      this.serviceProduct.getProducts(this.queryParams).subscribe({
        next: (r) => {
          if (r.data.length == 1) {
            const model: ProductsModel = r.data[0];
            if (
              this.orderDetail.find((item) => item.productId == model.id)
            ) {
              /*Actualizo la lista que envio al back */
              this.orderDetail.filter(
                (item) => item.productId == model.id
              )[0].orderedQuantity += 1;

              /*Actualizo la lista de la tabla */
              this.orderDetailGrid.filter(
                (item) => item.id == model.id
              )[0].quantity += 1;

              this.orderDetailGrid.filter(
                (item) => item.id == model.id
              )[0].subTotal += model.purchasePrice * model.quantity;
              this.totalCalculate();
            } else {
              const product: ProductsModel = r.data[0];
              const model: OrderDetail= orderDetailParser(product);
              this.orderDetail.push(model);
              this.totalCalculate();
            }
          } else {
            this.openComponentProduct();
          }
        },
        error: () => {},
      });
    }
  }

  openComponentProduct(): void {
    if (true) {
      const drawerRefProduct = this.drawerService.create<
        InvoiceProductSearchComponent,
        { filter: string },
        ProductsModel
      >({
        nzTitle: 'Productos',
        nzContent: InvoiceProductSearchComponent,
        nzSize: 'large',
        nzContentParams: {
          filter: this.formProductSearch.controls['productSearchFilter'].value,
        },
        nzClosable: false,
      });

      drawerRefProduct.afterClose.subscribe({
        next: (data: ProductsModel) => {
          
          if (data != undefined) {
            if (this.orderDetail.find((item) => item.productId == data.id)) {
              /*Actualizo la lista que envio al back */
              this.orderDetail.filter(
                (item) => item.productId == data.id
              )[0].orderedQuantity += 1;

              /*Actualizo la lista de la tabla */
              let newListElement = this.orderDetailGrid.filter(
                (item) => item.id == data.id
              )[0];

              newListElement.quantity += 1;
              newListElement.subTotal +=
                data.purchasePrice * newListElement.quantity;

              this.totalCalculate();
            } else {
              /* Parseo dato a la grilla de Tabla */
              const model: OrderDetailGrid = orderGridParser(
                data
              );
              this.orderListGridTest.push(model);
              this.orderDetailGrid = this.orderListGridTest;
              /* Parseo dato a Dto Factura Detalle */
              const modelDetail: OrderDetail = orderDetailParser(
                data
              );
              this.orderDetail.push(modelDetail);
              this.totalCalculate();
            }
          }
        },
        error: () => {
          this.orderDetailGrid = [];
        },
      });
    } else {
      return;
    }
  }

  handleOk() {
    try {
      this.orderListGridTest = this.orderDetailGrid.filter(
        (element) =>
          element.id != this.popupComponent.elementSelectedToDelete
      );
      this.orderDetail = this.orderDetail.filter(
        (element) =>
          element.productId != this.popupComponent.elementSelectedToDelete
      );
      this.popupComponent.isDeleteConfirmationVisible = false;
      if (this.orderListGridTest.length == 0) {
        this.orderDetailGrid = [];
      } else {
        this.orderDetailGrid = this.orderListGridTest;
      }

      this.totalCalculate();
    } catch (error) {
      console.log(error);
    }
  }

  currencyFormat(data: any): string {
    return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2');
  }

  addEmailField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    let emailForm = this.form.controls['emailEntity'] as FormArray;
    emailForm.push(new FormControl(''));
  }

  removeEmailField(e: MouseEvent, index: number): void {
    e.preventDefault();
    this.emailsArray.removeAt(index);
  }
}
