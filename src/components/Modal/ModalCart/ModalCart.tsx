import { useRef } from 'react';
import './ModalCart.scss'
import { CSSTransition } from 'react-transition-group';
import CartPage from "../../../pages/CartPage/CartPage";

function ModalCart({ isOpen, cancelFunction }: { isOpen: boolean, cancelFunction: () => void }) {
  const modalCartBackgroundRef = useRef<HTMLDivElement>(null);
  const modalCartRef = useRef<HTMLDivElement>(null);

  return (
    <div className="modalCartContainer">
      <CSSTransition nodeRef={modalCartBackgroundRef} in={isOpen} timeout={300} classNames="modalCartBackground_fade" unmountOnExit>
        <div ref={modalCartBackgroundRef} className="modalCartBackground" onClick={cancelFunction}></div>
      </CSSTransition>

      <CSSTransition nodeRef={modalCartRef} in={isOpen} timeout={300} classNames="modalCart_slide-up" unmountOnExit>
        <div ref={modalCartRef} className="modalCart">
          <CartPage cancelFunction={cancelFunction} />
        </div>
      </CSSTransition >
    </div>
  )
}

export default ModalCart;
