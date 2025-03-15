import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { toggleIsOpen } from '../../../store/reducer/modal';
import './BurgerButton.scss';

const HamburgerMenuButton = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const burgerMenuIsOpen = useAppSelector((state) => state.ModalMenu.modals.burgerModalIsOpen);

  const handleOpen = () => {
    dispatch(toggleIsOpen('burgerModalIsOpen'));
  };

  return (
    <button className={`${location.pathname === '/' ? 'burgerMenuButton burgerMenuButton-home' : 'burgerMenuButton'}`} onClick={() => handleOpen()} aria-label="Ouvrir burger menu">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          className={`line line1 ${burgerMenuIsOpen ? 'open' : ''}`}
          x1="10"
          y1="12"
          x2="30"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          className={`line line2 ${burgerMenuIsOpen ? 'open' : ''}`}
          x1="10"
          y1="20"
          x2="30"
          y2="20"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          className={`line line3 ${burgerMenuIsOpen ? 'open' : ''}`}
          x1="10"
          y1="28"
          x2="30"
          y2="28"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
};

export default HamburgerMenuButton;
