import { Component } from '@angular/core';

@Component({
  selector: 'app-books',
  templateUrl: './books.html',
  styleUrl: './books.css'
})
export class Books {
  books = [
    {
      id: 1,
      title: 'Infinite Jest',
      author: 'David Foster Wallace',
      publishedDate: '1996-02-01'
    },
    {
      id: 2,
      title: 'Mannen som förväxlade sin hustru med en hatt',
      author: 'Oliver Sacks',
      publishedDate: '1985-01-01'
    }
  ];
}