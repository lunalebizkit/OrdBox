import { style } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header-op-buttons',
  templateUrl: './buttons.oparations.header.component.html',
  styleUrls: ['button.operations.header.css'],
})
export class HeaderOperationsButtonsComponent implements OnInit {
  @Input('btnSaveText') btnSaveText: string = 'Guardar';
  @Input('btnSendText') btnSendText: string = 'Enviar';
  @Input('btnCancelText') btnCancelText: string = 'Volver';
  @Input('btnCloseText') btnCloseText: string = 'Volver';
  @Input('btnDeleteText') btnDeleteText: string = 'Eliminar';
  @Input('btnUpdateText') btnUpdateText: string = 'Actualizar';
  @Input('tagText') tagText: string = '';
  @Input('title') title!: string;
  @Input('iconSave') iconSave!: string;
  @Input('iconDelete') iconDelete!: string;
  @Input('iconTitle') iconTitle!: string;
  @Input('iconBack') iconBack!: string;
  @Input('iconSend') iconSend!: string;
  @Input('iconUpdate') iconUpdate!: string;
  @Input('showSpinner') showSpinner!: boolean;
  @Input('hideTag') hideTag: boolean = true;
  @Input('hideUpdate') hideUpdate: boolean = true;
  @Input('hideSave') hideSave: boolean = false;
  @Input('hideBack') hideBack: boolean = false;
  @Input('hideClose') hideClose: boolean = false;
  @Input('hideDelete') hideDelete: boolean = true;
  @Input('hideSend') hideSend: boolean = true;
  @Input('disabled') disabled: boolean = false;
  @Output('onSaveClick') onSaveClick: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('onSendClick') onSendClick: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('onCancelClick') onCancelClick: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('onDeleteClick') onDeleteClick: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('onCloseClick') onCloseClick: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('onUpdateClick') onUpdateClick: EventEmitter<any> =
    new EventEmitter<any>();

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {}

  goBack() {
    if (this.onCancelClick.length > 0) {
      this.onCancelClick.emit();
    } else {
      this.route.params.subscribe((p) => {
        let url = this.router.routerState.snapshot.url
          .split('home/', 2)[1]
          .split('/')[0];
        switch (url) {
          case 'products':
            let productId = p['id'] ? p['id'] : null;
            this.router.navigate(['/home/products/list', { productId }]);
            break;
          default:
            if (p['id']) {
              this.router.navigate(['../../'], { relativeTo: this.route });
            } else {
              this.router.navigate(['../'], { relativeTo: this.route });
            }
            break;
        }
      });
    }
  }
}
