import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../state/store';
import { logout } from '../state/features/auth/authSlice';
import { CartItem } from '../types/cart.types';

const Navbar = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const { cart } = useSelector((state: RootState) => state.cart);

    const cartItemCount = useMemo(() => {
        if (!cart?.items) return 0;
        return cart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
    }, [cart?.items]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md w-full`}>
            <div className="px-6">
                <div className="flex justify-between items-center h-16 max-w-[2000px] mx-auto">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold tracking-tight">ReadY</span>
                        {user && (
                            <span className="ml-4 text-sm">
                                Welcome, {user.name} ({user.role})
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        {user && user.role !== 'admin' && (
                            <button
                                onClick={() => navigate('/orders')}
                                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="Cart"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-6 w-6" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                                    />
                                </svg>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                        )}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full ${
                                isDarkMode ? 'bg-yellow-400 text-gray-800' : 'bg-gray-800 text-yellow-400'
                            }`}
                        >
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700`}
                            title="Logout"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-6 w-6" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
