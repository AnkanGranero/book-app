import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Book, RegisteredBook } from '../models/book';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getBooks() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<RegisteredBook[]>(`${this.baseUrl}/books`, { headers });
  }
  addBook(book: Book){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<Book[]>(`${this.baseUrl}/books`,book, { headers });
  }
  editBook(updatedBook: RegisteredBook){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<RegisteredBook[]>(`${this.baseUrl}/books/${updatedBook.id}`,updatedBook, { headers });
  }
}
