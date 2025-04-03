import './App.scss'
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { Route, Routes, useLocation } from 'react-router-dom';
import ScrollToTop from '../components/App/ScrollToTop/ScrollToTop';
import { Suspense, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { actionCheckToken } from '../store/thunks/checkLogin';
import { AdminRoute, NonPrivateRoute, PrivateRoute } from '../components/App/PrivateRoute/PrivateRoute';
import { lazy } from "react";
import VConsole from "vconsole";
import { useModalsWithBackButton } from "../hooks/useModalsWithBackButton.ts";
import ContactPage from "./ContactPage/ContactPage.tsx";
import FaqPage from "./FaqPage/FaqPage.tsx";
import CheckoutPage from "./CheckoutPage/CheckoutPage.tsx";
import ConfirmationPage from "./ConfirmationPage/ConfirmationPage.tsx";
import PaymentPage from "./PaymentPage/PaymentPage.tsx";
import PanelPage from "./PanelPage/PanelPage.tsx";
import DiscountPage from "./DiscountPage/DiscountPage.tsx";
import Order from "./ProfilePage/Order/Order.tsx";
import LoadingPage from './LoadingPage/LoadingPage.tsx';
import AffiliationPage from './AffiliationPage/AffiliationPage.tsx';

const HomePage = lazy(() => import('./HomePage/HomePage.tsx'));
const ProductPage = lazy(() => import('./ProductPage/ProductPage.tsx'));
const LoginPage = lazy(() => import('./LoginPage/LoginPage.tsx'));
const Params = lazy(() => import('./ProfilePage/Params/Params.tsx'));
const Infos = lazy(() => import('./ProfilePage/Infos/Infos.tsx'));
const CollectionPage = lazy(() => import('./CollectionPage/CollectionPage.tsx'));
const CartPage = lazy(() => import('./CartPage/CartPage.tsx'));

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const noHeaderPage = location.pathname === '/payment';
  const noFooterPage = location.pathname === '/login' ||
    location.pathname === '/params' ||
    location.pathname === '/order' ||
    location.pathname === '/profile' ||
    location.pathname === '/checkout' ||
    location.pathname === '/panel' ||
    location.pathname === '/discount' ||
    location.pathname === '/payment' ||
    location.pathname === '/affiliation';
  const isAuthentificated = useAppSelector((state) => state.account.isAuthentificated);
  const account = useAppSelector((state) => state.account.account);
  const burgerMenuIsOpen = useAppSelector((state) => state.ModalMenu.modals.burgerModalIsOpen);

  useModalsWithBackButton();

  useEffect(() => {
      new VConsole();
      console.log("vConsole est activé !");
  }, []);

  useEffect(() => {
    dispatch(actionCheckToken())
  }, [dispatch]);

  useEffect(() => {
    if (burgerMenuIsOpen)
      document.body.style.overflow = 'hidden';
    else
      document.body.style.overflow = 'auto';
  }, [burgerMenuIsOpen]);

  return (
    <div className="app">

      <Suspense fallback={<LoadingPage />}>
        {!noHeaderPage && <Header isAuthentificated={isAuthentificated} email={account.email} account_id={account.id} />}
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collection/:brand" element={<CollectionPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/login" element={<NonPrivateRoute isAuthenticated={isAuthentificated}><LoginPage /></NonPrivateRoute>}></Route>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<PrivateRoute isAuthenticated={isAuthentificated}><CheckoutPage /></PrivateRoute>} />
          <Route path="/payment" element={<PrivateRoute isAuthenticated={isAuthentificated}><PaymentPage /></PrivateRoute>} />
          <Route path="/params" element={<PrivateRoute isAuthenticated={isAuthentificated}><Params /></PrivateRoute>} />
          <Route path="/order" element={<PrivateRoute isAuthenticated={isAuthentificated}><Order /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute isAuthenticated={isAuthentificated}>{<Infos />}</PrivateRoute>} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/discount" element={<AdminRoute isAuthenticated={isAuthentificated}>{<DiscountPage />}</AdminRoute>} />
          <Route path="/panel" element={<AdminRoute isAuthenticated={isAuthentificated}>{<PanelPage />}</AdminRoute>} />
          <Route path="/affiliation" element={<AffiliationPage />} />
        </Routes>

        {!noFooterPage && <Footer />}
      </Suspense>

    </div>
  )
}

export default App;
