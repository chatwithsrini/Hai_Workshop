export interface IBook {
    id: string;
    title: string;
    description: string;
    author: string;
    category: 'physics' | 'chemistry' | 'biology' | 'mathematics';
    imageUrl?: string;
    isbn: string;
    publisher: string;
    publishedYear: number;
    dateCreated: Date;
    dateUpdated: Date;
}

export interface IBookStock {
    id: string;
    bookId: string;
    quantity: number;
    price: number;
    dateCreated: Date;
    dateUpdated: Date;
}

export interface ICreateBookDTO {
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

export interface IUpdateStockDTO {
    quantity: number;
}

export interface IBookWithStock extends IBook {
    stock: number;
    price: number;
}
