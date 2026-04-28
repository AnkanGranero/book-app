export interface Quote {
    content: string;
    author: string;
}

export interface RegisteredQuote extends Quote {
    id: number;
}