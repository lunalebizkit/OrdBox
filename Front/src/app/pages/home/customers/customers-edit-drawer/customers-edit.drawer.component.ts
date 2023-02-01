import { ElementRef, Input, OnInit, ViewChild, Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NzDrawerRef } from "ng-zorro-antd/drawer";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { PopupConfirmationComponent } from "src/app/common/components/popup-confirmation/popup-confirmation.component";
import { EntityService } from "../customer.service";


@Component({
    selector: 'app-customers.edit-drawer',
    templateUrl: './customers-edit.drawer.component.html',
})

export class CustomersEditDrawerComponent extends BaseComponent implements OnInit {
    @Input() set filter(value: number) {
        this.id = value;
    };
    /*
** Header
*/
    @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
    @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
    @ViewChild('pop') popComponent!: PopupConfirmationComponent;
    /*
   ** Determina si esta en proceso de guardado
   */
    isSaving!: boolean;

    /*
     ** Determina si esta buscando el usuario
     */
    isLoading = false;

    /*
     ** id del usuario a editar, si es nuevo...
     */
    id!: number;
    /*
** Formulario
*/
    form!: FormGroup;    
    demoCuit!: string;
    get phoneNumberArray() {
        return this.form.controls['phoneEntity'] as FormArray;
    };

    get phoneNumberControls() {
        return this.phoneNumberArray.controls as FormControl[]
    };

    get emailsArray() {
        return this.form.controls['emailEntity'] as FormArray;
    };

    get emailsControls() {
        return this.emailsArray.controls as FormControl[]
    };

    constructor(
        private service: EntityService,
        notificacionService: NzNotificationService,
        el: ElementRef,
        message: NzMessageService,
        private fb: FormBuilder,
        private drawerRef: NzDrawerRef<string>
    ) {
        super(notificacionService, el, message);
        this.form = this.fb.group({
            dni: ['', [Validators.required, Validators.pattern, Validators.maxLength]],
            cuit: ['', [Validators.required]],
            name: ['', [Validators.required]],
            address: ['', [Validators.required,Validators.maxLength]],
            phoneEntity: new FormArray([]),
            emailEntity: new FormArray([])

        })
    }

    ngOnInit(): void {
        if (this.id != null || this.id != undefined || this.id != 0) {
            this.getEntity(this.id)
        }
    }

    getEntity(id: number): void {
        if (id != 0)
        this.service.getById(id).subscribe({
            next: (r) => {
                this.form.controls['dni'].setValue(r.dni);
                this.form.controls['cuit'].setValue(r.cuit);
                this.form.controls['name'].setValue(r.name);
                this.form.controls['address'].setValue(r.address);
                r.phoneEntity.forEach((e: any) => {
                    this.phoneNumberArray.push(new FormControl(e, [Validators.required]));
                });
                r.emailEntity.forEach((e: any) => {
                    this.emailsArray.push(new FormControl(`${e}`, [Validators.required]));
                });
                this.isLoading = false
            },
            error: () => { this.isLoading = false; }
        })
    };

    save(): void {
        if(!this.isValidForm(this.form)) return;          
        const model = this.form.getRawValue();
        model.id = this.id;        
        this.isSaving = true;
        this.service.saveCustomer(model).subscribe({
            next: (r) => {
                this.showNotificationSuccess(
                    'Guardado correcto',
                    `Se guardo correctamente el Cliente ${model.name}`
                );
                this.isSaving = false;
                this.close(r.id);
            },
            error: () => {
                this.isSaving = false;
                this.showMessageError('No se pudo Guardar el Cliente');
                this.close();
            }
        }) 
    };
    close(id: number | void): void {
        this.drawerRef.close(id);
    };

    addPhoneField(e?: MouseEvent): void {
        if (e) {
            e.preventDefault();
        }
   
        let phoneNumberForm = this.form.controls['phoneEntity'] as FormArray;
        phoneNumberForm.push(new FormControl(''));
    };

    addEmailField(e?: MouseEvent): void {
        if (e) {
            e.preventDefault();
        }   
        let emailForm = this.form.controls['emailEntity'] as FormArray;
        emailForm.push(new FormControl('',Validators.email));  
    };

    removeEmailField( e: MouseEvent, index: number): void {
        e.preventDefault();
        this.emailsArray.removeAt(index);   
    };

    removePhoneField( e: MouseEvent, index: number): void {
        e.preventDefault();
        this.phoneNumberArray.removeAt(index);   
    };

    msjConfirmOk(){
        try {
         if (this.isValidForm(this.form)) {
           this.popComponent.showConfirmation();
         } else{
           this.showMessageError
         }
         } catch (error) {
           console.log(error);
           
         }
      }

}