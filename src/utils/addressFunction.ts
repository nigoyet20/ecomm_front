import { ChangeEvent, FormEvent } from "react";
import DOMPurify from "dompurify";
import { CheckProfileAddressI, CheckProfileInfosI } from "../@types/account";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { actionAddAddressFromAccount, actionDeleteAddressFromAccount, actionUpdateAddressFromAccount, actionUpdateInfosFromAccount } from "../store/thunks/checkAccount";
import { setIsOpen, toggleIsOpen } from "../store/reducer/modal";
import { actionChangeAddressAllInfos, actionChangeAddressOneInfo, actionResetAddress, actionSetInfos } from "../store/reducer/account";

export const getDefaultAddress = (listAddress: CheckProfileAddressI[]) => {

  if (typeof (listAddress) !== 'object' || listAddress.length === 0 || !listAddress)
    return null;

  try {
    const defaultAddress = listAddress.find((address) => address.default === true);

    if (!defaultAddress)
      return null;
    else
      return defaultAddress;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const gettAddressExceptDefault = (listAddress: CheckProfileAddressI[]) => {

  if (typeof (listAddress) !== 'object' || listAddress.length === 0 || !listAddress)
    return null;

  try {
    const addresses = listAddress.filter((address) => address.default !== true);

    if (!addresses)
      return null;
    else
      return addresses;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const useAddressHelper = () => {
  const dispatch = useAppDispatch();

  const account = useAppSelector((state) => state.account.account);
  const modalAdressIsOpen = useAppSelector((state) => state.ModalMenu.modals.modalAdressIsOpen);
  const modalInfosIsOpen = useAppSelector((state) => state.ModalMenu.modals.modalInfosIsOpen);
  const modalAddressIsEdit = useAppSelector((state) => state.ModalMenu.modals.modalAddressIsEdit);
  const infos = useAppSelector((state) => state.account.account.infos);
  const address = useAppSelector((state) => state.account.account.address);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (modalAdressIsOpen) {
      dispatch(actionChangeAddressOneInfo({ name, value }));
    } else
      dispatch(actionChangeAddressOneInfo({ name, value }));
    if
      (modalInfosIsOpen) {
      dispatch(actionSetInfos({ ...infos, [name]: value }));
    }
  }

  const handleDelete = () => {
    dispatch(actionDeleteAddressFromAccount({ account_id: account.id, address_id: address.id }));
    dispatch(toggleIsOpen('modalAdressIsOpen'));
  }

  const handleReset = (e: FormEvent) => {
    e.preventDefault();
    if (modalAdressIsOpen) {
      dispatch(toggleIsOpen('modalAdressIsOpen'));
      dispatch(actionResetAddress());
    }
    if (modalInfosIsOpen) {
      dispatch(toggleIsOpen('modalInfosIsOpen'));
    }

  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (modalInfosIsOpen) {
      const data = { ...infos, email: account.email, account_id: account.id };
      const escapedEmail = DOMPurify.sanitize(data.email);
      const escapedFirstname = DOMPurify.sanitize(data.firstname);
      const escapedLastname = DOMPurify.sanitize(data.lastname);
      const dataEscaped = { email: escapedEmail, firstname: escapedFirstname, lastname: escapedLastname, account_id: data.account_id };
      dispatch(actionUpdateInfosFromAccount(dataEscaped));
      dispatch(toggleIsOpen('modalInfosIsOpen'));
      return;
    }
    if (modalAddressIsEdit) {
      dispatch(actionResetAddress());
      const dataEscaped = {
        ...address,
        firstname: DOMPurify.sanitize(address.firstname),
        lastname: DOMPurify.sanitize(address.lastname),
        entreprise: DOMPurify.sanitize(address.entreprise),
        address: DOMPurify.sanitize(address.address),
        precision: DOMPurify.sanitize(address.precision),
        postal_code: DOMPurify.sanitize(address.postal_code),
        city: DOMPurify.sanitize(address.city),
        phone: DOMPurify.sanitize(address.phone)
      };
      dispatch(actionUpdateAddressFromAccount(dataEscaped));
    } else {
      dispatch(actionResetAddress());
      const dataEscaped = {
        ...address,
        account_id: account.id,
        firstname: DOMPurify.sanitize(address.firstname),
        lastname: DOMPurify.sanitize(address.lastname),
        entreprise: DOMPurify.sanitize(address.entreprise),
        address: DOMPurify.sanitize(address.address),
        precision: DOMPurify.sanitize(address.precision),
        postal_code: DOMPurify.sanitize(address.postal_code),
        city: DOMPurify.sanitize(address.city),
        phone: DOMPurify.sanitize(address.phone)
      };
      dispatch(actionAddAddressFromAccount(dataEscaped));
    }
    dispatch(toggleIsOpen('modalAdressIsOpen'));
    return;
  }

  const handleModify = (args?: { address?: CheckProfileAddressI; infos?: CheckProfileInfosI }) => {
    const { address, infos } = args || {};
    if (address) {
      dispatch(setIsOpen({ modal: 'modalAddressIsEdit', value: true }));
      dispatch(actionChangeAddressAllInfos(address));
      dispatch(toggleIsOpen('modalAdressIsOpen'));
    }
    if (infos) {
      dispatch(toggleIsOpen('modalInfosIsOpen'));
      dispatch(actionSetInfos({
        email: account.email,
        firstname: infos.firstname,
        lastname: infos.lastname,
      }));
    }
  };

  const getPrimaryAddressFirst = () => {
    const listAddresses = [...account.listAddress];
    const indexDefault = listAddresses.findIndex((address) => address.default);

    if (indexDefault === -1) {
      return listAddresses;
    }

    const [defaultAddress] = listAddresses.splice(indexDefault, 1);
    listAddresses.unshift(defaultAddress);

    return listAddresses;
  }

  return { handleReset, handleSubmit, handleChange, handleDelete, handleModify, getPrimaryAddressFirst };
}