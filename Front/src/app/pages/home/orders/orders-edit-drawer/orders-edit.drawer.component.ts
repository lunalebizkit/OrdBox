import { formatCurrency } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Input,
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
import {
  NewOrder,
  OrderDetailGrid,
  orderGridParser,
  orderGridProductParser,
  NewOrderDetail,
  orderNewProductParser,
  orderOldProductParser,
} from '../models/order.model';
import { OrdersService } from '../orders.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { eStatus, StatusType } from '../models/status-type.enum';
import { SendOrderEmail } from '../models/sendorderemail.model';

@Component({
  selector: 'app-orders-edit-drawer',
  templateUrl: './orders-edit.drawer.component.html',
  styleUrls: ['./orders-edit.drawer.component.css'],
})
export class OrdersEditDrawerComponent extends BaseComponent implements OnInit {
  @Input() set filter(value: number) {
    this.id = value;
  }
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('pop') popComponent!: PopupConfirmationComponent;

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: { filter: string };
    drawerRef: NzDrawerRef<string>;
  }>;

  /*
   ** Formularios
   */

  form!: FormGroup;
  formProductSearch!: FormGroup;
  formSupplierSearch!: FormGroup;
  /*
   ** Sppiner
   */

  isSaving!: boolean;
  loading!: boolean;

  /*
   ** Switch
   */
  switchValue!: boolean;
  switchSendValue!: boolean;
  emailList: string[]=[];

  /*
   ** Variables globales
   */
  id!: number;
  product!: string;
  dateFormat = 'dd/MM/yyyy';
  today = new Date();

  paymentSelected: any;
  supplierName!: string;
  statusId!: number;
  allStatus = StatusType;
  status: number = 0;
  email!: string;

  /*
   ** Fecha
   */
  dateTime!: Date;
  date = Date.now();
  startDate = Date.now();

  /*
   ** Si algunos campos son visibles o no
   */
  viewOrder: boolean = true;
  editOrder!: boolean;

  /*
   ** Deshabilitar
   */
  disabled: boolean = false;

  /*
   ** Lista de Detalle Productos/Orders7Costumer
   */
  orderDetailGrid: OrderDetailGrid[] = [];
  orderDetail: NewOrderDetail[] = [];
  orderListGrid: OrderDetailGrid[] = [];
  orderListGridTest: OrderDetailGrid[] = [];
  entityList: CustomerModel[] = [];
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
  editIdrecievedQuantity: number | null = null;

  /*
   ** Parametros de busqueda
   */
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 5,
  };
  queryData = {
    filter: '',
    page: 0,
    pageSize: 5,
  };

  constructor(
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private fb: FormBuilder,
    private entityService: EntityService,
    private ordersService: OrdersService,
    private drawerService: NzDrawerService,
    private serviceProduct: ProductService,
    private drawerRef: NzDrawerRef<string>,
    @Inject(LOCALE_ID) public locale: string
  ) {
    super(notificacionService, el, message);
    this.form = this.fb.group({
      statusId: [1, [Validators.required]],
      isPaid: [''],
      datetime: [new Date(), [Validators.required]],
      supplierEmail: new FormArray([]),
      emailEntity: new FormArray([]),
    });
    this.formProductSearch = this.fb.group({
      productSearchFilter: ['', [Validators.required]],
    });
    this.formSupplierSearch = this.fb.group({
      supplierId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.id != null || this.id != undefined || this.id != 0) {
      this.getOrder(this.id);
    }
  }

  /*
   ** Busqueda Proveedor
   */
  onSearch(data: string): void {
    if (data.length > 2) {
      this.queryParams.page = 0;
      this.queryParams.filter = data;
      this.getSupplier(this.queryParams);
    }
  }
  getSupplier(params: any): void {
    this.loading = true;
    this.entityService.getSuppliers(params).subscribe({
      next: (r) => {
        this.entityList = r.data;
        this.totalItems = r.totalCount;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.entityList = [];
      },
    });
  }

  onChange(id: number) {
    if (id != 0 && id != null)
      this.entityService.getSupplierById(id).subscribe({
        next: (r) => {
          r.emailEntity.forEach((e: any) => {
            this.emailsEntityArray.push(
              new FormControl(`${e}`, [Validators.required])
            );
          });
        },
        error: () => {},
      });
  }

  /*
   ** Obtener orden
   */

  getOrder(id: number): void {
    if (id != 0)
      this.ordersService.getById(id).subscribe({
        next: (r) => {
          this.viewOrder = false;
          this.supplierName = r.supplierName;
          this.formSupplierSearch.controls['supplierId'].setValue(r.supplierId);
          this.dateTime = r.dateTime;
          this.form.controls['statusId'].setValue(r.statusId);
          this.form.controls['isPaid'].setValue(r.isPaid);
          r.supplierEmail.forEach((e: any) => {
            this.emailsArray.push(
              new FormControl(`${e}`, [Validators.required])
            );
          });
          /*Bindeo detalles*/
          r.orderDetail.forEach((orderDetail: OrderDetailGrid) => {
            /**Parseo viejo Producto a Grid */
            this.orderListGridTest.push(orderGridParser(orderDetail));
            this.orderDetailGrid.push(orderGridParser(orderDetail));
            /* Parseo viejo Producto a Detalle*/
            this.orderDetail.push(orderOldProductParser(orderDetail));
          });
          if (r.statusId == 1) {
            this.editOrder = false;
            this.disabled = false;
          } else {
            this.editOrder = true;
            this.disabled = true;
          }
          this.totalCalculate();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  /*
   ** Guardar o actualizar una orden
   */

  save(): void {
    if (
      this.isValidForm(this.form) &&
      this.isValidForm(this.formSupplierSearch)
    ) {
      if (this.orderDetail.length === 0) {
        this.showMessageError('No hay Productos Seleccionados');
      } else {
        const model: NewOrder = {
          id: this.id !== undefined ? this.id : 0,
          supplierId: this.formSupplierSearch.controls['supplierId'].value,
          isPaid: this.form.controls['isPaid'].value,
          statusId:
            this.id != undefined && this.id == 0
              ? 1
              : this.form.controls['statusId'].value,
          orderDetail: this.orderDetail,
          dateTime: this.form.controls['datetime'].value,
          supplierName: null,
          supplierEmail:this.form.controls['emailEntity'].value
        };
        this.isSaving = true;
        this.ordersService.saveOrder(model).subscribe({
          next: (r) => {
            this.showNotificationSuccess(
              'Guardado correcto',
              `Se guardo correctamente el pedido`
            );
            this.isSaving = false;
            this.close(r.id);
          },
          error: () => {
            this.isSaving = false;
            this.showMessageError('No se pudo Guardar el pedido');
            this.close();
          },
        });
      }
    }
  }

  /*
   ** Obtener emails de proveedores
   */

  get emailsArray() {
    return this.form.controls['supplierEmail'] as FormArray;
  }
  get emailsControls() {
    return this.emailsArray.controls as FormControl[];
  }

  get emailsEntityArray() {
    return this.form.controls['emailEntity'] as FormArray;
  }

  get emailsEntityControls() {
    return this.emailsEntityArray.controls as FormControl[];
  }

  /*
   ** Calcular el valor total de la orden
   */

  totalCalculate(): void {
    this.subtotal = 0;
    this.total = 0;
    try {
      this.orderDetailGrid.forEach((detail) => {
        this.subtotal += detail.price * detail.orderedQuantity;
        this.total += detail.subTotal;
      });
    } catch (error) {
      console.log(error);
    }
  }

  startEdit(id: number): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  /*
   ** Cambiar cantidades el pedido
   */

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

  startEditrecievedQuantity(id: number): void {
    this.editIdrecievedQuantity = id;
  }

  stopEditrecievedQuantity(): void {
    this.editIdrecievedQuantity = null;
  }

  changeQuantityrecievedQuantity(quantity: number): void {
    if (quantity==0 ||quantity == null ) {
      quantity = 0;
    }
    this.orderDetail.filter(
      (detail) => detail.productId == this.editIdrecievedQuantity
    )[0].recievedQuantity = quantity;
    console.log(quantity)
  }

  /*
   ** Busqueda Producto
   */

  searchProduct(): void {
    this.product = this.formProductSearch.controls['productSearchFilter'].value;
    this.queryParams.filter = this.product;
    if (this.product.length > 0) {
      this.serviceProduct.getProducts(this.queryParams).subscribe({
        next: (r) => {
          if (r.data.length == 1) {
            const model: ProductsModel = r.data[0];
            if (this.orderDetail.find((item) => item.productId == model.id)) {
              /*Actualizo la lista que envio al back */
              this.orderDetail.filter(
                (item) => item.productId == model.id
              )[0].orderedQuantity += 1;

              /*Actualizo la lista de la tabla */
              this.orderDetailGrid.filter(
                (item) => item.id == model.id
              )[0].orderedQuantity += 1;

              this.orderDetailGrid.filter(
                (item) => item.id == model.id
              )[0].subTotal += model.purchasePrice * model.quantity;
              this.totalCalculate();
            } else {
              const product: ProductsModel = r.data[0];
              /* Parseo un Producto a Grid*/
              const model: OrderDetailGrid = orderGridProductParser(product);
              this.orderDetailGrid.push(model);
              /** Parse un Producto a OrderDetalle */
              const modelDetail: NewOrderDetail =
                orderNewProductParser(product);
              this.orderDetail.push(modelDetail);
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

  /*
   ** Abrir el Drawer
   */

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
        nzWidth: 1050,
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

              newListElement.orderedQuantity += 1;
              newListElement.subTotal +=
                data.purchasePrice * newListElement.orderedQuantity;

              this.totalCalculate();
            } else {
              /* Parseo dato Producto a la grilla de Tabla */
              const model: OrderDetailGrid = orderGridProductParser(data);
              this.orderListGridTest.push(model);
              this.orderDetailGrid = this.orderListGridTest;
              /* Parseo dato a Dto Order Detalle */
              const modelDetail: NewOrderDetail = orderNewProductParser(data);
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
        (element) => element.id != this.popupComponent.elementSelectedToDelete
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


    msjConfirmOk(){
      try {
        this.orderDetail = this.orderDetail.
        filter(element => element.productId != this.popupComponent.elementSelected);
      this.popupComponent.isConfirmationvisible = false; 
      if (
        this.isValidForm(this.form)
      || (this.orderDetailGrid.length === 0) ){
        this.save();
      } else{
        this.showMessageError('No ha seleccionado producto')
      }
      } catch (error) {
        console.log(error);
        
      }
    }
    msjConfirmOkEmail(){
      try {
        this.orderDetail = this.orderDetail.
        filter(element => element.productId != this.popupComponent.elementSelected);
      this.popupComponent.isConfirmationvisible = false; 
      if (
        this.isValidForm(this.form)
      || (this.orderDetailGrid.length === 0) ){
        this.saveAndSend();
      } else{
        this.showMessageError('No ha seleccionado producto')
      }
      } catch (error) {
        console.log(error);
        
      }
    }
    msjConfirmOkEmailOnly(){
      try {
        this.orderDetail = this.orderDetail.
        filter(element => element.productId != this.popupComponent.elementSelected);
      this.popupComponent.isConfirmationvisible = false; 
      if (
        this.isValidForm(this.form)
      || (this.orderDetailGrid.length === 0) ){
        this.sendEmail();
      } else{
        this.showMessageError('No ha seleccionado producto')
      }
      } catch (error) {
        console.log(error);
        
      }
    }

  getStatusName(id: number) {
    return eStatus[id];
  }

  currencyFormat(data: any): string {
    return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2');
  }

  close(id: number | void): void {
    this.drawerRef.close(id);  }
/*
   ** Enviar solo el email
   */
  sendEmail(){
    if(this.emailList.length>0){
    const model: SendOrderEmail = {
      id: this.id,
      emails: this.emailList
    }
    this.ordersService.sendEmail(model).subscribe({
      next: (r) => {
        this.showNotificationSuccess(
          'Email enviado correctamente',
          `Se realizo correctamente el envio del email`
        );
        this.isSaving = false;
        this.close(r.id);
      },
      error: () => {
        this.isSaving = false;
        this.showMessageError('No se pudo realizar el envio del email');
        this.close();
      },
    })} else {
      this.showMessageError('No hay emails seleccionados');
    }
  }
  /*
   ** Guardar pedido y enviar email
   */
  saveAndSend(): void {
    if(this.emailList.length>0){
      
    
    if (
      this.isValidForm(this.form) &&
      this.isValidForm(this.formSupplierSearch)
    ) {
      if (this.orderDetail.length === 0) {
        this.showMessageError('No hay Productos Seleccionados');
      } else {
        const model: NewOrder = {
          id: this.id !== undefined ? this.id : 0,
          supplierId: this.formSupplierSearch.controls['supplierId'].value,
          isPaid: this.form.controls['isPaid'].value,
          statusId:
            this.id != undefined && this.id == 0
              ? 1
              : this.form.controls['statusId'].value,
          orderDetail: this.orderDetail,
          dateTime: this.form.controls['datetime'].value,
          supplierName: null,
          supplierEmail:this.emailList
        };
        this.isSaving = true;
        this.ordersService.saveOrderAndSendEmail(model).subscribe({
          next: (r) => {
            this.showNotificationSuccess(
              'Guardado y enviado correcto',
              `Se guardo correctamente el pedido y se envio el email`
            );
            this.isSaving = false;
            this.close(r.id);
          },
          error: () => {
            this.isSaving = false;
            this.showMessageError('No se pudo Guardar el pedido');
            this.close();
          },
        });
      }
    }
  } else {
    this.showMessageError('No hay emails seleccionados');
  }
  }
  /*
   ** Seleccionar email/s para enviar
   */
  // selectEmails(){
  //   let emails = ["carlabgo95@gmail.com", "carlabgo95@hotmail.com"];
  //   this.emailsEntityArray.setValue(emails)
  //   console.log(this.emailsArray)
  // }
  selectEmails(data:string,) {

    let isEmail=this.emailList.find((email:string)=> email == data);
    
    if (isEmail){
      this.emailList= this.emailList.filter((email:string) => email != data)
    }else{
      this.emailList.push(data);
    }
    console.log(this.emailList);
    
  }
}
