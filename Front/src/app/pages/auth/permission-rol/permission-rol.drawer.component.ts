
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzDrawerRef } from "ng-zorro-antd/drawer";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { TransferItem } from "ng-zorro-antd/transfer";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { PopupConfirmationComponent } from "src/app/common/components/popup-confirmation/popup-confirmation.component";
import { SecurityAuthService } from "../security-auth.service";
import { PermissionRol } from "./model/permission-rol.model";

@Component({
    selector: 'app-permission-rol-drawer',
    templateUrl: './permission-rol.drawer.component.html'
})

export class PermissionRolDrawerComponent extends BaseComponent implements OnInit {

    @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
    @ViewChild('popup') popupComponent!: PopupConfirmationComponent;

    isSaving!: boolean;
    isLoading = false;
    disabled = false;
    permissionRol= [];
    permissionRolList: PermissionRol[]=[];
    list: TransferItem[]=[];
    listComplete: TransferItem[]=[];
    /* Formulario  */
    form!: FormGroup;
    rolSelected: any;
    permissionIdList:number[] =[];

    constructor(       
       private servicePermission: SecurityAuthService,
        notificacionService: NzNotificationService,
        el: ElementRef,
        message: NzMessageService,
        private fb: FormBuilder,
        private drawerRef: NzDrawerRef<string>
    ){
        super(notificacionService, el, message);
        this.form= this.fb.group({
            roleId: ['', Validators.required],
            permissions: [[], Validators.required]
        });
    }
    
    ngOnInit(): void {
      this.getPermission();
      this.getPermissionRol();
    }
    getPermission():void {
        this.servicePermission.permissionList().subscribe({
            next:(r) =>{
                r.forEach((element: any) => {
                    this.list.push({ key: element.id, title: element.name, disabled: false
                        , direction: 'left'
                })});
                this.listComplete= this.list;
                
            },
            error: ()=> {}
        })
    }
    getPermissionRol():void {
        this.servicePermission.permissionRolList().subscribe({
            next:(r) =>{
               this.permissionRol = r.map((rol:{id: number, rol: string})=>
               {return{ value: rol.id, label: rol.rol} });  
               this.permissionRolList= r;
               console.log(this.permissionRolList);
                                            
            },
            error: ()=> {
                this.permissionRol= [];
            }
        })
    };
    rolSelectedChange(id: any): void {
        this.rolSelected = id;
        console.log(this.form);        
      }
    close(id: number | void): void {
        this.drawerRef.close(id);
    };

    msjConfirmOk(){
        // try {
        //  if (this.isValidForm(this.form)){
        //    this.save();
        //  } else{
        //    this.showMessageError('Formulario vacio') 
        //  }
        //  } catch (error) {
        //    console.log(error);
           
        //  }
      }
      change(ret: any): void {
        console.log(ret);
        
        ret.list.forEach((element: {key:any, title: string, direction: string}) =>{
            if (element.direction === 'right'){
            this.permissionIdList.push(Number(element.key))};
            if (element.direction === 'left'){
                this.permissionIdList = this.permissionIdList.filter(number =>
                    number != Number(element.key))
            }
            this.form.controls['permissions'].setValue(this.permissionIdList);
        });
        
      }
}