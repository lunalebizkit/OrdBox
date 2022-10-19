import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { CustomerModel } from '../../customers/model/customer.model';
import { InvoiceProductSearchComponent } from '../../invoices/invoice-product-search/invoice-product-search.component';
import {
  InvoiceDetailList,
  InvoiceDetails,
  invoiceGridParser,
  invoiceDetailParser,
} from '../../invoices/model/invoice.model';
import { ProductsModel } from '../../products/model/product.model';
import { ProductService } from '../../products/product.service';
import {
  OrderAddModel,
  OrderDetailList,
  OrderDetails,
} from '../models/order.model';
import { OrdersService } from '../orders.service';

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
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private drawerService: NzDrawerService,
    private serviceProduct: ProductService
  ) {
    super(notificacionService, el, message);
    this.form = this.fb.group({
      supplier: ['', [Validators.required]],
      date: ['', [Validators.required]],
      isPaid: ['', [Validators.required]],
      email: ['', [Validators.required]],
      send: ['', [Validators.required]],
      email2: ['', [Validators.required]],
      send2: ['', [Validators.required]],
    });
    this.formProductSearch = this.fb.group({
      productSearchFilter: [''],
    });
  }

  ngOnInit(): void {}

  form!: FormGroup;
  formProductSearch!: FormGroup;
  isSaving!: boolean;
  isVisible = false;
  switchValue = false;
  date = null;
  fecha = 'Elige una fecha';
  isConfirmLoading = false;
  id!: number;
  product!: string;
  orderListTest: OrderDetailList[] = [];
  invoiceDetailsList: InvoiceDetailList[] = [];
  invoiceDetails: InvoiceDetails[] = [];

  paymentSelected: any;
  /*
   ** Lista de Productos
   */
  customer: CustomerModel[] = [];
  invoiceDetailList: InvoiceDetailList[] = [];
  orderDetailList: OrderDetailList[] = [];
  orderDetails: OrderDetails[] = [];

  /*
   ** Catidad total de productos
   */
  totalItems: number = 0;
  subtotal: number = 0;
  iva: number = 21;
  total: number = 0;
  ivaTotal: number = 0;

  /*
   ** Parametros de busqueda
   */
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10,
  };

  save(): void {
    if (this.isValidForm(this.form)) {
      const model: OrderAddModel = {
        id: this.id !== undefined ? this.id : 0,
        supplier: this.form.controls['supplier'].value,
        date: this.form.controls['date'].value,
        isPaid: this.form.controls['isPaid'].value,
        email: this.form.controls['email'].value,
        send: this.form.controls['send'].value,
        email2: this.form.controls['email2'].value,
        send2: this.form.controls['send2'].value,
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

  totalCalculate(): void {
    this.subtotal = 0;
    this.total = 0;
    this.ivaTotal = 0;
    try {
      this.invoiceDetailsList.forEach((detail) => {
        this.subtotal +=
          detail.price * detail.quantity -
          this.ivaCalculate(detail.price * detail.quantity, detail.iva);
      });
      this.invoiceDetailsList.forEach((dato) => {
        this.ivaTotal += this.ivaCalculate(
          dato.price * dato.quantity,
          dato.iva
        );
        this.total += dato.price * dato.quantity;
      });
    } catch (error) {
      console.log(error);
    }
  }

  bindPrice(data: ProductsModel): number {
    const typePayment = this.paymentSelected;
    var a = Object.keys(data).filter((type) => type == typePayment);
    switch (a[0]) {
      case 'cardSalePrice':
        return data.cardSalePrice;

      case 'salePrice':
        return data.salePrice;

      default:
        return data.cashSalePrice;
    }
  }

  ivaCalculate(data: number, iva: number): number {
    return (data * iva) / 100;
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
              this.invoiceDetails.find((item) => item.productId == model.id)
            ) {
              /*Actualizo la lista que envio al back */
              this.invoiceDetails.filter(
                (item) => item.productId == model.id
              )[0].quantity += 1;

              /*Actualizo la lista de la tabla */
              this.invoiceDetailsList.filter(
                (item) => item.ownCode == model.id
              )[0].quantity += 1;

              this.invoiceDetailsList.filter(
                (item) => item.ownCode == model.id
              )[0].subTotal += this.bindPrice(model) * model.quantity;
              this.totalCalculate();
            } else {
              const product: ProductsModel = r.data[0];
              const model: InvoiceDetails = {
                id: 0,
                invoiceId: 0,
                productId: product.id,
                productName: product.description,
                productCode: product.code,
                quantity: 1,
                price: this.bindPrice(product),
                iva: this.iva,
              };
              this.invoiceDetails.push(model);
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
            if (this.orderDetails.find((item) => item.productId == data.id)) {
              /*Actualizo la lista que envio al back */
              this.orderDetails.filter(
                (item) => item.productId == data.id
              )[0].quantity += 1;

              /*Actualizo la lista de la tabla */
              let newListElement = this.orderDetailList.filter(
                (item) => item.ownCode == data.id
              )[0];

              newListElement.quantity += 1;
              newListElement.subTotal +=
                this.bindPrice(data) * newListElement.quantity;

              this.totalCalculate();
            } else {
              /* Parseo dato a la grilla de Tabla */
              const model: OrderDetailList = invoiceGridParser(
                data,
                this.iva,
                this.bindPrice(data)
              );
              this.orderListTest.push(model);
              this.orderDetailList = this.orderListTest;
              /* Parseo dato a Dto Factura Detalle */
              const modelDetail: OrderDetails = invoiceDetailParser(
                data,
                this.iva,
                this.bindPrice(data)
              );
              this.orderDetails.push(modelDetail);
              this.totalCalculate();
            }
          }
        },
        error: () => {
          this.orderDetailList = [];
        },
      });
    } else {
      return;
    }
  }

  handleOk() {
    try {
      this.orderListTest = this.orderDetailList.filter(
        (element) =>
          element.ownCode != this.popupComponent.elementSelectedToDelete
      );
      this.orderDetails = this.orderDetails.filter(
        (element) =>
          element.productId != this.popupComponent.elementSelectedToDelete
      );
      this.popupComponent.isDeleteConfirmationVisible = false;
      if (this.orderListTest.length == 0) {
        this.orderDetailList = [];
      } else {
        this.orderDetailList = this.orderListTest;
      }

      this.totalCalculate();
    } catch (error) {
      console.log(error);
    }
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
}
