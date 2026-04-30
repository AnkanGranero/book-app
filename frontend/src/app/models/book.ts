export interface Book {
    title: string;
    author: string;
    publishedYear: number | null;
}

export interface RegisteredBook extends Book {
    id: number
}