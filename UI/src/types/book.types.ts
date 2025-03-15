export interface Book {
    id: string;
    title: string;
    description: string;
    author: string;
    category: 'physics' | 'chemistry' | 'biology' | 'mathematics';
    imageUrl?: string;
    isbn: string;
    publisher: string;
    publishedYear: number;
    stock: number;
    price: number;
    dateCreated: Date;
    dateUpdated: Date;
}

export interface CreateBookDTO {
    title: string;
    description: string;
    author: string;
    category: 'physics' | 'chemistry' | 'biology' | 'mathematics';
    imageUrl?: string;
    isbn: string;
    publisher: string;
    publishedYear: number;
    initialStock: number;
    price: number;
}

export interface UpdateStockDTO {
    quantity: number;
}

export interface BookState {
    books: Book[];
    selectedBook: Book | null;
    isLoading: boolean;
    error: string | null;
}
