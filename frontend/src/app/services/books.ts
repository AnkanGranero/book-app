import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book, RegisteredBook } from '../models/book';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getBooks() {
    return this.http.get<RegisteredBook[]>(`${this.baseUrl}/books`);
  }
  addBook(book: Book) {
    return this.http.post<Book[]>(`${this.baseUrl}/books`, book);
  }
  editBook(updatedBook: RegisteredBook) {
    return this.http.put<RegisteredBook[]>(`${this.baseUrl}/books/${updatedBook.id}`, updatedBook);
  }
  deleteBook(book: RegisteredBook) {
    return this.http.delete<RegisteredBook[]>(`${this.baseUrl}/books/${book.id}`);
  }
}
