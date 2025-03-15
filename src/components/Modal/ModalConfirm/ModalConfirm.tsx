import { useRef } from 'react';
import './ModalConfirm.scss'
import { CSSTransition } from 'react-transition-group';

function ModalConfirm({ isOpen, title, content, acceptFunction, cancelFunction }: { isOpen: boolean, title: string, content: string, acceptFunction: () => void, cancelFunction: () => void }) {
  const modalConfirmBackgroundRef = useRef<HTMLDivElement>(null);
  const modalConfirmRef = useRef<HTMLDivElement>(null);

  return (
    <div className="modalConfirmContainer">
      <CSSTransition nodeRef={modalConfirmBackgroundRef} in={isOpen} timeout={300} classNames="modalConfirm_fade" unmountOnExit>
        <div ref={modalConfirmBackgroundRef} className="modalConfirmBackground" onClick={cancelFunction}></div>
      </CSSTransition>

      <CSSTransition nodeRef={modalConfirmRef} in={isOpen} timeout={300} classNames="modalConfirm_slide-up" unmountOnExit>
        <div ref={modalConfirmRef} className="modalConfirm">
          <form className="modalConfirm_form" onSubmit={acceptFunction} onReset={cancelFunction}>
            <h2 className="modalConfirm_title">{title}</h2>
            <span className="modalConfirm_text">{content}</span>
            <div className="modalConfirm_buttons">
              <div className="modalConfirm_buttons_right">
                <button type="reset" className="modalConfirm_buttons_right_cancel">Annuler</button>
                <button type="submit" className="modalConfirm_buttons_right_submit">Confirmer</button>
              </div>
            </div>
          </form>
        </div>
      </CSSTransition >
    </div>
  )
}

export default ModalConfirm;
