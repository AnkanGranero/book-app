import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'app-modal-wrapper',
    templateUrl: './modal-wrapper.html',
    styleUrl:"./modal-wrapper.css"
})
export class ModalWrapper {
    @Output() close = new EventEmitter<void>();
}