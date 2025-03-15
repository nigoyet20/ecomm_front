import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './ButtonLoader.scss'
import Loader3Balls from "../Loader3Balls/Loader3Balls";

interface ButtonLoaderPropsI {
  type: 'button' | 'submit';
  disabled: boolean;
  text: string;
  isLoading: boolean;
  children?: React.ReactNode;
}

function ButtonLoader({ type, disabled, text, isLoading }: ButtonLoaderPropsI) {
  const buttonLoaderRef = useRef<HTMLDivElement>(null);
  const buttonTextRef = useRef<HTMLDivElement>(null);

  return (
    <button type={type} className={disabled ? "buttonLoader" : "buttonLoader buttonLoader-disabled"} disabled={!disabled}>

      <CSSTransition in={isLoading} nodeRef={buttonLoaderRef} timeout={200} classNames="buttonLoader_transi_loader" unmountOnExit appear>
        <div className="buttonLoader_transi_loader_anim" ref={buttonLoaderRef}>
          <Loader3Balls />
        </div>
      </CSSTransition>

      <CSSTransition in={!isLoading} nodeRef={buttonTextRef} timeout={200} classNames="buttonLoader_transi_text" unmountOnExit appear>
        <span className="buttonLoader_transi_loader_text" ref={buttonTextRef}>{text}</span>
      </CSSTransition>

    </button>
  )
}

export default ButtonLoader;
