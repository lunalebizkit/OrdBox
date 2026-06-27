import { ChangeDetectorRef, Component, ElementRef, Inject, LOCALE_ID, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { BudgetsService } from '../budgets.services';
import { BudgetDetailList, BudgetDetailParser, BudgetDetails, BudgetGridParser, BudgetsModel, budgetsGridFromParser } from '../model/budgets.model';
import { formatCurrency, formatDate } from '@angular/common';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { AuthService } from "src/app/common/auth/interceptors/auth.service";
import { BudgetType } from "../model/budgets-type.Enum";
import { ProductService } from "../../products/product.service";
import { ProductsModel } from "../../products/model/product.model";
import { NzDrawerService } from "ng-zorro-antd/drawer";
import { InvoiceProductSearchComponent } from "../../invoices/invoice-product-search/invoice-product-search.component";
import { ePayment } from "../../invoices/model/invoice-payment.Enum";
import { forkJoin, map } from "rxjs";

@Component({
  selector: 'app-budgets-edit',
  templateUrl: './budgets-edit.component.html',
  styleUrls: ['./budgets-edit.component.css']
})

export class BudgetsEditComponent extends BaseComponent implements OnInit {
  direccion() {
    throw new Error('Method not implemented.');
  }

  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('pop') popComponent!: PopupConfirmationComponent;
  isLoading!: boolean;

  type = BudgetType;
  typeSelectedId: number = 1;
  isSaving!: boolean;
  form!: FormGroup;
  id!: number;
  totalItems: number = 0;
  paymentSelected: any;
  total: number = 0;
  editProductId: number = 0;
  /*FORM*/
  formProductSearch!: FormGroup;
  startDate = new Date;
  today = new Date();
  subtotal: number = 0;

  view!: boolean;

  product!: string;
  cuit!: string;
  customerId!: number;
  payment: { value: string; label: string }[] = Object.entries(ePayment).map(([value, label]) => ({ value, label }))
  /*Lista de productos */
  budgetDetails: BudgetDetails[] = [];
  budgetDetailsTest: BudgetDetailList[] = [];
  budgetDetailsList: BudgetDetailList[] = [];
  editIdProductName: number | null = null;
  editId: number | null = null;
  editIdProductPrice: number | null = null;

  /*
  ** Parametros de busqueda
  */
  queryParams = {
    filter: {
      product: '',
      brand: 0,
      category: 0,
      status: 0,
      supplier: []
    },
    page: 0,
    pageSize: 50
  };

  selectedDni: boolean = false;
  dni: any;

  constructor(
    private service: BudgetsService,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private serviceProduct: ProductService,
    public serviceUser: AuthService,
    private drawerService: NzDrawerService,
    private serviceBudget: BudgetsService,
    @Inject(LOCALE_ID) public locale: string


  ) {
    super(notificacionService, el, message);
    this.form = this.fb.group({
      id: [0, Validators.required],
      budgetNumber: [0, Validators.required],
      customerName: ['', Validators.required],
      payment: ['', Validators.required],

      customerAddress: ['', Validators.required],
      dateTime: [new Date(this.startDate), Validators.required],
      total: [0, Validators.required],
      observation: ['']
    });

    this.formProductSearch = this.fb.group({
      productSearchFilter: ['']
    })

  }

  userId: number = this.serviceUser.currentUser.id

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (p) => {
        if (p['id']) {
          this.isLoading = true;
          this.getBudget(p['id']);
          this.id = p['id'];
          this.view = false;

        } else {
          this.view = true;
        }
      },
      error: () => { }
    })
  }

  getBudget(id: number): void {

    this.service.getById(id).subscribe({
      next: (r) => {

        this.paymentSelectedChange(r.payment);
        this.id = r.id;
        this.form.controls['payment'].setValue(r.payment);
        this.form.controls['budgetNumber'].setValue(r.budgetNumber);

        this.form.controls['customerName'].setValue(r.customerName);
        this.form.controls['customerAddress'].setValue(r.customerAddress);
        this.form.controls['observation'].setValue(r.observation);
        this.startDate = new Date(r.dateTime.toString());

        this.budgetDetails = r.budgetDetails;
        this.updateProductIdToEdit(this.budgetDetails)
        this.subtotal = r.subtotal;
        this.total = r.total;


        this.isLoading = false;

        r.budgetDetails.forEach((modelDetail: BudgetDetailList) => {
          const model = budgetsGridFromParser(modelDetail)

          this.budgetDetailsTest.push(model)

        })


        this.budgetDetailsList = this.budgetDetailsTest;
        this.totalCalculate();
        this.form.controls['payment'].disable();
      },
      error: () => { this.isLoading = false; }
    })

  }

  //VOLVER
  back() {
    this.router.navigate(['../'], { relativeTo: this.route });
  };

  paymentSelectedChange(id: any): void {
    this.paymentSelected = id;
    this.updatePriceByPaymentSelectedChange();
  }


  save(): void {
    if (this.isValidForm(this.form)) {
      //EDITAR
      if (this.id > 0) {
        const model: BudgetsModel = {
          id: this.id > 0 ? this.id : 0,
          customerName: this.form.controls['customerName'].value,
          payment: this.form.controls['payment'].value,
          budgetNumber: this.form.controls['budgetNumber'].value,
          customerAddress: this.form.controls['customerAddress'].value,
          observation: this.form.controls['observation'].value,
          userId: this.userId,
          total: this.totalItems,
          dateTime: this.form.controls['dateTime'].value,
          budgetDetails: this.budgetDetails,

        };

        this.isSaving = true;
        this.serviceBudget.editBudget(model)
          .subscribe({
            next: (r) => {
              this.showNotificationSuccess(
                'Guardado correcto',
                `Presupuesto editado correctamente`
              );
              this.isSaving = false;
              this.router.navigate(['/home/budgets']);
            },
            error: (r) => {
              this.isSaving = false;
              this.showMessageError(r.error)
            }
          });

        //GUARDAR
      } else {
        const model: BudgetsModel = {
          id: 0,
          customerName: this.form.controls['customerName'].value,
          payment: this.form.controls['payment'].value,
          budgetNumber: this.form.controls['budgetNumber'].value,
          customerAddress: this.form.controls['customerAddress'].value,
          observation: this.form.controls['observation'].value,
          userId: this.userId,
          total: this.totalItems,
          dateTime: this.form.controls['dateTime'].value,
          budgetDetails: this.budgetDetails,
        };


        this.isSaving = true;
        this.service.saveBudget(model)
          .subscribe({
            next: (r) => {
              this.showNotificationSuccess(
                'Guardado correcto',
                `Presupuesto creado correctamente`
              );
              this.isSaving = false;
              this.router.navigate(['/home/budgets']);
            },
            error: (r) => {
              this.isSaving = false;
              this.showMessageError(r.error)
            }
          });
      }
    }

  };

  startEdit(id: number): void {
    this.editId = id;
  };
  stopEdit(): void {
    this.editId = null;
  };


  changeQuantity(quantity: number): void {
    if (quantity == 0 || quantity == null) {
      quantity = 1;
    }
    let product = this.budgetDetailsList.filter(
      detail => detail.ownCode == this.editId)[0];

    this.budgetDetailsList.filter(
      detail => detail.ownCode == this.editId
    )[0].subTotal = quantity * product.price;

    this.totalCalculate();

    if (Number(this.editId) <= 0) {
      this.budgetDetails.filter(detail => detail.productId == this.editId
      )[0].quantity = quantity;
    }else{
      this.budgetDetails.filter(detail => detail.id == this.editId
      )[0].quantity = quantity;
    }
  };

  typeSelectedChange(id: any): void {
    this.typeSelectedId = id;

  }
  disabledDate = (current: Date): boolean =>

    differenceInCalendarDays(current, this.today) > 0;


  msjConfirmOk() {
    try {
      this.budgetDetailsList = this.budgetDetailsList.
        filter(element => element.ownCode != this.popupComponent.elementSelected);
      this.popupComponent.isConfirmationvisible = false;
      if (this.isValidForm(this.form) && (this.budgetDetailsList.length != 0) &&
        this.isValidForm(this.formProductSearch)) {
        this.popComponent.showConfirmation()
      } else {
        this.showMessageError('No ha seleccionado producto')
      }
    } catch (error) {
      console.log(error);
    }
  }

  currencyFormat(data: any): string {
    return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2')
  }

  formaterDate(date: string | number | Date): string {
    return formatDate(date, 'MM/dd/YYYY', this.locale);
  }

  searchCustomer(): void {

    if (this.cuit === '00') {
      this.form.controls['customerAddress'].setValue('S/D');

      this.form.controls['customerName'].setValue('Admin');
      this.customerId = 0;
      return;
    } else {
      if (this.cuit.length >= 6) {
        this.serviceBudget.getByCuit(this.cuit).subscribe({
          next: (data) => {
            this.form.controls['customerAddress'].setValue(data.address);

            this.form.controls['customerName'].setValue(data.name);

          },
          error: () => { this.showMessageError('No se encontro Cliente'); }
        });
      }
    }
  };

  bindPrice(data: ProductsModel): number {
    const typePayment = this.paymentSelected;
    var a = Object.keys(data).filter(type => (type == typePayment));
    switch (a[0]) {
      case 'cardSalePrice':
        return data.cardSalePrice;

      case 'salePrice':
        return data.salePrice;

      default:
        return data.cashSalePrice;
    }
  };

  totalCalculate(): void {
    this.subtotal = 0;
    this.total = 0;

    try {
      this.budgetDetailsTest.forEach(detail => {
        /**Caluclo subtotal = precio y multiplico por cantidad*/
        this.subtotal += detail.quantity * detail.price;
        this.total += detail.quantity * detail.price;
      });

    } catch (error) { }
  };

  searchProduct(): void {

    this.product = this.formProductSearch.controls['productSearchFilter'].value;

    if (this.product == '00') {
        this.addNewEditProduct();
        return;
    }

    this.queryParams.filter.product = this.product;
    if (this.product.length > 0) {
      this.serviceProduct.getProducts(this.queryParams).subscribe({
        next: (r) => {
          this.isLoading = true;
          if (r.data.length == 1) {
            const model: ProductsModel = r.data[0];
            if (this.budgetDetails.find(item => item.productId == model.id)) {
              /*Actualizo la lista que envio al back */
              this.budgetDetails.filter(item => item.productId == model.id)[0]
                .quantity += 1;

              /*Actualizo la lista de la tabla */
              this.budgetDetailsList.filter(item => item.ownCode == model.id)[0]
                .quantity += 1;

              this.budgetDetailsList.filter(item => item.ownCode == model.id)[0]
                .subTotal += this.bindPrice(model) * model.quantity;

              this.totalCalculate();
              this.isLoading = false;
              this.formProductSearch.controls['productSearchFilter'].setValue('');
            } else {
              const product: ProductsModel = r.data[0];
              // /* Parseo el Producto a la grilla de Tabla */
              const model: BudgetDetailList = BudgetGridParser(product, this.bindPrice(product));
              this.budgetDetailsTest.push(model);

              this.budgetDetailsList = this.budgetDetailsTest;

              /* Parseo dato a Dto Factura Detalle */
              const modelDetail: BudgetDetails = BudgetDetailParser(product, this.bindPrice(product));
              this.budgetDetails.push(modelDetail);
              this.budgetDetailsList = this.budgetDetailsTest
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
      this.queryParams.filter.product = '';
      this.openComponentProduct();
    }
  };

  openComponentProduct(): void {

    const drawerRefProduct = this.drawerService.create<InvoiceProductSearchComponent, { filter: string }, [ProductsModel]>({
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

          data.forEach((productItem) =>{
          if (this.budgetDetails.find(item => item.productId == productItem.id)) {
            /*Actualizo la lista que envio al back*/
            this.budgetDetails.filter(item => item.productId == productItem.id)[0].quantity += 1;

            /*Actualizo la lista de la tabla*/
            let newListElement = this.budgetDetailsList.filter(item => item.ownCode == productItem.id)[0];
            newListElement.quantity += 1;
            newListElement.subTotal += this.bindPrice(productItem) * newListElement.quantity;

            this.totalCalculate();
            this.isLoading = false;
            this.formProductSearch.controls['productSearchFilter'].setValue('');

          } else {

            /*Parseo dato a la grilla de tabla */
            const model: BudgetDetailList = BudgetGridParser(productItem, this.bindPrice(productItem));
            this.budgetDetailsTest.push(model);
            this.budgetDetailsList = this.budgetDetailsTest;

            /*Parseo dato a DTO  */
            const modelDetail: BudgetDetails = BudgetDetailParser(productItem, this.bindPrice(productItem));
            this.budgetDetails.push(modelDetail);

            this.totalCalculate();
            this.isLoading = false;
            this.formProductSearch.controls['productSearchFilter'].setValue('');

          }
        })
        }
      }, error: () => {
        this.isLoading = false;
        this.budgetDetailsList = [];
        this.formProductSearch.controls['productSearchFilter'].setValue('');
      }

    })
  }

  handleOk() {
    try {
      this.budgetDetailsTest = this.budgetDetailsList.filter(element => element.ownCode != this.popupComponent.elementSelectedToDelete);
      this.budgetDetails = this.budgetDetails.filter(element => element.id != this.popupComponent.elementSelectedToDelete);
      this.popupComponent.isDeleteConfirmationVisible = false;

      if (this.budgetDetailsList.length == 0) {

        this.budgetDetailsList = [];
      } else {

        this.budgetDetailsList = this.budgetDetailsTest;

      }

      this.totalCalculate();
    } catch (error) {
      console.log(error);
    }

  }
  direction() {
    this.router.navigate(['/home/budgets']);
  }

  addNewEditProduct(): void {
      this.editProductId--;
      let product: ProductsModel = {
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
      const model: BudgetDetailList = BudgetGridParser(product, this.bindPrice(product));
      this.budgetDetailsTest.push(model);

      this.budgetDetailsList = this.budgetDetailsTest;

      /* Parseo dato a Dto Factura Detalle */
      const modelDetail: BudgetDetails = BudgetDetailParser(product, this.bindPrice(product));
      this.budgetDetails.push(modelDetail);
      this.budgetDetailsList = this.budgetDetailsTest
      this.totalCalculate();
      this.isLoading = false;
  
      this.formProductSearch.controls['productSearchFilter'].setValue('');
    }

  startEditProductName(id: number): void {
    this.editIdProductName = id;
  }

   stopEditProductName(): void {
    this.editIdProductName = null;
  }

   changeProductName(name: string): void {
    this.budgetDetailsList.filter(
      detail => detail.ownCode == this.editIdProductName
    )[0].productName = name;

    this.budgetDetails.filter(
      detail => detail.productId == this.editIdProductName
    )[0].productName = name;
  }

  stopEditProductPrice(): void {
    this.editIdProductPrice = null;
  }

  startEditProductPrice(id: number): void {
    this.editIdProductPrice = id;
  }

  changeProductPrice(price: number): void {
    //recupero el producto a editar
    let product = this.budgetDetailsList.filter(
      detail => detail.ownCode == this.editIdProductPrice)[0];

    this.budgetDetailsList.filter(
      detail => detail.ownCode == this.editIdProductPrice
    )[0].price = price;

    this.budgetDetails.filter(
      detail => detail.productId == this.editIdProductPrice
    )[0].price = price;

    this.budgetDetailsList.filter(
      detail => detail.ownCode == this.editIdProductPrice
    )[0].subTotal = product.quantity * price;

    this.totalCalculate();
  }

  updatePriceByPaymentSelectedChange(): void {
  
      if (this.budgetDetails.length > 0) {
        this.isLoading = true;
        
        let invoiceDetailsAux = this.budgetDetailsList.filter(data => data.productId > 0);
        
        if (invoiceDetailsAux.length > 0) {

          this.budgetDetailsList = [];
          this.budgetDetailsTest = [];
          this.budgetDetails = [];
        
          const observables = invoiceDetailsAux.map(data =>
            this.serviceProduct.getById(data.productId).pipe(
              map(product => ({
                product,
                quantity: data.quantity
              }))
            )
          );
    
          forkJoin(observables).subscribe({
            next: (results) => {
              results.forEach(({ product, quantity }) => {
                const model: BudgetDetailList = BudgetGridParser(product, this.bindPrice(product), quantity);
                this.budgetDetailsTest.push(model);
                this.budgetDetailsList = this.budgetDetailsTest;
    
                const modelDetail: BudgetDetails = BudgetDetailParser(product,this.bindPrice(product), quantity);
                this.budgetDetails.push(modelDetail);
              });
    
              this.totalCalculate();
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error al obtener productos', err);
              this.isLoading = false;
            }
          });

        }

        this.isLoading = false;
      };
  }

  updateProductIdToEdit(budgetDetail: BudgetDetails[]): void{
    budgetDetail.map((item)=>{
      if (item.productId < 0){
        item.productId = this.editProductId;
        item.id = this.editProductId;
        this.editProductId--;
      }
    })
  }
}
