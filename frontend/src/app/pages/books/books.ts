import { Component, computed, OnInit, signal } from '@angular/core';
import { Book, RegisteredBook } from '../../models/book';
import { BookService } from '../../services/books';
import { BookForm } from '../../components/book-form/book-form';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-books',
  imports: [BookForm, ConfirmDialog],
  templateUrl: './books.html',
  styleUrl: './books.css',
})
export class Books implements OnInit {
  books = signal<RegisteredBook[]>([]);
  selectedBook = signal<RegisteredBook | null>(null);
  showForm = signal(false);
  showConfirmDialog = signal(false);
  bookToDelete = signal<RegisteredBook | null>(null);
  confirmMessage = computed(() => `Are you sure you want to delete ${this.bookToDelete()?.title}`);

  onConfirm() {
    const book = this.bookToDelete();
    if (book) {
      this.deleteBook(book);
    }
    this.showConfirmDialog.set(false);
    this.bookToDelete.set(null);
  }
  onDecline() {
    this.showConfirmDialog.set(false);
    this.bookToDelete.set(null);
  }

  openBookForm(book?: RegisteredBook | null) {
    this.selectedBook.set(book ?? null);
    this.showForm.set(true);
  }

  closeBookForm() {
    this.showForm.set(false);
  }

  openConfirmDialog(book: RegisteredBook) {
    this.bookToDelete.set(book);
    this.showConfirmDialog.set(true);
  }

  deleteBook(book: RegisteredBook) {
    this.bookService.deleteBook(book).subscribe({
      next: (data) => {
        this.loadBooks();
      },
      error: (err) => {
        console.error('failed to delete book');
      },
    });
  }
  constructor(private bookService: BookService) {}

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books.set(data);
      },
      error: (err) => {
        console.error('Failed to load books', err);
      },
    });
  }
  ngOnInit() {
    this.loadBooks();
  }
}
