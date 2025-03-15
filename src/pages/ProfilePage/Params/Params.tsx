import { useNavigate } from "react-router-dom";
import { useAppDispatch } from '../../../hooks/redux';
import { setIsOpen } from '../../../store/reducer/modal';
import { actionLogout } from "../../../store/thunks/checkLogin";
import './Params.scss'
import { IoMdLock } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";

function Params() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogOutButton = () => {
    dispatch(actionLogout());
    navigate('/');
  }

  const handleOpenModalButton = () => {
    dispatch(setIsOpen({ modal: 'confirmModalIsOpen', value: true }));
  }

  return (
    <div className="params">
      <h2 className="params_title">Paramètres</h2>
      <div className="params_infos">
        <span className="params_infos_name"><IoMdLock />Se déconnecter partout</span>
        <span className="params_infos_value">Si vous avez perdu un appareil ou si vous avez des problèmes de sécurité,
          déconnectez-vous partout pour assurer la sécurité de votre compte.</span>
      </div>
      <div className="params_btn">
        <button onClick={handleLogOutButton} className="params_btn_name">Se déconnecter partout</button>
        <span className="params_btn_value">Vous serez déconnecté(e) sur cet appareil aussi.</span>
      </div>
      <div className="params_infos">
        <span className="params_infos_name"><MdDeleteSweep />Supprimer son compte</span>
        <span className="params_infos_value">Si vous souhaitez supprimer définitement votre compte.</span>
      </div>
      <div className="params_btn">
        <button onClick={handleOpenModalButton} className="params_btn_name params_btn_name-important">Supprimer le compte</button>
        <span className="params_btn_value">Votre compte sera définitivement perdu.</span>
      </div>
    </div>
  )
}

export default Params;