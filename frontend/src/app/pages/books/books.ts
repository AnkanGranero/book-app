import { Component, OnInit, signal } from '@angular/core';
import { Book } from '../../models/book';
import { BookService } from '../../services/books';
import { BookForm } from '../../components/book-form/book-form';


@Component({
  selector: 'app-books',
  imports: [BookForm],
  templateUrl: './books.html',
  styleUrl: './books.css',
})
export class Books implements OnInit {
  books = signal<Book[]>([]);
  selectedBook = signal<Book | null>(null);
  showForm = signal(false);

  openBookForm(book?: Book | null) {
    this.selectedBook.set(book ?? null);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
  }
  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books.set(data);
        console.log('Books loaded:', data);
      },
      error: (err) => {
        console.error('Failed to load books', err);
      },
    });
  }
}
