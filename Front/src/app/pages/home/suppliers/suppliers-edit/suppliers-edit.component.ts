import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { observable } from 'rxjs';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { EntityService } from '../../customers/customer.service';
import { CustomerAddModel } from '../../customers/model/customer.add.model';
import { eRol } from '../../users/model/rol.enum';


@Component({
    selector: 'app-suppliers-edit',
    templateUrl: './suppliers-edit.component.html',
    styleUrls: ['./suppliers-edit.component.css']
})
export class SuppliersEditComponent extends BaseComponent implements OnInit {



    @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
    /*
   ** Determina si esta en proceso de guardado
   */
    isSaving!: boolean;
    /*
   ** Determina si esta buscando el usuario
   */
    /*
    ** id del usuario a editar, si es nuevo...
    */
    id!: number;
    /*
  ** Formulario
  */
    form!: FormGroup;
    index!: number;
    isLoading = false;
    isLoadingEntity = false;
    demoCuit!: string;


    get phoneNumberArray() {
        return this.form.controls['phoneEntity'] as FormArray;
    }

    get phoneNumberControls() {
        return this.phoneNumberArray.controls as FormControl[]
    }
    get emailsArray() {
        return this.form.controls['emailEntity'] as FormArray;
    }

    get emailsControls() {
        return this.emailsArray.controls as FormControl[]
    }

    constructor(
        private service: EntityService,
        notificacionService: NzNotificationService,
        el: ElementRef,
        message: NzMessageService,
        private route: ActivatedRoute,
        private fb: FormBuilder
    ) {
        super(notificacionService, el, message);
    }

    ngOnInit(): void {
        this.route.params.subscribe({
            next: (p) => {
                let id= p['id'] ?? 0;
                this.isLoading = true;
                this.id= id;
                
                 this.getEntity(this.id)
                this.createForm(id);

            },
            error: () => { }
        })
    }
    createForm(id: number) {
        this.form = this.fb.group({
            id: [id],
            dni: ['', [Validators.required]],
            cuit: ['', [Validators.required]],
            name: ['', [Validators.required]],
            address: ['', [Validators.required]],
            observation: ['', [Validators.required]],
            phoneEntity: new FormArray([]),
            emailEntity: new FormArray([])
        })
    }

    getEntity(id: number): void {
        this.service.getSupplierById(id).subscribe({
            next: (r) => {
                this.form.controls['dni'].setValue(r.dni);
                this.form.controls['cuit'].setValue(r.cuit);
                this.form.controls['name'].setValue(r.name);
                this.form.controls['address'].setValue(r.address);
                this.form.controls['observation'].setValue(r.observation);

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
    }

    save(): void {
        if (!this.isValidForm(this.form)) return;
        const model = this.form.getRawValue();
        this.isSaving = true;
        this.service.saveSupplier(model).subscribe({
            next: (r) => {
                this.showNotificationSuccess(
                    'Guardado correcto',
                    `Se guardo correctamente el Proveedor ${model.name}`
                );
                this.isSaving = false;
                this.headerComponent.goBack();
            },
            error: () => {
                this.isSaving = false;
                this.showMessageError('No se pudo Guardar el Proveedor')
            }
        })
    }



    addPhoneField(e?: MouseEvent): void {
        if (e) {
            e.preventDefault();
        }
        let phoneNumberForm = this.form.controls['phoneEntity'] as FormArray;
        phoneNumberForm.push(new FormControl('', Validators.required));
    }

    addEmailField(e?: MouseEvent): void {
        if (e) {
            e.preventDefault();
        }
        let emailForm = this.form.controls['emailEntity'] as FormArray;
        emailForm.push(new FormControl('', Validators.required));
    }

    removeEmailField(e: MouseEvent, index: number): void {
        e.preventDefault();
        this.emailsArray.removeAt(index);
    }

    removePhoneField(e: MouseEvent, index: number): void {
        e.preventDefault();
        this.phoneNumberArray.removeAt(index);
    }


}
