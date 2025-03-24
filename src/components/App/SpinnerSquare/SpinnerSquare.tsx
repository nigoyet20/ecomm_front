import { useRef } from "react";
import { CSSTransition } from 'react-transition-group';
import './SpinnerSquare.scss'

function SpinnerSquare({ isOpen }: { isOpen: boolean }) {
  const loaderRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition nodeRef={loaderRef} in={isOpen} timeout={500} classNames="loader_fade" unmountOnExit>
      <div ref={loaderRef} className="spinnerSquareLoader">
        <div className="spinnerSquare"></div>
      </div>

    </CSSTransition>

  )
}

export default SpinnerSquare;
