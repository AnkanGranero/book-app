import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'app-modal-wrapper',
    templateUrl: './modal-wrapper.html',
})
export class ModalWrapper {
    @Output() close = new EventEmitter<void>();
}