import './DiscountPage.scss'
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import Input from "../../components/App/Input/Input";
import { actionCheckDiscount, actionDeleteDiscount } from "../../store/thunks/checkDiscount";
import { actionChangeInput } from "../../store/reducer/discount";
import { isPercentage } from "../../utils/regexValidator";
import { MdDeleteForever } from "react-icons/md";
import { ChangeEvent, useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { actionCheckProduct } from "../../store/thunks/checkProduct";

function DiscountPage() {
  const dispatch = useAppDispatch();

  const discounts = useAppSelector((state) => state.discount.discounts);
  const products = useAppSelector((state) => state.product.list);
  const input = useAppSelector((state) => state.discount.input);

  const [productSelected, setProductSelected] = useState<number | "">("");
  const [productsSelected, setProductsSelected] = useState<number[]>([]);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(actionCheckProduct());
    }
  }, [dispatch, products.length]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "") return;

    const productId = parseInt(value);
    if (productsSelected.includes(productId)) return;

    setProductSelected("");
    setProductsSelected((prev) => [...prev, productId]);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(actionCheckDiscount({ code: input.code, discount: input.discount, products: productsSelected }));
  }

  return (
    <div className='discountPage'>
      <h1>Liste des réductions</h1>
      <form onSubmit={handleSubmit} className="discountPage_add">
        <div className="discountPage_add_group">
          <Input name='code' type='text' text='Code' backWhite={true} required={true} handleChange={(event) => dispatch(actionChangeInput({ name: "code", value: event.target.value }))} value={input.code} disabled={false} rows={0} columns={0} backgroundColor='transparent' />
          <div className="discountPage_add_group_discount">
            <Input name='discount' type='text' text='Réduction' backWhite={true} required={true} handleChange={(event) => dispatch(actionChangeInput({ name: "discount", value: event.target.value }))} value={(input.discount).toString()} disabled={false} rows={0} columns={0} backgroundColor='transparent' />
            <span className="discountPage_add_group_discount_symbol">{isPercentage(input.discount) ? "%" : "€"}</span>
          </div>
          <select name="products" id="product_id" className="discountPage_add_group_products" value={productSelected} onChange={handleChange}>
            <option value="">Choisissez les produits</option>
            {products.map((product) => (
              <option key={product.id} value={product.id} disabled={productsSelected.includes(product.id)}>{product.name}</option>
            ))}
          </select>
        </div>


        <div className="discountPage_add_productsSelect">
          {
            productsSelected.length > 0 && productsSelected.map((product) => (
              <div key={product} className="discountPage_add_productsSelect_product">
                <span>{products.find((p) => p.id === product)?.name}</span>
                <ImCross onClick={() => setProductsSelected(productsSelected.filter((p) => p !== product))}>X</ImCross>
              </div>
            ))
          }
        </div>
        <button type="submit" className="discountPage_add_button" disabled={!(input.code.length > 4 && input.discount.length > 0 && productsSelected.length > 0)}>Ajouter</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Code</th>
            <th>Discount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            discounts.map((discount) => (
              <tr key={discount.id}>
                <td>{discount.id}</td>
                <td>{discount.code}</td>
                <td>{discount.discount}{discount.discount_is_percentage ? "%" : "€"}</td>
                <td><button className="deleteBtn" onClick={() => dispatch(actionDeleteDiscount(discount.id))}><MdDeleteForever size={20} /></button></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default DiscountPage;
