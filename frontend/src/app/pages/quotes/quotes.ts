import { Component, OnInit, signal } from '@angular/core';
import { Quote } from '../../models/quote';
import { QuoteService } from '../../services/quotes';

@Component({
  selector: 'app-quotes',
  imports: [],
  templateUrl: './quotes.html',
  styleUrl: './quotes.css',
})
export class Quotes implements OnInit {
  quotes = signal<Quote[]>([]);

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
