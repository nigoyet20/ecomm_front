
import './Infos.scss'
import { CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { IoInformationCircleOutline } from "react-icons/io5";
import { ModalAddAddress } from './ModalAddAddress/ModalAddAddress';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import ModalInfos from './ModalInfos/ModalInfos';
import { setIsOpen, toggleIsOpen } from "../../../store/reducer/modal";
import { useAddressHelper } from "../../../utils/addressFunction";

function Infos() {
  const dispatch = useAppDispatch();

  const account = useAppSelector((state) => state.account.account);
  const modalAdressIsOpen = useAppSelector((state) => state.ModalMenu.modals.modalAdressIsOpen);
  const modalInfosIsOpen = useAppSelector((state) => state.ModalMenu.modals.modalInfosIsOpen);
  const modalAddressIsEdit = useAppSelector((state) => state.ModalMenu.modals.modalAddressIsEdit);
  const infos = useAppSelector((state) => state.account.account.infos);

  const { handleModify, getPrimaryAddressFirst } = useAddressHelper();

  const handleOpen = () => {
    dispatch(toggleIsOpen('modalAdressIsOpen'));
    dispatch(setIsOpen({ modal: 'modalAddressIsEdit', value: false }));
  };

  return (
    <div className="infos">
      <h2 className="infos_title">Profil</h2>
      <div className="infos_infos">
        <span className="infos_infos_name">Nom</span>
        <span className="infos_infos_value">{infos.firstname} {infos.lastname}</span>
        <span className="infos_infos_name">E-mail</span>
        <span className="infos_infos_value">{account.email}</span>
        <span className="infos_infos_button" onClick={() => handleModify({ infos: infos })}><CiEdit size={20} /></span>
      </div>
      <div className="infos_address">
        <div className="infos_address_header">
          <span className="infos_address_header_name">Adresse</span>
          <button onClick={handleOpen} className="infos_address_header_button"><FaPlus size={12} />Ajouter</button>
        </div>
        {
          getPrimaryAddressFirst().length === 0 ? (
            <div>
              <span className="infos_address_noAddress"><IoInformationCircleOutline size={20} />Aucune adresse ajoutée</span>
              <span className="infos_address_value"></span>
            </div>

          ) : (
            getPrimaryAddressFirst().map((address, index) => (
              <div key={index} className="infos_address_address">
                {address.default && <span className="infos_address_address_default">Adresse par défaut</span>}
                <span className="infos_address_address_value">{address.firstname} {address.lastname}</span>
                <span className="infos_address_address_value">{address.entreprise}</span>
                <span className="infos_address_address_value">{address.address}</span>
                <span className="infos_address_address_value">{address.precision}</span>
                <span>{address.postal_code} {address.city}</span>
                <span className="infos_address_address_value">{address.country.name}</span>
                <span className="infos_address_address_value">{address.phone}</span>
                <span className="infos_address_address_modif" onClick={() => handleModify({ address: address })}><CiEdit size={20} /></span>
              </div>
            ))
          )
        }

      </div>
      <ModalAddAddress isOpen={modalAdressIsOpen} modalAddressIsEdit={modalAddressIsEdit} />
      <ModalInfos isOpen={modalInfosIsOpen} />
    </div>
  )
}

export default Infos;
