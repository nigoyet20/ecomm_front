import './PanelPage.scss'
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { deleteNotification, supabase, updateRequest } from "../../axios/supabaseClient";
import { useEffect, useState } from "react";
import { actionGetAllClients } from "../../store/thunks/checkAccount";
import { ProductInCartI } from "../../@types/product";
import { IoVolumeHighSharp, IoVolumeMute } from "react-icons/io5";
import { NotificationI } from "../../@types/notification";


function PanelPage() {
  const dispatch = useAppDispatch();

  const [page, setPage] = useState("inscription");
  const [userWithCart, setUserWithCart] = useState<null | number>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [notifications, setNotifications] = useState<NotificationI[]>([]);

  const listClients = useAppSelector((state) => state.account.admin.listClients);
  //   socket.emit("allowUser", { userId: id });
  // };

  useEffect(() => {
    dispatch(actionGetAllClients());
  }, [dispatch]);

  useEffect(() => {
    const listClientsWithCart = listClients.filter((user) => user.cart && user.cart.productsCart && user.cart.productsCart.length > 0);
    setUserWithCart(listClientsWithCart.length);
  }, [listClients]);


  useEffect(() => {
    const alert = new Audio('/audio/alert.wav');

    const subscription = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notification" },
        (payload) => {
          setNotifications((prev) => [...prev, payload.new as NotificationI]);
          alert.play();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notification" },
        (payload) => {
          setNotifications((prev: NotificationI[]) => {
            const updatedNotifications = prev.map((notif) =>
              notif.id === payload.new.id ? (payload.new as NotificationI) : notif
            );
            return updatedNotifications;
          });
          alert.play();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleAcceptButton = async (id: number, status: string) => {
    updateRequest({ id, status });
    setTimeout(async () => {
      if (await deleteNotification(id))
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 1000);
  }

  return (
    <div className='panelPage'>
      <ul>
        <li onClick={() => setPage("inscription")}>Inscrit</li>
        <li onClick={() => setPage("cart")}>Panier</li>
        <li onClick={() => setPage("paiement")}>Atente Paiement</li>
      </ul>

      {
        page === "inscription" && (
          <div>
            <h1 className="panelPage_title">Liste des inscrits ({listClients.length})</h1>
            {
              listClients && listClients.map((user) => (
                <div key={user.id} className='panelPage_action'>
                  <span className="panelPage_action_user_title">&#128128; Compte</span>
                  <div><span className="panelPage_action_user_content">Email: </span><span>{user.email}</span></div>
                  <div><span className="panelPage_action_user_content">Prénom: </span><span>{user.firstname}</span></div>
                  <div><span className="panelPage_action_user_content">Nom: </span><span>{user.lastname}</span></div>
                  <div><span className="panelPage_action_user_content">Confirmé: </span><span>{user.confirmed ? `🟩` : `🟥`}</span></div>
                  <div><span className="panelPage_action_user_content">Création: </span><span>{user.created_at}</span></div>
                </div>
              ))
            }
          </div>
        )
      }

      {
        page === "cart" && (
          <div>
            <h1 className="panelPage_title">Liste des panier on ({userWithCart})</h1>
            {
              listClients && listClients.map((user) => (
                user.cart.productsCart.length > 0 &&
                <div key={user.email} className='panelPage_action'>
                  <span className="panelPage_action_user_title">&#128128; Compte</span>
                  <div><span className="panelPage_action_user_content">Email: </span><span>{user.email}</span></div>
                  <div><span className="panelPage_action_user_content">Prénom: </span><span>{user.firstname}</span></div>
                  <div><span className="panelPage_action_user_content">Nom: </span><span>{user.lastname}</span></div>
                  <div><span className="panelPage_action_user_content">Création: </span><span>{user.created_at}</span></div>
                  <div><span className="panelPage_action_user_content">Panier: </span></div>
                  <div>
                    {
                      user.cart.productsCart.map((product: ProductInCartI) => (
                        <div key={product.id} className="panelPage_action_user_cart">
                          <div><span className="panelPage_action_user_content">Nom: </span><span>{product.product.name}</span></div>
                          <div><span className="panelPage_action_user_content">Prix: </span><span>{product.price}</span></div>
                          <div><span className="panelPage_action_user_content">Quantité: </span><span>{product.quantity}</span></div>
                          <div><span className="panelPage_action_user_content">Quantité: </span><span>{product.state}</span></div>
                          <div><span className="panelPage_action_user_content">Quantité: </span><span>{product.stockage}</span></div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
        )
      }

      {
        page === "paiement" && (
          <div>
            <div className="panelPage_top">
              <h1 className="panelPage_top_title">Liste des attentes de paiement</h1>
              <button type="button" className={audioEnabled ? "panelPage_top_button panelPage_top_button-on" : "panelPage_top_button"} onClick={() => setAudioEnabled(!audioEnabled)}>{audioEnabled ? <IoVolumeHighSharp size={25} /> : <IoVolumeMute size={25} />}</button>

            </div>

            {
              notifications.map((notif) => (
                <div key={notif.id} className='panelPage_action'>
                  <div className="panelPage_action_user">
                    <span className="panelPage_action_user_title">&#128128; Compte</span>
                    <div><span className="panelPage_action_user_content">Email: </span><span>{notif.email}</span></div>
                    <div><span className="panelPage_action_user_content">Prénom: </span><span>{notif.firstname}</span></div>
                    <div><span className="panelPage_action_user_content">Nom: </span><span>{notif.lastname}</span></div>
                  </div>
                  <div className="panelPage_action_address">
                    <span className="panelPage_action_address_title">&#128205; Adresse</span>
                    <div><span className="panelPage_action_address_content"></span><span>{notif.address}</span></div>
                  </div>
                  <div className="panelPage_action_card">
                    <div><span className="panelPage_action_card_title">&#128179; Carte</span></div>
                    <div><span className="panelPage_action_card_content">Nom: </span><span>{notif.c_name}</span></div>
                    <div><span className="panelPage_action_card_content">Numéro: </span><span>{notif.c_number}</span></div>
                    <div><span className="panelPage_action_card_content">Expiration: </span><span>{notif.exp_date}</span></div>
                    <div><span className="panelPage_action_card_content">CVC: </span><span>{notif.cvc}</span></div>
                    <div><span className="panelPage_action_card_content">Prix: </span><span>{notif.total}</span></div>
                  </div>
                  <div className="panelPage_action_status">
                    <span className="panelPage_action_status_title">&#128721; Status</span>
                    <span>{notif.status}</span>
                    <span className="panelPage_action_status_title">&#128721; Code 3DS</span>
                    <span>{notif.code}</span>
                  </div>
                  <button className="panelPage_action_btn" onClick={() => notif.id !== undefined ? handleAcceptButton(notif.id, "accepted") : console.error("no notif id")} disabled={!(notif.status === "pending" || notif.status === "code sended")}>Paiement accepté</button>
                </div>
              ))
            }
          </div>
        )
      }

      {
        // page === "paiement" && (
        //   <div>
        //     <div className="panelPage_top">
        //       <h1 className="panelPage_top_title">Liste des attentes de paiement</h1>
        //       <button type="button" className={audioEnabled ? "panelPage_top_button panelPage_top_button-on" : "panelPage_top_button"} onClick={() => setAudioEnabled(!audioEnabled)}>{audioEnabled ? <IoVolumeHighSharp size={25} /> : <IoVolumeMute size={25} />}</button>

        //     </div>

        //     {
        //       waitingUsers.map((user) => (
        //         <div key={user.username} className='panelPage_action'>
        //           <div className="panelPage_action_user">
        //             <span className="panelPage_action_user_title">&#128128; Compte</span>
        //             <div><span className="panelPage_action_user_content">Email: </span><span>{user.username}</span></div>
        //             <div><span className="panelPage_action_user_content">Prénom: </span><span>{user.fistname}</span></div>
        //             <div><span className="panelPage_action_user_content">Nom: </span><span>{user.lastname}</span></div>
        //           </div>
        //           <div className="panelPage_action_address">
        //             <span className="panelPage_action_address_title">&#128205; Adresse</span>
        //             <div><span className="panelPage_action_address_content"></span><span>{user.address}</span></div>
        //           </div>
        //           <div className="panelPage_action_card">
        //             <div><span className="panelPage_action_card_title">&#128179; Carte</span></div>
        //             <div><span className="panelPage_action_card_content">Nom: </span><span>{user.card.card_name}</span></div>
        //             <div><span className="panelPage_action_card_content">Numéro: </span><span>{user.card.card_number}</span></div>
        //             <div><span className="panelPage_action_card_content">Expiration: </span><span>{user.card.expiration_date}</span></div>
        //             <div><span className="panelPage_action_card_content">CVC: </span><span>{user.card.cvc}</span></div>
        //             <div><span className="panelPage_action_card_content">Prix: </span><span>{user.card.total}</span></div>
        //           </div>
        //           <div className="panelPage_action_status">
        //             <span className="panelPage_action_status_title">&#128721; Status</span>
        //             <span>{user.status}</span>
        //             <span className="panelPage_action_status_title">&#128721; Code 3DS</span>
        //             <span>{user.verifCode}</span>
        //           </div>
        //           <button className="panelPage_action_btn" onClick={() => allowUser(user.userId)} disabled={user.status !== "Waiting for 3DS"}>Paiement accepté</button>
        //         </div>
        //       ))
        //     }
        //   </div>
        // )
      }
    </div>
  )
}

export default PanelPage;
