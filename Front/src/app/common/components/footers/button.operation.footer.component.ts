import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: 'app-button-op-footer',
    templateUrl: './button.operation.footer.component.html',
    styleUrls: ['button.operation.footer.css']
})

export class ButtonOperationFooter implements OnInit {
    //Class
    @Input('className') className: string = '';
    //Names
    @Input('btnSaveText') btnSaveText: string = '';
    // Icons
    @Input('iconSave') iconSave!: string;
    //Events
    @Output('onSaveClick') onSaveClick: EventEmitter<any> =
        new EventEmitter<any>();
    //Spinner
    @Input('showSpinner') showSpinner!: boolean;

    //Disabled
    @Input('disabled') disabled: boolean = false;

    ngOnInit(): void { }
};