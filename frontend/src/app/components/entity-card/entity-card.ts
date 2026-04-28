import { Component, EventEmitter, Input, Output } from "@angular/core";


@Component({
    selector: 'app-entity-card',
    templateUrl: './entity-card.html',
})
export class EntityCard {
    @Input() title?: string;
    @Output() edit = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();
}