import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { CSSTransition } from 'react-transition-group';
import { setIsOpen } from '../../../../store/reducer/modal';
import { PiUserCircleThin } from "react-icons/pi";
import './ProfileBurgerMenu.scss';
import { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { actionLogout } from "../../../../store/thunks/checkLogin";

const HamburgerMenu = ({ isOpen, email }: { isOpen: boolean, email: string }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const burgerMenuBackgroundRef = useRef<HTMLDivElement>(null);
  const burgerMenuRef = useRef<HTMLDivElement>(null);

  const isAdmin = useAppSelector((state) => state.account.account.admin);

  const handleOpen = () => {
    dispatch(setIsOpen({ modal: 'burgerModalIsOpen', value: false }));
  };

  const handleDisconnectButton = () => {
    dispatch(setIsOpen({ modal: 'burgerModalIsOpen', value: false }));
    dispatch(actionLogout());
    navigate('/');
  }

  return (
    <div>
      <CSSTransition nodeRef={burgerMenuBackgroundRef} in={isOpen} timeout={300} classNames="pburgerMenu_fade" unmountOnExit>
        <div ref={burgerMenuBackgroundRef} className="pburgerMenu_background" onClick={handleOpen}></div>
      </CSSTransition>

      <CSSTransition nodeRef={burgerMenuRef} in={isOpen} timeout={300} classNames="pburgerMenu_slide-up" unmountOnExit>
        <div ref={burgerMenuRef} className="pburgerMenu">
          <div className="pburgerMenu_container">
            <div className="pburgerMenu_container_header">
              <div className="pburgerMenu_container_header_mail">
                <PiUserCircleThin size={30} />
                <span className="pburgerMenu_container_header_mail_text">{email}</span>
              </div>
              <ul className="pburgerMenu_list">
                <NavLink to="/" onClick={handleOpen} className={({ isActive }) => (isActive ? 'pburgerMenu_list_link pburgerMenu_list_link-active' : 'pburgerMenu_list_link')}>Boutique</NavLink>
                <NavLink to="/cart" onClick={handleOpen} className={({ isActive }) => (isActive ? 'pburgerMenu_list_link pburgerMenu_list_link-active' : 'pburgerMenu_list_link')}>Panier</NavLink>
                <NavLink to="/order" onClick={handleOpen} className={({ isActive }) => (isActive ? 'pburgerMenu_list_link pburgerMenu_list_link-active' : 'pburgerMenu_list_link')}>Commandes</NavLink>
                {
                  isAdmin &&
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <NavLink to="/discount" onClick={handleOpen} className={({ isActive }) => (isActive ? 'pburgerMenu_list_link pburgerMenu_list_link-active' : 'pburgerMenu_list_link')}>Réductions</NavLink>
                    <NavLink to="/panel" onClick={handleOpen} className={({ isActive }) => (isActive ? 'pburgerMenu_list_link pburgerMenu_list_link-active' : 'pburgerMenu_list_link')}>Panel</NavLink>
                  </div>
                }
              </ul>
            </div>

            <div className="pburgerMenu_footer">
              <NavLink to="/profile" onClick={handleOpen} className={({ isActive }) => (isActive ? 'pburgerMenu_footer_link pburgerMenu_footer_link-active' : 'pburgerMenu_footer_link')}>Profil</NavLink>
              <NavLink to="/params" onClick={handleOpen} className={({ isActive }) => (isActive ? 'pburgerMenu_footer_link pburgerMenu_footer_link-active' : 'pburgerMenu_footer_link')}>Paramètres</NavLink>
              <button onClick={handleDisconnectButton} className="pburgerMenu_footer_link">Se déconnecter</button>
            </div>
          </div>
        </div>
      </CSSTransition >
    </div >
  );
};

export default HamburgerMenu;
