import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import { fetchAllBooks, updateBookStock, deleteBook } from '../../state/features/book/bookSlice';
import { addToCart } from '../../state/features/cart/cartSlice';
import { Book } from '../../types/book.types';
import Navbar from '../../components/Navbar';
import AddBookModal from '../../components/AddBookModal';
import EditBookModal from '../../components/EditBookModal';
import { getImageUrl } from '../../utils/image.utils';

const Dashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { books, isLoading, error } = useSelector((state: RootState) => state.book);
    const { user } = useSelector((state: RootState) => state.auth);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    useEffect(() => {
        dispatch(fetchAllBooks());
    }, [dispatch]);

    const handleIncreaseStock = async (id: string, currentStock: number) => {
        await dispatch(updateBookStock({
            id,
            stockData: { quantity: currentStock + 1 }
        }));
    };

    const handleEditBook = (book: Book) => {
        setSelectedBook(book);
        setShowEditModal(true);
    };

    const handleDeleteBook = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            await dispatch(deleteBook(id));
        }
    };

    const handleAddToCart = async (book: Book) => {
        try {
            await dispatch(addToCart({ bookId: book.id, quantity: 1 }));
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (isLoading) return (
        <>
            <Navbar />
            <div className="text-center p-4 dark:text-white">Loading...</div>
        </>
    );

    if (error) return (
        <>
            <Navbar />
            <div className="text-red-500 text-center p-4">{error}</div>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <div className="px-6 py-4 max-w-[2000px] mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Books</h1>
                    {user?.role === 'admin' && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Add New Book
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {books.map((book) => (
                        <div key={book.id} className="border rounded p-4 shadow bg-white dark:bg-gray-800 dark:border-gray-700">
                            <div className="w-full h-48 mb-4">
                                {book.imageUrl ? (
                                    <img
                                        src={getImageUrl(book.imageUrl)}
                                        alt={book.title}
                                        className="w-full h-full object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                        <span className="text-gray-400 dark:text-gray-500">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2 dark:text-white">{book.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">By {book.author}</p>
                                <p className="text-gray-600 dark:text-gray-300 mb-2">{book.description}</p>
                                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">Category: </span>
                                        <span className="text-gray-700 dark:text-gray-300 capitalize">{book.category}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">ISBN: </span>
                                        <span className="text-gray-700 dark:text-gray-300">{book.isbn}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">Publisher: </span>
                                        <span className="text-gray-700 dark:text-gray-300">{book.publisher}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">Year: </span>
                                        <span className="text-gray-700 dark:text-gray-300">{book.publishedYear}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Stock: </span>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{book.stock}</span>
                                        <span className="mx-2 text-gray-500">|</span>
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">${Number(book.price).toFixed(2)}</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        {user?.role === 'admin' ? (
                                            <>
                                                <button
                                                    onClick={() => handleIncreaseStock(book.id, book.stock)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                    title="Increase Stock"
                                                >
                                                    + Stock
                                                </button>
                                                <button
                                                    onClick={() => handleEditBook(book)}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                    title="Edit Book"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBook(book.id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                    title="Delete Book"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleAddToCart(book)}
                                                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 flex items-center space-x-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span>Add to Cart</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <AddBookModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
            {selectedBook && (
                <EditBookModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedBook(null);
                    }}
                    book={selectedBook}
                />
            )}
        </div>
    );
};

export default Dashboard;
