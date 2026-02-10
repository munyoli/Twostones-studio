import type { ReactNode, FC } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { CartProvider } from './features/cart/context/CartContext';

const queryClient = new QueryClient();

interface AppProvidersProps {
    children: ReactNode;
}

export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <CartProvider>
                    <Router>
                        {children}
                    </Router>
                </CartProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};
