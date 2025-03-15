import { useRef } from 'react';
import './Popup.scss'
import { CSSTransition } from 'react-transition-group';
import { useAppSelector } from "../../../hooks/redux";

function Popup({ isOpen, clearPopup }: { isOpen: boolean, clearPopup: () => void }) {
  const popupRef = useRef<HTMLDivElement>(null);

  const popupText = useAppSelector((state) => state.ModalMenu.popup.text);
  const popupError = useAppSelector((state) => state.ModalMenu.popup.error);

  return (
    <CSSTransition nodeRef={popupRef} in={isOpen} timeout={300} classNames="fade" unmountOnExit>
      <div ref={popupRef} className={popupError ? 'popup popup-error' : 'popup'} onClick={clearPopup}>
        <span>{popupText}</span>
      </div>
    </CSSTransition >
  )
}

export default Popup;
