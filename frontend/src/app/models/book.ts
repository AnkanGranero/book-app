export interface Book {
    title: string;
    author: string;
    publishedDate: string;
}

export interface RegisteredBook extends Book {
    id: number
}