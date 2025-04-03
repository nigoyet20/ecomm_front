import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { actionCheckProduct } from '../../store/thunks/checkProduct';
import './ProductPage.scss'
import { useParams } from 'react-router-dom';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import Question from '../../components/App/Question/Question';
import questions from '../../data/questions';
import ColorRadio from '../../components/App/ColorRadio/ColorRadio';
import TextRadio from '../../components/App/TextRadio/TextRadio';
import Store from '../../components/App/Store/Store';
import { actionAddToCart } from "../../store/thunks/checkCart";
import { actionAddToCartOffline } from "../../store/reducer/cart";
import { setIsOpen } from "../../store/reducer/modal";
import { decodeHtmlEntities } from "../../utils/decodeHtmlEntities";

type ProductPageParams = {
  id: string;
  name: string;
}

function ProductPage() {
  const { id } = useParams<ProductPageParams>();

  const [selectorSelected, setSelectorSelected] = useState(0);
  const [stateSelected, setStateSelected] = useState(0);
  const [stockageSelected, setStockageSelected] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const list = useAppSelector((state) => state.product.list);
  const isLogin = useAppSelector((state) => state.account.isAuthentificated);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (list.length === 0 && id) {
      dispatch(actionCheckProduct());
    }
  }, [dispatch, id, list.length]);

  useEffect(() => {
    setStateSelected(0);
    setStockageSelected(0);
  }, [(id)]);

  const product = list.find((product) => product.id === Number(id));


  if (!product) return <h1>Produit introuvable</h1>

  const allStockageProduct = product?.Prices.map((price) => price.stockage);
  const stockageProduct = [...new Set(allStockageProduct)];

  const allStateProduct = product?.Prices.map((price) => price.state);
  const stateProduct = [...new Set(allStateProduct)];
  const customOrder = ["Neuf", "Parfait", "Très bon", "Correct", "Imparfait"];
  stateProduct.sort((a, b) => customOrder.indexOf(a) - customOrder.indexOf(b));

  let priceSel1 = product.Prices.filter((price) => price.state === stateProduct[stateSelected]);
  let priceSel2 = priceSel1.filter((price) => price.stockage === stockageProduct[stockageSelected]);

  if (priceSel1.length === 0 && priceSel2.length === 0) {
    priceSel1 = product.Prices.filter((price) => price.state === stateProduct[4]);
    priceSel2 = priceSel1.filter((price) => price.stockage === stockageProduct[0]);
    setStateSelected(0);
  }

  const handleSelectorChange = (index: number) => {
    setSelectorSelected(index);
  }

  const handleStateChange = (index: number) => {
    setStateSelected(index);
  }

  const handleStockageChange = (index: number) => {
    setStockageSelected(index);
  }

  const handleQuantityMenos = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  const handleQuantityPlus = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (quantity < 5) {
      setQuantity(quantity + 1);
    }
  }

  const generateStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoIosStar key={`full${i}`} />);
    }
    for (let i = 0; i < halfStars; i++) {
      stars.push(<IoIosStarHalf key={`half${i}`} />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<IoIosStarOutline key={`empty${i}`} />);
    }
    return stars;
  }

  const addToCart = () => {
    if (isLogin)
      dispatch(actionAddToCart({ productId: product.id, quantity, price: priceSel2[0].price, color: selectorSelected, state: stateProduct[stateSelected], stockage: stockageProduct[stockageSelected] }));
    else
      dispatch(actionAddToCartOffline({ productId: product.id, quantity, price: priceSel2[0].price, color: selectorSelected, state: stateProduct[stateSelected], stockage: stockageProduct[stockageSelected], product: product }));
    dispatch(setIsOpen({ modal: "modalCartIsOpen", value: true }))
  }

  return (
    <div className="product">
      <form>
        <div className="product_images">
          <img src={product.image_url[selectorSelected]} alt="image display" className="product_images_display" />
          <div className="product_images_selector">
            {product.image_url.map((image, index) => (
              <label htmlFor={product.name} className={selectorSelected === index ? "product_images_selector_label product_images_selector_label-checked" : "product_images_selector_label"} key={index}>
                <input type='radio' checked={selectorSelected === index} value={image} name={`image${product.name}`} onChange={() => handleSelectorChange(index)} alt="image selector color" className="product_images_selector_label_input" />
                <img src={image} alt="" className="product_images_selector_label_img" />
              </label>
            ))}
          </div>
        </div>
        <div className="product_infos">
          <h2 className="product_infos_title">{product.name}</h2>
          {
            priceSel2[0] &&
            <span className="product_infos_price">{`€${quantity * priceSel2[0].price},00`}</span>
          }

          <div className="product_infos_item">
            <span className="product_infos_item_text">Couleur: <span className="product_infos_item_text_select">{product.color_name[selectorSelected]}</span></span>
            <div className="product_colors">
              <ColorRadio selected={selectorSelected} setSelected={handleSelectorChange} colors={product.color_code} product={true} productName={product.id.toString()} />
            </div>
          </div>

          <div className="product_infos_item">
            <span className="product_infos_item_text">Etats: <span className="product_infos_item_text_select">{stateProduct[stateSelected]}</span></span>
            <TextRadio datas={stateProduct} stateSelected={stateSelected} setSelected={handleStateChange} />
          </div>

          <div>
            <Question title="Quel état choisir ?" content={questions[0].content} />
          </div>

          <div className="product_infos_item">
            <span className="product_infos_item_text">Stockage: <span className="product_infos_item_text_select">{stockageProduct[stockageSelected]}</span></span>
            <TextRadio datas={stockageProduct} stateSelected={stockageSelected} setSelected={handleStockageChange} />
          </div>

          <div className="product_infos_item">
            <span className="product_infos_item_text">Quantité:</span>
            <div className="product_infos_item_quantity">
              <button className="product_infos_item_quantity_button" onClick={handleQuantityMenos}><FaMinus /></button>
              <span>{quantity}</span>
              <button className="product_infos_item_quantity_button" onClick={handleQuantityPlus}><FaPlus /></button>
            </div>
          </div>

          <div className="product_infos_buttons">
            <button type="button" className="product_infos_button product_infos_button-submit" onClick={addToCart}>Ajouter au panier</button>
          </div>

          <div>
            <Question title="Description de l'article" content={decodeHtmlEntities(product.description)} />
          </div>

          <div className="reviews">
            <span className="reviews_title">Avis des clients</span>
            {product.Reviews ? product.Reviews.map((review, index) => (
              <div key={index} className="reviews_review">
                <div className="reviews_review_title">
                  <div key={index} className="reviews_review_title_stars">
                    {generateStars(review.rating)}
                  </div>
                  <span className="reviews_review_title_date">{review.date}</span>
                </div>
                <span className="reviews_review_author"><BiUser size={25} />{review.author}</span>
                <span className="reviews_review_comment">{review.comment}</span>
              </div>
            )) : <span className="reviews_noreview">Aucun avis</span>}
            <button className="reviews_button">Ajouter un avis</button>
          </div>
        </div>
      </form>
      <Store title="Explorez nos modèles" subtitle="Vous hésitez encore ?" amount={10} list={list} />
    </div>
  )
}

export default ProductPage;
