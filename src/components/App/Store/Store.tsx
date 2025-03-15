import './Store.scss'
import Collection from '../Collection/Collection';
import { ProductI } from "../../../@types/product";

function Store({ title, subtitle, amount, list }: { title: string, subtitle: string, type?: string, amount?: number, list: ProductI[] }) {

  return (
    <div className="store">
      <div>
        <span className="store_intro">{subtitle}</span>
        <h3 className="store_title">{title}</h3>
      </div>
      <Collection amount={amount} list={list} />
    </div >
  )
}

export default Store;
