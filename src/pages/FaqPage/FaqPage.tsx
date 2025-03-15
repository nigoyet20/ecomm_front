import { Link } from "react-router-dom";
import './FaqPage.scss'

function FaqPage() {

  return (
    <div className='faqPage'>
      <span className="faqPage_question">Vous avez des questions ?</span>
      <h1 className="faqPage_text">FAQ</h1>
      <span className="faqPage_description">Notre service client est disponible du lundi au dimanche, de 8h à 20h30</span>
      <Link to="/" className="faqPage_button">Découvrez nos produits</Link>
    </div>
  )

}

export default FaqPage;
