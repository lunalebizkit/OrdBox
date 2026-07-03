import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup-confirmation',
  templateUrl: './popup-confirmation.component.html'
})
export class PopupConfirmationComponent implements OnInit {

  /*
   ** Indica si se muestra la confirmacion de eliminación y de que elemento
   */
   isDeleteConfirmationVisible = false;
   elementSelectedToDelete!: number;
   isConfirmationvisible= false;
   elementSelected!: number;
   isEmailConfirmationvisible= false;
   emailToSend!: string;

   @Input('title') title!: string;
   @Input('emailtitle') emailtitle!: string;
   @Input('header') header!: string;
   @Input('message') message!: string;
   @Input('disabled') disabled!: boolean;
   @Input('okLoading') okLoading!: boolean;
   @Output('handleOk') handleOk: EventEmitter<any> = new EventEmitter<any>();
   @Output('handleSend') handleSend: EventEmitter<string> = new EventEmitter<string>();
   @Input('emailDisabled') emailDisabled!: boolean;
  

  constructor() { }

  ngOnInit(): void {
  }

  handleCancel() {
    this.isDeleteConfirmationVisible = false;
    this.elementSelectedToDelete = 0;
  }

  showDeleteConfirmation(id: number) {
    this.isDeleteConfirmationVisible = true;
    this.elementSelectedToDelete = id;
  }
  showConfirmation(){
    this.isConfirmationvisible= true;

  }
  handleCance() {
    this.isConfirmationvisible = false;
    this.elementSelectedToDelete = 0;
  }
  
  showSendEmailConfirmation() {
    this.isEmailConfirmationvisible = true;
  }

  handleEmailCancel() {
    this.isEmailConfirmationvisible = false;
    this.emailToSend = '';
  }

  handleSendOk() {    
    this.handleSend.emit(this.emailToSend);
    this.isEmailConfirmationvisible = false;
  }

  isValidEmail(email: string): boolean {
    if (!email) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
