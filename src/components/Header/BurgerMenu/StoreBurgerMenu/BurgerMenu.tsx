import { useAppDispatch } from '../../../../hooks/redux';
import { CSSTransition } from 'react-transition-group';
import { setIsOpen } from '../../../../store/reducer/modal';
import { IoLogoInstagram, IoLogoTiktok, IoLogoWhatsapp, IoCloseSharp } from "react-icons/io5";
import { RiSnapchatFill } from "react-icons/ri";
import './BurgerMenu.scss';
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';

const HamburgerMenu = ({ isOpen }: { isOpen: boolean }) => {
  const dispatch = useAppDispatch();
  const burgerMenuBackgroundRef = useRef<HTMLDivElement>(null);
  const burgerMenuRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    dispatch(setIsOpen({ modal: 'burgerModalIsOpen', value: false }));
  };

  return (
    <div>
      <CSSTransition nodeRef={burgerMenuBackgroundRef} in={isOpen} timeout={300} classNames="fade" unmountOnExit>
        <div ref={burgerMenuBackgroundRef} className="burgerMenu_background" onClick={handleOpen}></div>
      </CSSTransition>

      <CSSTransition nodeRef={burgerMenuRef} in={isOpen} timeout={300} classNames="slide-up" unmountOnExit>
        <div ref={burgerMenuRef} className="burgerMenu">
          <div className="burgerMenu_container">
            <ul className="burgerMenu_list">
              <NavLink to="/" onClick={handleOpen} className={({ isActive }) => (isActive ? 'burgerMenu_list_link burgerMenu_list_link-active' : 'burgerMenu_list_link')}>Accueil</NavLink>
              <NavLink to="/collection/iPhone" onClick={handleOpen} className={({ isActive }) => (isActive ? 'burgerMenu_list_link burgerMenu_list_link-active' : 'burgerMenu_list_link')}>iPhone</NavLink>
              <NavLink to="/collection/Samsung" onClick={handleOpen} className={({ isActive }) => (isActive ? 'burgerMenu_list_link burgerMenu_list_link-active' : 'burgerMenu_list_link')}>Samsung</NavLink>
              <NavLink to="/contact" onClick={handleOpen} className={({ isActive }) => (isActive ? 'burgerMenu_list_link burgerMenu_list_link-active' : 'burgerMenu_list_link')}>Contact</NavLink>
              <NavLink to="/faq" onClick={handleOpen} className={({ isActive }) => (isActive ? 'burgerMenu_list_link burgerMenu_list_link-active' : 'burgerMenu_list_link')}>FAQ</NavLink>
            </ul>
            <div className="burgerMenu_footer">
              <div className="burgerMenu_footer_socialNetworks">
                <IoLogoInstagram size={25} />
                <IoLogoTiktok size={25} />
                <RiSnapchatFill size={25} />
                <IoLogoWhatsapp size={25} />
              </div>
              <div className="burgerMenu_footer_account">
                <NavLink to="/profile" onClick={handleOpen} className="burgerMenu_footer_account_text">Mon compte</NavLink>
              </div>
            </div>
            <button className="burgerMenu_exitBtn" onClick={handleOpen}>
              <IoCloseSharp size={25} />
            </button>
          </div>
        </div>
      </CSSTransition >
    </div >
  );
};

export default HamburgerMenu;
