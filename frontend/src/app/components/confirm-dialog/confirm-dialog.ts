import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'app-confirm-dialog',
    imports: [],
    templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  @Input() message = 'Are you sure?';
  @Output() confirm = new EventEmitter<void>();
  @Output() decline = new EventEmitter<void>();
}