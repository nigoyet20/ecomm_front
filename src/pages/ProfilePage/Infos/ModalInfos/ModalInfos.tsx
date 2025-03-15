import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './ModalInfos.scss';
import Input from '../../../../components/App/Input/Input';
import { ModalInfosProps } from '../../../../@types/Modal';
import { useAddressHelper } from "../../../../utils/addressFunction";
import { useAppSelector } from "../../../../hooks/redux";

function ModalInfos({ isOpen }: ModalInfosProps) {
  const modalInfosbackgroundRef = useRef<HTMLDivElement>(null);
  const modalInfos = useRef<HTMLDivElement>(null);

  const infos = useAppSelector((state) => state.account.account.infos);
  const email = useAppSelector((state) => state.account.account.email);

  const { handleChange, handleReset, handleSubmit } = useAddressHelper();
  return (
    <div>
      <CSSTransition nodeRef={modalInfosbackgroundRef} in={isOpen} timeout={300} classNames="modalInfo_fade" unmountOnExit>
        <div ref={modalInfosbackgroundRef} className="modalInfo_background" onClick={handleReset}></div>
      </CSSTransition>

      <CSSTransition nodeRef={modalInfos} in={isOpen} timeout={300} classNames="modalInfo_slide-up" unmountOnExit>
        <div ref={modalInfos} className="modalInfo">
          <form className="modalInfo_form" onSubmit={handleSubmit} onReset={handleReset}>
            <h2 className="modalInfo_title">Modifier le profil</h2>
            <div className="modalInfo_container">
              <Input name='firstname' type='text' text='Prénom' backWhite required handleChange={handleChange} value={infos.firstname} modal="infos" />
              <Input name='lastname' type='text' text='Nom' backWhite required handleChange={handleChange} value={infos.lastname} modal="infos" />
            </div>

            <Input name='email' type='text' text='email' backWhite handleChange={handleChange} value={email} modal="infos" disabled />
            <div className="modalInfo_buttons">
              <div className="modalInfo_buttons_right">
                <button type="reset" className="modalInfo_buttons_right_cancel">Annnuler</button>
                <button type="submit" className="modalInfo_buttons_right_submit">Enregistrer</button>
              </div>
            </div>
          </form>
        </div>
      </CSSTransition>
    </div>
  )
}

export default ModalInfos;
