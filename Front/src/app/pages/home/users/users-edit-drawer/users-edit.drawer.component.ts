import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NzDrawerRef } from "ng-zorro-antd/drawer";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { eRol, rolList } from "../model/rol.enum";
import { UserModel } from "../model/user.model";
import { UserService } from "../users.services";

@Component({
    selector: 'app-users.edit-drawer',
    templateUrl: './users-edit.drawer.component.html',
})

export class UsersEditDrawerComponent extends BaseComponent implements OnInit {
    @Input() set filter(value: number) {
        this.id = value;
    };
    /*
** Header
*/
    @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
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
    ** Determina si se estan cargando los roles
    */
   isLoadingRoles = true;


   /*
    ** Determina si se muestra la sección para cambio de password
    */
   showPasswordChange = true;
   /*
 ** Formulario
 */
   form!: FormGroup;

   /*
    ** Listado de todos los roles
    */
   allRols = rolList;
   rolSelected!: number;


    constructor(
        private service: UserService,
        notificacionService: NzNotificationService,
        el: ElementRef,
        message: NzMessageService,
        private fb: FormBuilder,
        private drawerRef: NzDrawerRef<string>
    ) {
        super(notificacionService, el, message);
        this.form = this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            userName: ['', [Validators.required]],
            password: ['', [Validators.required]],
            email: ['', [Validators.email]],
            roleId: [2, [Validators.required]],

        })
    }

    ngOnInit(): void {
        if (this.id != null || this.id != undefined || this.id != 0) {
            this.getUser(this.id)
        }
    };
    getRolName(id: number) {
        return eRol[id];
    }

    getUser(id: number): void {
        if (id != 0)
        this.service.getById(id).subscribe({
            next: (r) => {
                this.form.controls['firstName'].setValue(r.firstName),
                    this.form.controls['lastName'].setValue(r.lastName),
                    this.form.controls['userName'].setValue(r.userName),
                    this.form.controls['email'].setValue(r.email),
                    this.form.controls['roleId'].setValue(this.allRols
                        .filter((v: { value: any, label: string}) =>  v.value == r.roleId)
                        .map((v: any) => v.value)[0]);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        })
    };

    save(): void {
        this.updateConfirmValidator(); 
        if (this.isValidForm(this.form)) {
            const model: UserModel = {
                id: this.id !== undefined ? this.id : 0,
                firstName: this.form.controls['firstName'].value,
                lastName: this.form.controls['lastName'].value,
                userName: this.form.controls['userName'].value,
                password: this.form.controls['password'].value,
                email: this.form.controls['email'].value,
                roleId: this.form.controls['roleId'].value
            };
            this.isSaving = true;
            this.service.saveUser(model)
            .subscribe({
                next: (r)=>{
                    this.showNotificationSuccess(
                        'Guardado correcto',
                        `Se guardo correctamente el usuario ${model.userName}`
                    );
                    this.isSaving = false;
                   this.close(r.id);
                },
                error: ()=>{
                    this.isSaving = false;
                    this.showMessageError('No se pudo Guardar el usuario');
                    this.close();
                }
            })}   
    };
    close(id: number | void): void {
        this.drawerRef.close(id);
    };

       /*
     ** Muestra los inputs para cambiar la constraseña y los hace obligatorios
     */
     showPasswordChangeBox(): void {
        this.form.controls['password'].setValidators([Validators.required]);
        this.form.get('password')!.updateValueAndValidity();
        this.form.controls['checkpassword'].setValidators([Validators.required, this.confirmationValidator]);
        this.form.get('checkpassword')!.updateValueAndValidity();
        this.showPasswordChange = true;
    }

    /*
     ** Comprueba que ambas contraseñas son iguales
     */
    updateConfirmValidator(): void {
        Promise.resolve().then(() => this.form.controls['password'].updateValueAndValidity());
        //  Promise.resolve().then(() => this.form.controls.checkpassword.updateValueAndValidity());
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.form.controls['password'].value) {
            return { confirm: true, error: true };
        }
        return {};
    }

}