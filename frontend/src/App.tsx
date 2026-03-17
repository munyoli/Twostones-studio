import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProviders } from './AppProviders';
import MainLayout from './layouts/MainLayout';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for performance
const Home = React.lazy(() => import('./pages/Home'));
const Shop = React.lazy(() => import('./pages/Shop'));
const Cart = React.lazy(() => import('./features/cart/pages/Cart'));
const Checkout = React.lazy(() => import('./features/cart/pages/Checkout'));
const OrderConfirmation = React.lazy(() => import('./features/cart/pages/OrderConfirmation'));
const Login = React.lazy(() => import('./features/auth/pages/Login'));
const Register = React.lazy(() => import('./features/auth/pages/Register'));
const JournalList = React.lazy(() => import('./pages/JournalList'));
const JournalExperience = React.lazy(() => import('./pages/JournalExperience'));
const AIStylist = React.lazy(() => import('./features/stylist/pages/StylistPage'));
const AdminLayout = React.lazy(() => import('./components/AdminLayout'));
const AdminClients = React.lazy(() => import('./pages/AdminClients'));
const AdminOrders = React.lazy(() => import('./pages/AdminOrders'));
const AdminJournals = React.lazy(() => import('./pages/AdminJournals'));
const Profile = React.lazy(() => import('./pages/Profile'));
const ManukatoCollection = React.lazy(() => import('./pages/ManukatoCollection'));
const ManukatoProduct = React.lazy(() => import('./pages/ManukatoProduct'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const ShippingReturns = React.lazy(() => import('./pages/ShippingReturns'));
const SizeGuide = React.lazy(() => import('./pages/SizeGuide'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const RunwayPage = React.lazy(() => import('./pages/RunwayPage'));

function App() {
  return (
    <AppProviders>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/journal" element={<JournalList />} />
            <Route path="/journal/:id" element={<JournalExperience />} />
            <Route path="/stylist" element={<AIStylist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/collection/manukato" element={<ManukatoCollection />} />
            <Route path="/collection/manukato/:id" element={<ManukatoProduct />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping" element={<ShippingReturns />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/runway" element={<RunwayPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div className="p-20 text-center"><h1 className="text-4xl font-serif font-bold text-brand-primary">Twostones Admin Dashboard</h1><p className="mt-4 text-stone-500 uppercase tracking-widest text-xs">Welcome to the inner court.</p></div>} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="journals" element={<AdminJournals />} />
          </Route>
        </Routes>
      </Suspense>
    </AppProviders>
  );
}

export default App;
