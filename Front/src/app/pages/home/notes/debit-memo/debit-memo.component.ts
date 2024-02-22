import { formatCurrency, formatDate } from '@angular/common';
import { Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/common/auth/interceptors/auth.service';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { EntityService } from '../../customers/customer.service';
import { CustomerModel } from '../../customers/model/customer.model';
import { InvoiceCustomerSearchComponent } from '../../invoices/invoice-customer-search/invoice-customer-search.component';
import { InvoiceProductSearchComponent } from '../../invoices/invoice-product-search/invoice-product-search.component';
import { InvoiceService } from '../../invoices/invoices.service';
import { ePayment } from '../../invoices/model/invoice-payment.Enum';
import { eInvoiceType, InvoiceType } from '../../invoices/model/invoice-type.Enum';
import { InvoiceDetails, InvoiceModel } from '../../invoices/model/invoice.model';
import { IvaType } from '../../invoices/model/iva-type.Enum';
import { ProductsModel } from '../../products/model/product.model';
import { ProductService } from '../../products/product.service';
import { debitMemoDetailFromInvoiceParser, DebitMemoDetailList, debitMemoDetailParser, DebitMemoDetails, debitMemoGridFromInvoiceParser, debitMemoGridParser, DebitMemoModel } from '../model/debitMemo.model';
import { NoteService } from '../notes.service';
import { isNil } from 'ng-zorro-antd/core/util';

@Component({
  selector: 'app-debit-memo',
  templateUrl: './debit-memo.component.html',
  styleUrls: ['./debit-memo.component.css'],
})
export class debitMemoComponent extends BaseComponent implements OnInit {
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('pop') popComponent!: PopupConfirmationComponent;

  cuit!: string;
  isLoading: boolean = false;
  loading!: boolean;
  isSaving!: boolean;
  startDate = this.formaterDate(Date.now());
  ivaTotal: number = 0;
  total: number = 0;
  editId: number | null = null;
  editIdIva: number | null = null;
  stock!: number;
  productId!: number;
  ownCode!: number;
  code!: number;
  productName!: string;
  quantity!: number;
  price!: number;
  subTotal: number = 0;


  iva: number = 21;
  debitId!: number;

  dateTime!: Date;
  invoiceList: InvoiceDetails[] = []
  debitMemo: DebitMemoModel[] = [];
  debitMemoDetails: DebitMemoDetails[] = []
  debitMemoListTest: DebitMemoDetailList[] = [];
  debitMemoList: DebitMemoDetailList[] = [];
  formDebitMemo: FormGroup;
  formCustomerSearch!: FormGroup;
  formProductSearch: FormGroup;
  product: any;
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10
  };
  paymentSelected: any;
  payment: { value: string; label: string }[] = Object.entries(ePayment).map(([value, label]) => ({ value, label }))
  id: any | number;
  invoiceA: boolean = true;
  type = InvoiceType;
  type1!: number
  ivaType = IvaType;
  typeSelectedId!: number;
  ivaSelectedId: number = 1;
  ivaSelected!: number;
  totalItems: any;
  invoiceId!: number;
  invoiceNumber!: number
  selectedDni: boolean = false;
  dni: any;

  edit: boolean = false
  customerId!: number;



  constructor(@Inject(LOCALE_ID) public locale: string,
    private serviceInvoice: InvoiceService,
    private serviceProduct: ProductService,
    public service: NoteService,
    private serviceEntity: EntityService,
    public serviceUser: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private drawerService: NzDrawerService,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,


  ) {
    super(notificacionService, el, message);
    this.formDebitMemo = this.fb.group({
      dateTime: [new Date(this.startDate), Validators.required],
      address: ['', Validators.required],
      type: [1, Validators.required],
      invoiceNumber: ['', Validators.required],
      customerCuit: ['', [Validators.required, Validators.pattern('[0-9]{8,11}'), Validators.minLength]],
      customerDni: [''],
      customerName: ['', Validators.required],
      observation: ['']
    });
    this.formCustomerSearch = this.fb.group({})
    this.formProductSearch = this.fb.group({
      productSearchFilter: ['']
    })
  }

  userId: number = this.serviceUser.currentUser.id

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (p) => {
        if (p['id']) {
          this.isLoading = true;
          this.getInvoice(p['id']);
          this.id = p['id'];
          this.edit = true;
        }
      },
      error: () => {
        this.id = 0
        this.edit = false
      }
    })
  }

  getInvoice(id: number): void {
    if (id != 0 || id != undefined)
      this.serviceInvoice.getInvoiceById(id).subscribe({
        next: (r: InvoiceModel) => {
          this.formDebitMemo.controls['type'].setValue(r.type),
            this.type1 = r.type,
            this.formDebitMemo.controls['invoiceNumber'].setValue(r.invoiceNumber),
            this.customerId = r.customerId
          this.formDebitMemo.controls['address'].setValue(r.customerAddress),
            this.formDebitMemo.controls['customerCuit'].setValue(r.customerCuit),
            this.formDebitMemo.controls['customerName'].setValue(r.customerName),
            this.ivaTotal = r.ivaTotal,
            this.total = r.total,
            this.userId = r.userId,
            this.subTotal = r.total - r.ivaTotal;
          this.isLoading = false;
          /**parse a Grilla */
          r.invoiceDetails.forEach(modelDetail => {
            const model = debitMemoGridFromInvoiceParser(modelDetail)
            this.debitMemoListTest.push(model)
          })
          this.debitMemoList = this.debitMemoListTest;
          /**Parseo al back */
          r.invoiceDetails.forEach(model => {
            const modelDetail = debitMemoDetailFromInvoiceParser(model);
            this.debitMemoDetails.push(modelDetail);
          })


          this.totalCalculate()
        },

        error: () => {
          this.isLoading = false;
          this.debitMemoDetails = [];
          this.debitMemoList = [];
          this.debitMemoListTest = []
        }
      })
  }
  save(): void {
    if (this.isValidForm(this.formDebitMemo)) {
      if (this.selectedDni && this.formDebitMemo.controls['customerDni'].value.length < 8) {
        return this.showMessageError('DNI Invalido');
      };
      if (this.debitMemoDetails.length == 0) {
        this.showMessageError('No hay Productos Seleccionados');

      } else {
        this.dni = this.formDebitMemo.controls['customerDni'].value
        const model: DebitMemoModel = {
          id: 0,
          customerId: this.customerId,
          invoiceId: this.id,
          invoiceNumber: this.formDebitMemo.controls['invoiceNumber'].value,
          userId: this.userId,
          customerName: this.formDebitMemo.controls['customerName'].value,
          customerCuit: this.selectedDni ? this.dni.toString() : this.formDebitMemo.controls['customerCuit'].value,
          customerAddress: this.formDebitMemo.controls['address'].value,
          observation: this.formDebitMemo.controls['observation'].value,
          dateTime: this.formDebitMemo.controls['dateTime'].value,
          type: this.formDebitMemo.controls['type'].value,
          total: this.total,
          ivaTotal: this.ivaTotal,
          debitMemoNumber: 0,
          debitMemoDetails: this.debitMemoDetails,
        };
        this.isSaving = true;
        this.service.saveDebitMemo(model)
          .subscribe({
            next: (r) => {
              this.showNotificationSuccess(
                'Guardado correcto',
                `Nota de Débito creada correctamente`

              );
              this.isSaving = false;

              this.router.navigate(['/notes/debitList']);
            },
            error: (r) => {
              this.isSaving = false;
              this.showMessageError(r.error.descripcion)
            }
          });
      }
    }
  };


  formaterDate(date: string | number | Date): string {
    return formatDate(date, 'MM/dd/YYYY', this.locale);
  }

  totalCalculate(): void {
    this.subTotal = 0;
    this.total = 0;
    this.ivaTotal = 0;
    try {
      this.debitMemoList.forEach(detail => {
        /**Caluclo subtotal = precio y multiplico por cantidad*/
        this.subTotal += detail.quantity *
          this.ivaCalculate(detail.price, detail.iva);
      });
      this.debitMemoList.forEach((dato) => {
        /**Calculo iva restandolo al precio y multiplico por cantidad*/
        this.ivaTotal += (dato.price - this.ivaCalculate(dato.price, dato.iva)) * dato.quantity;
        this.total += dato.price * dato.quantity;
      });
    } catch (error) { }
  };

  ivaCalculate(data: number, iva: number): number {
    let newIva = 1 + (iva / 100);
    return (data / newIva);
  }
  currencyFormat(data: any): string {
    return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2')
  }


  typeSelectedChange(id: any): void {
    this.typeSelectedId = id;
    if (id == 1) {
      this.invoiceA = true;
    } else {
      this.invoiceA = false;

    }
  }
  startEdit(id: number): void {
    this.editId = id;
  };
  startEditIva(id: number): void {
    this.editIdIva = id;
  }
  stopEdit(): void {
    this.editId = null;
  };
  stopEditIva(): void {
    this.editIdIva = null;
  }

  changeIvaValue(iva: number, id: number): void {
    let newIva = Number(iva);
    try {
      this.debitMemoDetails.filter(
        (detail) => detail.productId == id
      )[0].iva = newIva;

      this.debitMemoList.filter(
        (detail) => detail.productId == id
      )[0].iva = newIva;
      this.totalCalculate();
      this.stopEditIva();
    } catch (error) {
      console.error(error);
    }
  };
  invoiceType(id: any): string {
    return eInvoiceType[id]
  }

  openComponentCustomer(): void {
    const drawerRefCustomer = this.drawerService.create<InvoiceCustomerSearchComponent, {}, CustomerModel>({
      nzTitle: 'Cliente',
      nzContent: InvoiceCustomerSearchComponent,
      nzWidth: '90%',
      nzSize: 'large',
      nzClosable: false
    });
    drawerRefCustomer.afterClose.subscribe({
      next: (data) => {
        if (data != undefined) {
          this.customerId = data.id;
          this.formDebitMemo.controls['address'].setValue(data.address);
          this.formDebitMemo.controls['customerCuit'].setValue(!isNil(data.cuit) ? data.cuit.replace(/[^a-zA-Z0-9 ]/g, '') : null);
          this.formDebitMemo.controls['customerName'].setValue(data.name);
          this.formDebitMemo.controls['customerDni'].setValue(data.dni)
        }
      },
      error: () => {

      }

    })
  };

  openComponentProduct(): void {
    if (this.isValidForm(this.formDebitMemo)) {
      const drawerRefProduct = this.drawerService.create<InvoiceProductSearchComponent, { filter: string }, ProductsModel>({
        nzTitle: 'Productos',
        nzContent: InvoiceProductSearchComponent,
        nzWidth: '90%',
        nzSize: 'large',
        nzContentParams: {
          filter: this.formProductSearch.controls['productSearchFilter'].value
        },
        nzClosable: false
      });
      drawerRefProduct.afterClose.subscribe({

        next: (data: ProductsModel) => {
          if (data != undefined) {
            if (this.debitMemoDetails.find(item => item.productId == data.id)) {
              /*Actualizo la lista que envio al back */
              this.debitMemoDetails.filter(item => item.productId == data.id)[0]
                .quantity += 1;

              /*Actualizo la lista de la tabla */
              let newListElement = this.debitMemoList.filter(item => item.ownCode == data.id)[0];

              newListElement.quantity += 1;
              newListElement.subTotal += data.cashSalePrice * newListElement.quantity;
              /**cashSalePrice es el precio de Costo */

              this.totalCalculate();
              this.isLoading = false;
              this.formProductSearch.controls['productSearchFilter'].setValue('');
            } else {

              /* Parseo dato a la grilla de Tabla */
              const model: DebitMemoDetailList = debitMemoGridParser(data, this.iva);
              this.debitMemoListTest.push(model)

              this.debitMemoList = this.debitMemoListTest;
              /* Parseo dato a Dto Factura Detalle */
              const modelDetail: DebitMemoDetails = debitMemoDetailParser(data, this.iva);
              this.debitMemoDetails.push(modelDetail);

              this.totalCalculate();
              this.isLoading = false;
              this.formProductSearch.controls['productSearchFilter'].setValue('');
            }
          }
        },
        error: () => {
          this.isLoading = false;
          this.debitMemoList = [];
          this.formProductSearch.controls['productSearchFilter'].setValue('');
        }

      })
    } else { return; }
  };

  searchProduct(): void {
    this.product = this.formProductSearch.controls['productSearchFilter'].value;
    this.queryParams.filter = this.product;
    if (this.isValidForm(this.formDebitMemo)) {
      if (this.product.length > 0) {
        this.serviceProduct.getProducts(this.queryParams).subscribe({
          next: (r) => {
            this.isLoading = true;
            if (r.data.length == 1) {
              const model: ProductsModel = r.data[0];
              if (this.debitMemoDetails.find(item => item.productId == model.id)) {
                /*Actualizo la lista que envio al back */
                this.debitMemoDetails.filter(item => item.productId == model.id)[0]
                  .quantity += 1;

                /*Actualizo la lista de la tabla */
                this.debitMemoList.filter(item => item.ownCode == model.id)[0]
                  .quantity += 1;

                this.debitMemoList.filter(item => item.ownCode == model.id)[0]
                  .subTotal += model.cashSalePrice * model.quantity;
                /**cashSalePrice es el precio de Costo */
                this.totalCalculate();
                this.isLoading = false;
                this.formProductSearch.controls['productSearchFilter'].setValue('');
              } else {
                const product: ProductsModel = r.data[0];
                /* Parseo el Producto a la grilla de Tabla */
                const model: DebitMemoDetailList = debitMemoGridParser(product, this.iva);
                this.debitMemoListTest.push(model)
                this.debitMemoList = this.debitMemoListTest;
                /* Parseo dato a Dto Factura Detalle */
                const modelDetail: DebitMemoDetails = debitMemoDetailParser(product, this.iva);
                this.debitMemoDetails.push(modelDetail);
                this.totalCalculate();
                this.isLoading = false;
                this.formProductSearch.controls['productSearchFilter'].setValue('');
              }

            } else {
              this.isLoading = false;
              this.openComponentProduct();
            }

          },
          error: () => {
            this.isLoading = false;
            this.formProductSearch.controls['productSearchFilter'].setValue('');
          }
        })
      } else {
        this.isLoading = false;
      }
    }
  };

  searchCustomer(): void {
    this.cuit =
      this.formDebitMemo.controls['customerCuit'].value;
    if (this.cuit == '00') {
      this.formDebitMemo.controls['address'].setValue('S/D');
      this.formDebitMemo.controls['customerCuit'].setValue('00');
      this.formDebitMemo.controls['customerName'].setValue('Admin');
      this.customerId = 0;
      return;
    } else {
      if (this.cuit.length >= 6) {
        this.serviceEntity.getByCuit(this.cuit).subscribe({
          next: (data) => {
            this.formDebitMemo.controls['address'].setValue(data.address);
            this.formDebitMemo.controls['customerCuit'].setValue(data.cuit);
            this.formDebitMemo.controls['customerName'].setValue(data.name);

          },
          error: () => { this.showMessageError('No se encontro Cliente'); }
        });
      }
    }
  };

  changeQuantity(quantity: number): void {
    if (quantity == 0 || quantity == null) {
      quantity = 1;
    }
    let product = this.debitMemoList.filter(
      detail => detail.ownCode == this.editId)[0];

    this.debitMemoList.filter(
      detail => detail.ownCode == this.editId
    )[0].subTotal = quantity * product.price;

    this.totalCalculate();
    this.debitMemoDetails.filter(
      detail => detail.productId == this.editId
    )[0].quantity = quantity;

  };

  changePrice(price: number): void {
    if (price == 0 || price == null) {
      price = 1;
    }
    let product = this.debitMemoList.filter(
      detail => detail.productId == this.editId)[0];

    this.debitMemoList.filter(
      detail => detail.productId == this.editId
    )[0].subTotal = product.quantity * price;

    this.totalCalculate();
    this.debitMemoDetails.filter(
      detail => detail.productId == this.editId
    )[0].price = price;

  };

  handleOk() {
    try {
      this.debitMemoListTest = this.debitMemoList.
        filter(element => element.ownCode != this.popupComponent.elementSelectedToDelete);
      this.debitMemoDetails = this.debitMemoDetails.
        filter(element => element.productId != this.popupComponent.elementSelectedToDelete);
      this.popupComponent.isDeleteConfirmationVisible = false;
      if (this.debitMemoListTest.length == 0) {
        this.debitMemoList = []
      } else {
        this.debitMemoList = this.debitMemoListTest;
      }

      this.totalCalculate();
    } catch (error) {
      console.log(error);

    }
  };
  msjConfirmOk() {
    try {
      this.debitMemoList = this.debitMemoList.
        filter(element => element.ownCode != this.popupComponent.elementSelected);
      this.popupComponent.isConfirmationvisible = false;
      if (this.isValidForm(this.formDebitMemo) && this.isValidForm(this.formCustomerSearch) &&
        this.debitMemoList.length != 0 && this.isValidForm(this.formProductSearch)) {
        this.popComponent.showConfirmation();
      } else {
        this.showMessageError('No ha seleccionado producto')
      }
    } catch (error) {
      console.log(error);

    }
  }

  direction() {
    if (this.id != 0) {
      this.router.navigate(['/home/invoices/invoices-sale']);

    } if (this.id == 0 || this.id == undefined || this.id == null) {
      this.router.navigate(['/notes/debitList']);
    }
  }

  select() {
    this.selectedDni = !this.selectedDni;
    if (this.selectedDni) {
      this.dni = this.formDebitMemo.controls['customerDni'].value
    } else {
      this.dni = null;
    }
  }


}
