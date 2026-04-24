import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from '../../models/book';

@Component({
  selector: 'book-form',
  imports: [FormsModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookForm implements OnInit {
  @Input() book: Book | null = null;
  @Output() close = new EventEmitter<void>();

  title = '';
  author = '';
  publishedDate = '';
  onSubmit() {
    if (this.book) {
      console.log('edit');
    } else {
      console.log('add');
    }
  }
  onClose() {
    this.close.emit();
  }
  ngOnInit() {
    if(this.book) {
        const { title, author, publishedDate} = this.book;
        this.title = title;
        this.author = author;
        this.publishedDate = publishedDate;
    }
  }
}
