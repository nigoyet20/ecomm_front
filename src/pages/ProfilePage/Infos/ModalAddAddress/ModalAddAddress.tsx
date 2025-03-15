import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './ModalAddAddress.scss';
import Input from '../../../../components/App/Input/Input';
import Checkbox from '../../../../components/App/Checkbox/Checkbox';
import { AddAddressProps, ModalAddAddressProps } from '../../../../@types/Modal';
import { useAppSelector } from "../../../../hooks/redux";
import { useAddressHelper } from "../../../../utils/addressFunction";

function ModalAddAddress({ isOpen, modalAddressIsEdit, nonModal }: ModalAddAddressProps) {
  const modalAdressbackgroundRef = useRef<HTMLDivElement>(null);
  const modalAdress = useRef<HTMLDivElement>(null);

  const { handleReset } = useAddressHelper();

  return (
    <div>
      <CSSTransition nodeRef={modalAdressbackgroundRef} in={isOpen} timeout={300} classNames="modalAddAddress_fade" unmountOnExit>
        <div ref={modalAdressbackgroundRef} className="modalAddAddress_background" onClick={handleReset}></div>
      </CSSTransition>

      <CSSTransition nodeRef={modalAdress} in={isOpen} timeout={300} classNames="modalAddAddress_slide-up" unmountOnExit>
        <AddAddress transiRef={modalAdress} modalAddressIsEdit={modalAddressIsEdit} nonModal={nonModal} />
      </CSSTransition>
    </div>
  )
}

function AddAddress({ transiRef, modalAddressIsEdit, nonModal }: AddAddressProps) {
  const countries = useAppSelector((state) => state.account.listCountries);
  const address = useAppSelector((state) => state.account.account.address);
  const { handleChange, handleDelete, handleReset, handleSubmit } = useAddressHelper();

  return (
    <div ref={transiRef} className={nonModal ? "modalAddAddress modalAddAddress-nonModal" : "modalAddAddress"}>
      <form className="modalAddAddress_form" onSubmit={handleSubmit} onReset={handleReset}>
        {!nonModal &&
          <div>
            <h2 className="modalAddAddress_title">{modalAddressIsEdit ? "Modifier une adresse" : "Ajouter une adresse"} </h2>
            <Checkbox text="Définir comme adresse par défaut" checked={address.default} handleChange={handleChange} />
          </div>
        }
        <select name="country" id="country_id" className="modalAddAddress_countries" value={address.country.code} onChange={handleChange} required>
          {
            countries.map((country, index) => (
              <option key={index} value={country.code}>{country.name}</option>
            ))
          }
        </select>
        <div className="modalAddAddress_container">
          <Input name='firstname' type='text' text='Prénom' backWhite required handleChange={handleChange} value={address.firstname} />
          <Input name='lastname' type='text' text='Nom' backWhite required handleChange={handleChange} value={address.lastname} />
        </div>

        <Input name='entreprise' type='text' text='Entreprise' backWhite handleChange={handleChange} value={address.entreprise} />
        <Input name='address' type='text' text='Adresse' backWhite required handleChange={handleChange} value={address.address} />
        <Input name='precision' type='text' text="Complément d\'adresse" backWhite handleChange={handleChange} value={address.precision} />
        <div className="modalAddAddress_container">
          <Input name='postal_code' type='text' text='Code postal' backWhite required handleChange={handleChange} value={address.postal_code} />
          <Input name='city' type='text' text='Ville' backWhite required handleChange={handleChange} value={address.city} />
        </div>
        <Input name='phone' type='text' text='Téléphone' backWhite required handleChange={handleChange} value={address.phone} />
        {!nonModal &&
          <div className={modalAddressIsEdit ? "modalAddAddress_buttons" : "modalAddAddress_buttons modalAddAddress_buttons-edit"}>
            <button type='button' onClick={handleDelete} className={modalAddressIsEdit ? "modalAddAddress_buttons_delete modalAddAddress_buttons_delete-edit" : "modalAddAddress_buttons_delete"}>Supprimer</button>
            <div className="modalAddAddress_buttons_right">
              <button type="reset" className="modalAddAddress_buttons_right_cancel">Annnuler</button>
              <button type="submit" className="modalAddAddress_buttons_right_submit">Enregistrer</button>
            </div>
          </div>
        }
      </form>
    </div>

  )
}

export { ModalAddAddress, AddAddress };
