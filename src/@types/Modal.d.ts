export interface ModalAddAddressProps {
  isOpen: boolean;
  modalAddressIsEdit: boolean;
  nonModal?: boolean;
}

export interface AddAddressProps {
  transiRef?: React.RefObject<HTMLDivElement>;
  modalAddressIsEdit: boolean;
  nonModal?: boolean;
}

export interface ModalInfosProps {
  isOpen: boolean;
}