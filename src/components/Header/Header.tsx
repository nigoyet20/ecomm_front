import './Header.scss'
import { FaRegUser } from "react-icons/fa";
import { PiSignInFill } from "react-icons/pi";
import { PiUserCircleThin } from "react-icons/pi";
import { BiBasket } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import BurgerButton from './BurgerMenu/BurgerButton';
import StoreBurgerMenu from './BurgerMenu/StoreBurgerMenu/BurgerMenu';
import ProfileBurgerMenu from './BurgerMenu/ProfileBurgerMenu/ProfileBurgerMenu';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { IoIosArrowUp } from 'react-icons/io';
import ModalConfirm from '../Modal/ModalConfirm/ModalConfirm';
import { actionDeleteAccount } from '../../store/thunks/checkAccount';
import { closeAllModal, setIsOpen, toggleIsOpen } from '../../store/reducer/modal';
import { actionLogout } from "../../store/thunks/checkLogin";
import ModalCart from "../Modal/ModalCart/ModalCart";
import { useEffect, useState } from "react";
import Popup from "../Modal/Popup/Popup";
import { actionChangeConnection, actionChangeCredentials } from "../../store/reducer/account";
import { usePopupMessage } from "../../utils/usePopup";


interface HeaderI {
  isAuthentificated: boolean;
  email: string;
  account_id?: number | null;
}

function Header({ isAuthentificated, email, account_id }: HeaderI) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const burgerMenuIsOpen = useAppSelector((state) => state.ModalMenu.modals.burgerModalIsOpen);
  const confirmModalIsOpen = useAppSelector((state) => state.ModalMenu.modals.confirmModalIsOpen);
  const cartModalIsOpen = useAppSelector((state) => state.ModalMenu.modals.modalCartIsOpen);
  const popupIsOpen = useAppSelector((state) => state.ModalMenu.modals.popupIsOpen);
  const isLogin = useAppSelector((state) => state.account.isAuthentificated);
  const cartCount = useAppSelector((state) => state.cart.cartConnected.length);
  const cartCountOffline = useAppSelector((state) => state.cart.cartVisitor.length);
  const mailSended = useAppSelector((state) => state.account.pending.mailSended);
  const admin = useAppSelector((state) => state.account.account.admin);

  const { setPopupMessage, handleClickPopup, timerPopup } = usePopupMessage();

  const [stateAnimationPopup, setstateAnimationPopup] = useState<string>('close');

  useEffect(() => {
    const email = searchParams.get('user');
    const warning = searchParams.get('warning');

    if (location.pathname.includes("/profile") && warning === 'true') {
      return setPopupMessage("Merci de renseigner vos informations avant de procéder à la commande");
    } else if (location.pathname.includes("/login") && searchParams.get('confirmed') === 'true' && email !== null) {
      dispatch(actionChangeCredentials({ name: "email", value: email }));
      if (searchParams.get('confirmed') === 'true')
        return setPopupMessage("Votre addresse email a bien été confirmée");
      else if (searchParams.get('confirmed') === 'false')
        return setPopupMessage("Erreur lors de la validation de l'adresse mail");
    }

    return () => {
      if (timerPopup)
        clearTimeout(timerPopup);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, location.pathname, mailSended, dispatch])

  const handlePopupButton = () => {
    switch (stateAnimationPopup) {
      case 'close':
        setstateAnimationPopup('open');
        setTimeout(() => {
          setstateAnimationPopup('open-active');
        }, 1);
        break;
      case 'open-active':
        setstateAnimationPopup('exit');
        setTimeout(() => {
          setstateAnimationPopup('exit-active');
          setTimeout(() => {
            setstateAnimationPopup('close');
          }, 300);
        }, 1);
        break;
    }
  }

  const handleDisconnectButton = () => {
    dispatch(actionLogout());
    navigate('/')
  }

  const handleDeleteAccountButton = () => {
    dispatch(setIsOpen({ modal: 'confirmModalIsOpen', value: false }));
    dispatch(actionDeleteAccount(account_id));
  }

  const exitCartModal = () => {
    dispatch(setIsOpen({ modal: 'modalCartIsOpen', value: false }));
  }

  const toggleCartModal = () => {
    dispatch(toggleIsOpen('modalCartIsOpen'));
  }

  const handleCancelAccounDeletetButton = () => {
    dispatch(setIsOpen({ modal: 'confirmModalIsOpen', value: false }));
  }

  const animePopup = (className: string) => {
    if (stateAnimationPopup) {
      return `${className}-${stateAnimationPopup}`;
    }
  }

  const mainPageClick = () => {
    dispatch(closeAllModal());
  }

  return (
    <>
      {
        location.pathname === '/params' || location.pathname === '/order' || location.pathname === '/profile' ?
          <div className="header-profile">
            <div className="header-profile_burger">
              <BurgerButton />
            </div>
            <ul className="header-profile_left">
              <li className="header-profile_left_logo" onClick={mainPageClick}><Link to="/" aria-label="Accueil">ODP</Link></li>
              <li><Link to="/" aria-label="Accueil" className="header-profile_left_link">Boutique</Link></li>
              <li><button aria-label="Panier" className="header-profile_left_link header-profile_left_link-cart" onClick={toggleCartModal}>Panier</button></li>
              <li><NavLink to="/order" aria-label="Commandes" className={({ isActive }) => (isActive ? 'header-profile_left_link header-profile_left_link-active' : 'header-profile_left_link')}>Commandes</NavLink></li>
              {
                admin && <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
                  <li><NavLink to="/discount" aria-label="Panel" className={({ isActive }) => (isActive ? 'header-profile_left_link header-profile_left_link-active' : 'header-profile_left_link')}>Réductions</NavLink></li>
                  <li><NavLink to="/panel" aria-label="Panel" className={({ isActive }) => (isActive ? 'header-profile_left_link header-profile_left_link-active' : 'header-profile_left_link')}>Panel</NavLink></li>
                </div>

              }
            </ul>
            <div onClick={handlePopupButton} className="header-profile_right" aria-label="Ouverture du menu de profil">
              <div className="header-profile_right_container">
                <PiUserCircleThin size={30} />
                <div className={stateAnimationPopup === 'open-active' ? "header-profile_right_container_icon header-profile_right_container_icon-open" : "header-profile_right_container_icon"}>
                  <IoIosArrowUp size={15} />
                </div>

              </div>
              <div className={animePopup("header-profile_right_popup header-profile_right_popup")}>
                <div className="header-profile_right_popup_header">
                  <PiUserCircleThin size={30} />
                  <span className="header-profile_right_popup_header_email">{email}</span>
                </div>
                <div className="header-profile_right_popup_content">
                  <NavLink to="/profile" aria-label="Profil" className={({ isActive }) => (isActive ? 'header-profile_right_popup_content_link header-profile_right_popup_content_link-active' : 'header-profile_right_popup_content_link')}>Profil</NavLink>
                  <NavLink to="/params" aria-label="Paramètres" className={({ isActive }) => (isActive ? 'header-profile_right_popup_content_link header-profile_right_popup_content_link-active' : 'header-profile_right_popup_content_link')}>Paramètres</NavLink>
                  <button onClick={handleDisconnectButton} className="header-profile_right_popup_content_link">Se déconnecter</button>
                </div>
              </div>
            </div>
          </div>
          :
          <div className={`${location.pathname === '/' ? 'header header-home' : 'header'}`}>
            <div className="header_burger">
              <BurgerButton />
            </div>
            <div className="header_logo">
              <Link to="/" className="header_logo_link" aria-label="Accueil">
                <span className={`${location.pathname === '/' ? 'header_logo_link_text header_logo_link_text-home' : 'header_logo_link_text'}`}>ODP</span>
              </Link>
            </div>
            <ul className="header_navbar">
              <li><NavLink to="/" aria-label="Accueil" className={({ isActive }) => (isActive ? 'header_navbar_link header_navbar_link-active' : location.pathname === '/' ? 'header_navbar_link header_navbar_link-home' : 'header_navbar_link')}>Accueil</NavLink></li>
              <li><NavLink to="/collection/iPhone" aria-label="Collection iPhone" className={({ isActive }) => (isActive ? 'header_navbar_link header_navbar_link-active' : location.pathname === '/' ? 'header_navbar_link header_navbar_link-home' : 'header_navbar_link')}>iPhone</NavLink></li>
              <li><NavLink to="/collection/Samsung" aria-label="Collection Samsung" className={({ isActive }) => (isActive ? 'header_navbar_link header_navbar_link-active' : location.pathname === '/' ? 'header_navbar_link header_navbar_link-home' : 'header_navbar_link')}>Samsung</NavLink></li>
              <li><NavLink to="/contact" aria-label="Contact" className={({ isActive }) => (isActive ? 'header_navbar_link header_navbar_link-active' : location.pathname === '/' ? 'header_navbar_link header_navbar_link-home' : 'header_navbar_link')}>Contact</NavLink></li>
              <li><NavLink to="/faq" aria-label="FAQ" className={({ isActive }) => (isActive ? 'header_navbar_link header_navbar_link-active' : location.pathname === '/' ? 'header_navbar_link header_navbar_link-home' : 'header_navbar_link')}>FAQ</NavLink></li>
            </ul>
            <div className="header_profile">
              {isAuthentificated ?
                <Link to="/profile" className={location.pathname === '/' ? "header_profile_links header_profile_links-home" : "header_profile_links"} aria-label="Profil">
                  <FaRegUser className="header_profile_links_link" size={22} />
                </Link>
                :
                <Link to="/login" onClick={() => dispatch(actionChangeConnection("checking"))} className={location.pathname === '/' ? "header_profile_links header_profile_links-home" : "header_profile_links"} aria-label="Connection">
                  <PiSignInFill className="header_profile_links_link" size={22} />
                </Link>
              }
              <button className={location.pathname === '/' ? "header_profile_links header_profile_links-home" : "header_profile_links"} onClick={toggleCartModal} aria-label="Panier">
                <BiBasket className="header_profile_links_link" size={25} />
                <span className="header_profile_links_cartcount">{isLogin ? cartCount : cartCountOffline}</span>
              </button>

            </div>
          </div >
      }

      {
        location.pathname === '/params' || location.pathname === '/order' || location.pathname === '/profile' ? <ProfileBurgerMenu isOpen={burgerMenuIsOpen} email={email} /> : <StoreBurgerMenu isOpen={burgerMenuIsOpen} />
      }

      {
        isAuthentificated && location.pathname === '/params' && <ModalConfirm isOpen={confirmModalIsOpen} title='Confirmation' content='Cette action est irréversible, souhaitez-vous vraiment supprimer définitivement votre compte ?' acceptFunction={handleDeleteAccountButton} cancelFunction={handleCancelAccounDeletetButton} />
      }

      <ModalCart isOpen={cartModalIsOpen} cancelFunction={exitCartModal} />

      <Popup isOpen={popupIsOpen} clearPopup={() => handleClickPopup()} />
    </>
  )
}

export default Header;
