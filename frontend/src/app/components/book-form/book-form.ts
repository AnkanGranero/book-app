import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisteredBook } from '../../models/book';
import { BookService } from '../../services/books';
import { ModalWrapper } from '../modal-wrapper/modal-wrapper';

@Component({
  selector: 'app-book-form',
  imports: [FormsModule, ModalWrapper],
  templateUrl: './book-form.html',
})
export class BookForm implements OnInit {
  @Input() book: RegisteredBook | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  constructor(private bookService: BookService) {}
  title = '';
  author = '';
  publishedYear: number | null = null;
  isSubmitting = false;
  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    const payload = {
      title: this.title,
      author: this.author,
      publishedYear: this.publishedYear,
    };
    if (this.book) {
      this.bookService.editBook({ ...payload, id: this.book.id }).subscribe({
        next: (res) => {
          this.saved.emit();
          this.close.emit();
        },
        error: (err) => {
          console.error('failed to edit book', err);
          this.isSubmitting = false;
        },
      });
    } else {
      this.bookService.addBook(payload).subscribe({
        next: (res) => {
          this.saved.emit();
          this.close.emit();
        },
        error: (err) => {
          console.error('failed to add book', err);
          this.isSubmitting = false;
        },
      });
    }
  }
  ngOnInit() {
    if (this.book) {
      const { title, author, publishedYear } = this.book;
      this.title = title;
      this.author = author;
      this.publishedYear = publishedYear;
    }
  }
}
