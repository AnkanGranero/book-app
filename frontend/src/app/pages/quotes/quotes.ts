import { Component, OnInit, signal } from '@angular/core';
import { RegisteredQuote } from '../../models/quote';
import { QuoteService } from '../../services/quotes';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { EntityCard } from '../../components/entity-card/entity-card';
import { QuoteForm } from '../../components/quotes-form/quotes-form';

@Component({
  selector: 'app-quotes',
  imports: [ConfirmDialog, EntityCard, QuoteForm],
  templateUrl: './quotes.html',
})
export class Quotes implements OnInit {
  quotes = signal<RegisteredQuote[]>([]);
  selectedQuote = signal<RegisteredQuote | null>(null);
  showForm = signal(false);
  showConfirmDialog = signal(false);
  quoteToDelete = signal<RegisteredQuote | null>(null);

  onConfirm() {
    const quote = this.quoteToDelete();
    if (quote) {
      this.deleteQuote(quote);
    }
    this.showConfirmDialog.set(false);
    this.quoteToDelete.set(null);
  }
  onDecline() {
    this.showConfirmDialog.set(false);
    this.quoteToDelete.set(null);
  }

  openQuoteForm(quote?: RegisteredQuote | null) {
    this.selectedQuote.set(quote ?? null);
    this.showForm.set(true);    
  }
  closeQuoteForm() {
    this.showForm.set(false);
  }
  openConfirmDialog(quote: RegisteredQuote) {
    this.quoteToDelete.set(quote);
    this.showConfirmDialog.set(true);
  }
  deleteQuote(quote: RegisteredQuote) {
    this.quoteService.deleteQuote(quote).subscribe({
      next: (data) => {
        this.loadQuotes();
      },
      error: (err) => {
        console.error('failed to delete quote');
      },
    });
  }

  loadQuotes() {
    this.quoteService.getQuotes().subscribe({
      next: (data) => {
        this.quotes.set(data);
      },
      error: (err) => {
        console.error('Failed to load quotes', err);
      },
    });
  }
  constructor(private quoteService: QuoteService) {}
  ngOnInit() {
    this.loadQuotes();
  }
}
