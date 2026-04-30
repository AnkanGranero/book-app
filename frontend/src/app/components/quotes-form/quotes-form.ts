import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ModalWrapper } from "../modal-wrapper/modal-wrapper";
import { RegisteredQuote } from "../../models/quote";
import { QuoteService } from "../../services/quotes";
import { FormsModule } from "@angular/forms";


@Component({
    selector: 'app-quote-form',
    imports: [FormsModule, ModalWrapper],
    templateUrl:"./quotes-form.html"
})

export class QuoteForm implements OnInit {
  @Input() quote: RegisteredQuote | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  constructor(private quoteService: QuoteService) {}
  content = '';
  author = '';
  isSubmitting = false;
  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    const payload = {
      content: this.content,
      author: this.author,
    };
    if (this.quote) {
      this.quoteService.editQuote({ ...payload, id: this.quote.id }).subscribe({
        next: () => {
          this.saved.emit();
          this.close.emit();
        },
        error: (err) => {
          console.error('failed to edit quote', err);
          this.isSubmitting = false;
        },
      });
    } else {
      this.quoteService.addQuote(payload).subscribe({
        next: () => {
          this.saved.emit();
          this.close.emit();
        },
        error: (err) => {
          console.error('failed to add quote', err);
          this.isSubmitting = false;
        },
      });
    }
  }
  ngOnInit() {
    if (this.quote) {
      const { content, author } = this.quote;
      this.content = content;
      this.author = author;
    }
  }
}