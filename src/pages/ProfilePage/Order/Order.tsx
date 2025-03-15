
import { useAppSelector } from "../../../hooks/redux";
import { dateAddDays, dateToString } from "../../../utils/dateFormat";
import { LiaShippingFastSolid } from "react-icons/lia";
import { TbPackageExport } from "react-icons/tb";


import './Order.scss'

function Order() {
  const orders = useAppSelector((state) => state.order.orders);

  return (
    <div className="order">
      <h2 className="order_title">Commandes</h2>
      {
        orders.length > 0 ?
          orders.map((order, index) => {
            return (
              <div key={index} className="order_infos">
                <div className="order_infos_header">
                  <div className="order_infos_header_left">
                    <span className="order_infos_header_left_orderDate">{dateToString(order.created_at)} <TbPackageExport size={20} /></span>
                  </div>
                  <div className="order_infos_header_right">
                    <span className="order_infos_header_right_shippingDate"><LiaShippingFastSolid size={20} />{dateAddDays(order.created_at, 7)}</span>
                  </div>
                </div>
                <span className="order_infos_commandNumber">{order.delivery_address}</span>
                <div className="order_infos_container">
                  {
                    order.productsOrder.map((product, index) => {
                      return (
                        <div key={index} className="order_infos_body">
                          <div className="order_infos_body_img">
                            <img src={product.product.image_url[product.color]} alt="" />
                          </div>
                          <div className="order_infos_body_infos">
                            <span className="order_infos_body_infos_name">{product.product.name}</span>
                            <span className="order_infos_body_infos_color">{product.product.color_name[product.color]} {product.state} {product.stockage}</span>
                            <div className="order_infos_body_infos_bottom">
                              <span className="order_infos_body_infos_bottom_price">{product.price.replace(".", ",")}€</span>
                              <span className="order_infos_body_infos_bottom_quantity">x{product.quantity}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
                <span className="order_infos_total">{order.total},00€</span>
              </div>
            )
          })
          :
          <div className="order_infos">
            <span className="order_infos_name">Aucune commande pour l'instant</span>
            <span className="order_infos_value">Accèdez à la boutique pour passer une commande</span>
          </div>
      }

    </div>
  )
}

export default Order;
