import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Quote,RegisteredQuote} from '../models/quote';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getQuotes() {
    return this.http.get<RegisteredQuote[]>(`${this.baseUrl}/quotes`);
  }
  addQuote(quote: Quote) {
    return this.http.post<Quote[]>(`${this.baseUrl}/quotes`, quote);
  }
  editQuote(updatedQuote: RegisteredQuote) {
    return this.http.put<RegisteredQuote[]>(`${this.baseUrl}/quotes/${updatedQuote.id}`, updatedQuote);
  }
  deleteQuote(quote: RegisteredQuote) {
    return this.http.delete<RegisteredQuote[]>(`${this.baseUrl}/quotes/${quote.id}`);
  }
}
