export interface CartState {
    cart: ICartWithBooks | null;
    loading: boolean;
    error: string | null;
}

export type CartItem = ICartItem;

export interface ICartItem {
    id: string;
    bookId: string;
    userId: string;
    quantity: number;
    price: number;
    dateCreated: Date;
    dateUpdated: Date;
}

export interface ICart {
    id: string;
    userId: string;
    items: ICartItem[];
    total: number;
    dateCreated: Date;
    dateUpdated: Date;
}

export interface IAddToCartDTO {
    bookId: string;
    quantity: number;
}

export interface IUpdateCartItemDTO {
    quantity: number;
}

export interface ICartItemWithBook extends ICartItem {
    book: {
        title: string;
        author: string;
        imageUrl?: string;
    };
}

export interface ICartWithBooks extends ICart {
    items: ICartItemWithBook[];
}

export interface OrderResult {
    success: boolean;
    message: string;
    orderedItems?: Array<{
        bookId: string;
        quantity: number;
        price: number;
    }>;
}
