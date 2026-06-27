import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { EntityService } from "../../customers/customer.service";
import { PopupConfirmationComponent } from "src/app/common/components/popup-confirmation/popup-confirmation.component";
import { ActivatedRoute, Router } from "@angular/router";
import { formatCurrency, formatDate } from '@angular/common';
import { Inject, LOCALE_ID } from '@angular/core';
import { QuittanceService } from "../quittance.service";
import { quittanceDetailParser, quittanceDetails, quittanceGridParser, quittanceModel, QuittanceProductDetailList, QuittanceProductDetails } from "../model";
import { InvoiceCustomerSearchComponent } from "../../invoices/invoice-customer-search/invoice-customer-search.component";
import { CustomerModel } from "../../customers/model/customer.model";
import { isNil } from "ng-zorro-antd/core/util";
import { ProductService } from "../../products/product.service";
import { ProductsModel } from "../../products/model/product.model";
import { InvoiceProductSearchComponent } from "../../invoices/invoice-product-search/invoice-product-search.component";
import { IvaType } from "../../invoices/model/iva-type.Enum";


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
  formProductSearch!: FormGroup;
  formProduct!: FormGroup;

  quittanceDetails: Array<any>[] = [];
  quittanceDetailsList: quittanceDetails[] = [];
  quittanceProductDetailsGrid: QuittanceProductDetailList[] = [];
  quittanceProductDetailsGridTest: QuittanceProductDetailList[] = [];
  quittanceProductDetailsTest: QuittanceProductDetails[] = [];
  quittanceProductDetails: QuittanceProductDetails[] = [];
  formQuittanceDetails!: FormGroup
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
  checkNumber!: string;
  dateTime!: Date;
  subtotal: number = 0;
  quittance!: Array<quittanceDetails>;
  product!: string;
  iva: number = 21;
  editProductId: number = 0;
  editIdProductName: number | null = null;
  editIdProductPrice: number | null = null;
  editIva: number | null = null;
  editIdIva: number | null = null;
  ivaType = IvaType;
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
    private serviceProduct: ProductService,
    @Inject(LOCALE_ID) public locale: string) {
    super(notificacionService, el, message);
    this.formQuittance = this.fb.group({
      dateTime: [new Date(this.startDate), Validators.required],
      quittanceNumber: [0, Validators.required],
      address: ['',],
      customerCuit: ['', [Validators.required, Validators.pattern('^[0-9]{8,11}$'),]],
      customerName: ['', Validators.required],
      concept: ['',],
      cash: [0,],
      total: [0],
      quittanceDetails: new FormArray([])
    });

    this.formCustomerSearch = this.fb.group({});

    this.formProductSearch = this.fb.group({ productSearchFilter: [''] })
  }

  get quittanceDetailsFormGroups(): FormArray {
    return this.formQuittance.get('quittanceDetails') as FormArray
  }

  ngOnInit() {
    this.route.params.subscribe(params => { this.id = params['id']; })
    if (this.id != undefined) {
      this.getQuittance(this.id);
      this.edit = false
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
          r.quittanceDetails.map((data: any, key: any) => {
            this.showPasswordChangeBox(data, key)
            this.quittanceDetails.push(data)
          })

        },

        error: () => {
          this.isLoading = false;
        },

      });
  }

  currencyFormat(data: any): string {
    if (data != null || data != undefined) {
      return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2');
    } else return ''
  }


  formaterDate(date: string | number | Date): string {
    return formatDate(date, 'MM/dd/YYYY', this.locale);
  }
  direction() {
    this.router.navigate(['/home/quittance']);
  }

  showPasswordChangeBox(data?: any, key?: any): void {
    let newQuittancegroup = this.fb.group({
      checkNumber: [''],
      bank: [''],
      total: [''],

    })

    this.quittanceDetailsFormGroups.push(newQuittancegroup);
    if (data != undefined) {
      this.quittanceDetailsFormGroups.controls[key].get('checkNumber')?.setValue(data.checkNumber)
      this.quittanceDetailsFormGroups.controls[key].get('bank')?.setValue(data.bank)
      this.quittanceDetailsFormGroups.controls[key].get('total')?.setValue(data.total)
    }

  }

  removeCheck(e: MouseEvent, index: any): void {

    e.preventDefault();
    this.quittanceDetailsFormGroups.removeAt(index)
  };

  save(): void {
    {
      //EDITAR
      if (this.id > 0) {
        const model = this.formQuittance.getRawValue();
        model.quittanceProductDetails = this.quittanceProductDetails;
        model.id = this.id;
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
        model.quittanceProductDetails = this.quittanceProductDetails;
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
    if (this.cuit == '00') {
      this.formQuittance.controls['address'].setValue('S/D');
      this.formQuittance.controls['customerCuit'].setValue('99999999995');
      this.formQuittance.controls['customerName'].setValue('Admin');
      this.customerId = 0;
      return;
    } else {
      if (this.cuit.length >= 6) {
        this.serviceEntity.getByCuit(this.cuit).subscribe({
          next: (data) => {
            this.formQuittance.controls['address'].setValue(data.address);
            this.formQuittance.controls['customerCuit'].setValue(data.cuit);
            this.formQuittance.controls['customerName'].setValue(data.name);


          },
          error: () => { this.showMessageError('No se encontro Cliente'); }
        });
      }
    }
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
          this.formQuittance.controls['customerCuit'].setValue(!isNil(data.cuit) ? data.cuit.replace(/[^a-zA-Z0-9 ]/g, '') : null);
          this.formQuittance.controls['customerName'].setValue(data.name);
        }
      },
      error: () => { }
    })
  };

  msjConfirmOk() {
    try {

      if (this.quittanceProductDetails.length == 0) {
        this.showMessageError('No ha seleccionado producto');
        return;
      }

      if (!this.isValidProductName()) {
        this.showMessageError('Hay productos sin descripción');
        return;
      }

      if (this.isValidForm(this.formQuittance)&& this.isValidForm(this.formProductSearch)) {
        this.popComponent.showConfirmation()
      } else {
        this.showMessageError('Error de formulario');
      }
    } catch (error) { }
  }

  searchProduct(): void {
    this.product = this.formProductSearch.controls['productSearchFilter'].value;
    const productParams = {
      filter: {
        product: this.product,
        code: '',
        barCode: '',
        brand: 0,
        category: 0,
        status: 0,
        supplier: [] as Number[]
      },
      page: 0,
      pageSize: 50
    };

    if (this.product == '00') {
      this.addNewEditProduct();
      return;
    }
    if (this.product.length > 0) {
      this.serviceProduct.getProducts(productParams).subscribe({
        next: (r) => {
          this.isLoading = true;
          if (r.data.length == 1) {
            const model: ProductsModel = r.data[0];
            if (this.quittanceProductDetails.find(item => item.productId == model.id)) {
              /*Actualizo la lista que envio al back */
              this.quittanceProductDetails.filter(item => item.productId == model.id)[0]
                .quantity += 1;

              /*Actualizo la lista de la tabla */
              this.quittanceProductDetailsGrid.filter(item => item.ownCode == model.id)[0]
                .quantity += 1;

              this.quittanceProductDetailsGrid.filter(item => item.ownCode == model.id)[0]
                .subTotal += model.cashSalePrice * model.quantity;

              this.formProductSearch.controls['productSearchFilter'].setValue('');

              this.isLoading = false;
            }
            else {
              const product: ProductsModel = r.data[0];
              /* Parseo el Producto a la grilla de Tabla */
              const model: QuittanceProductDetailList = quittanceGridParser(product, this.iva);
              this.quittanceProductDetailsGridTest.push(model)
              this.quittanceProductDetailsGrid = this.quittanceProductDetailsGridTest;
              /* Parseo dato a Dto Factura Detalle */
              const modelDetail: QuittanceProductDetails = quittanceDetailParser(product, this.iva);
              this.quittanceProductDetails.push(modelDetail);

              this.formProductSearch.controls['productSearchFilter'].setValue('');
            }

            this.totalCalculate();
            this.isLoading = false;
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
    }
    else {
      this.isLoading = false;
      this.openComponentProduct();
    }
  }

  addNewEditProduct(): void {
    this.editProductId--;
    let newEditProduct: ProductsModel = {
      id: this.editProductId,
      quantity: 1,
      code: '',
      description: '',
      cashSalePrice: 0,
      categoryName: '',
      brandName: '',
      purchasePrice: 0,
      salePrice: 0,
      salePercentage: 0,
      cardSalePrice: 0,
      cashSalePercentage: 0,
      cardSalePercentage: 0,
      pointOrder: 0,
      observation: '',
      supplierName: '',
      isDeleted: false,
      barCode: ''
    };
    /* Parseo el Producto a la grilla de Tabla */
    const model: QuittanceProductDetailList = quittanceGridParser(newEditProduct, this.iva);
    this.quittanceProductDetailsGridTest.push(model)
    this.quittanceProductDetailsGrid = this.quittanceProductDetailsGridTest;
    /* Parseo dato a Dto Factura Detalle */
    const modelDetail: QuittanceProductDetails = quittanceDetailParser(newEditProduct, this.iva);
    this.quittanceProductDetails.push(modelDetail);

    this.formProductSearch.controls['productSearchFilter'].setValue('');
  }

  totalCalculate(): void {
    this.subtotal = 0;
    this.total = 0;
    try {
      this.quittanceProductDetailsGrid.forEach(detail => {
        /**Caluclo subtotal = precio y multiplico por cantidad*/
        this.subtotal += detail.quantity *
          detail.price;
      });
      this.quittanceProductDetails.forEach((dato) => {
        /**Calculo iva restandolo al precio y multiplico por cantidad*/
        this.total += dato.price * dato.quantity;
      });

    } catch (error) { }
  };

  openComponentProduct(): void {
    if (this.formProductSearch.controls['productSearchFilter'].value == '00') {
      this.addNewEditProduct();
      return;
    }
    let drawerRefProduct = this.drawerService.create<InvoiceProductSearchComponent, { filter: string }, [ProductsModel]>({
      nzTitle: 'Productos',
      nzContent: InvoiceProductSearchComponent,
      nzSize: 'large',
      nzWidth: '90%',
      nzContentParams: {
        filter: this.formProductSearch.controls['productSearchFilter'].value
      },
      nzClosable: false
    });
    drawerRefProduct.afterClose.subscribe({
      next: (data: [ProductsModel]) => {
        if (data != undefined) {
          data.forEach((productItem) => {
            if (this.quittanceProductDetails.find(item => item.productId == productItem.id)) {
              /*Actualizo la lista que envio al back */
              this.quittanceProductDetails.filter(item => item.productId == productItem.id)[0]
                .quantity += 1;

              /*Actualizo la lista de la tabla */
              let newListElement = this.quittanceProductDetailsGrid.filter(item => item.ownCode == productItem.id)[0];
              newListElement.quantity += 1;
              newListElement.subTotal += newListElement.price * newListElement.quantity;

              this.totalCalculate();
              this.isLoading = false;
              this.formProductSearch.controls['productSearchFilter'].setValue('');
            } else {

              /* Parseo dato a la grilla de Tabla */
              const model: QuittanceProductDetailList = quittanceGridParser(productItem, this.iva);
              this.quittanceProductDetailsGridTest.push(model)
              this.quittanceProductDetailsGrid = this.quittanceProductDetailsGridTest;
              /* Parseo dato a Dto Factura Detalle */
              const modelDetail: QuittanceProductDetails = quittanceDetailParser(productItem, this.iva);
              this.quittanceProductDetails.push(modelDetail);
              this.totalCalculate();
              this.isLoading = false;
              this.formProductSearch.controls['productSearchFilter'].setValue('');
            }
          })
        }
      },
      error: () => {
        this.isLoading = false;
        this.quittanceProductDetailsGrid = [];
        this.formProductSearch.controls['productSearchFilter'].setValue('');
      }
    })
  };

  startEdit(id: number): void {
    this.editId = id;
  };

  startEditIva(id: number): void {
    this.editIdIva = id;
  }

  startEditProductName(id: number): void {
    this.editIdProductName = id;
  }

  startEditProductPrice(id: number): void {
    this.editIdProductPrice = id;
  }
  stopEdit(): void {
    this.editId = null;
  };
  stopEditIva(): void {
    this.editIdIva = null;
  }
  stopEditProductName(): void {
    this.editIdProductName = null;
  }

  stopEditProductPrice(): void {
    this.editIdProductPrice = null;
  }

  changeQuantity(quantity: number): void {
    if (quantity == 0 || quantity == null) {
      quantity = 1;
    }
    let product = this.quittanceProductDetailsGrid.filter(
      detail => detail.ownCode == this.editId)[0];

    this.quittanceProductDetailsGrid.filter(
      detail => detail.ownCode == this.editId
    )[0].subTotal = quantity * product.price;

    this.totalCalculate();
    this.quittanceProductDetails.filter(
      detail => detail.productId == this.editId
    )[0].quantity = quantity;

  }

  changeProductName(name: string): void {
    this.quittanceProductDetailsGrid.filter(
      detail => detail.ownCode == this.editIdProductName
    )[0].productName = name;

    this.quittanceProductDetails.filter(
      detail => detail.productId == this.editIdProductName
    )[0].productName = name;
  }

  changeProductPrice(price: number): void {
    //recupero el producto a editar
    let product = this.quittanceProductDetailsGrid.filter(
      detail => detail.ownCode == this.editIdProductPrice)[0];

    this.quittanceProductDetailsGrid.filter(
      detail => detail.ownCode == this.editIdProductPrice
    )[0].price = price;

    this.quittanceProductDetails.filter(
      detail => detail.productId == this.editIdProductPrice
    )[0].price = price;

    this.quittanceProductDetailsGrid.filter(
      detail => detail.ownCode == this.editIdProductPrice
    )[0].subTotal = product.quantity * price;

    this.totalCalculate();
  }

  handleOk() {
    try {
      this.quittanceProductDetailsGridTest = this.quittanceProductDetailsGrid.
        filter(element => element.ownCode != this.popupComponent.elementSelectedToDelete);
      this.quittanceProductDetails = this.quittanceProductDetails.
        filter(element => element.productId != this.popupComponent.elementSelectedToDelete);
      this.popupComponent.isDeleteConfirmationVisible = false;
      if (this.quittanceProductDetailsGridTest.length == 0) {
        this.quittanceProductDetailsGrid = []
      } else {
        this.quittanceProductDetailsGrid = this.quittanceProductDetailsGridTest;
      }
      this.totalCalculate();
    } catch (error) {
      console.log(error);
    }
  };

  isValidProductName(): boolean {
    return this.quittanceProductDetails.every(y => typeof y.productName === "string" && y.productName.trim() !== "")
  }

  changeIvaValue(iva: number, id: number): void {
    let newIva = Number(iva);
    try {
      this.quittanceProductDetails.filter(
        (detail) => detail.productId == id
      )[0].iva = newIva;

      this.quittanceProductDetailsGrid.filter(
        (detail) => detail.productId == id
      )[0].iva = newIva;
      this.totalCalculate();

      this.stopEditIva();

    } catch (error) {
      console.error(error);
    }
  };
}