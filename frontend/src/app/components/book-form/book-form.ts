import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book, RegisteredBook } from '../../models/book';
import { BookService } from '../../services/books';

@Component({
  selector: 'app-book-form',
  imports: [FormsModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookForm implements OnInit {
  @Input() book: RegisteredBook | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  constructor(private bookService: BookService) {}
  title = '';
  author = '';
  publishedDate = '';
  onSubmit() {
    const payload = {
      title: this.title,
      author: this.author,
      publishedDate: this.publishedDate,
    };
    if (this.book) {
      this.bookService.editBook({ ...payload, id: this.book.id }).subscribe({
        next: (res) => {
          this.saved.emit();
          this.close.emit();
        },
        error: (err) => {
          console.error('failed to edit book', err);
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
        },
      });
    }
  }
  onClose() {
    this.close.emit();
  }
  ngOnInit() {
    if (this.book) {
      const { title, author, publishedDate } = this.book;
      this.title = title;
      this.author = author;
      this.publishedDate = publishedDate;
    }
  }
}
