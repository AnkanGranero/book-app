import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Quote } from '../models/quote';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getQuotes() {
    return this.http.get<Quote[]>(`${this.baseUrl}/quotes`);
  }
  addQuote(quote: Quote) {
    return this.http.post<Quote[]>(`${this.baseUrl}/quotes`, quote);
  }
  editQuote(updatedQuote: Quote) {
    return this.http.put<Quote[]>(`${this.baseUrl}/quotes/${updatedQuote.id}`, updatedQuote);
  }
  deleteQuote(quote: Quote) {
    return this.http.delete<Quote[]>(`${this.baseUrl}/quotes/${quote.id}`);
  }
}
