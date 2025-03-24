import './Footer.scss'
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa6";
import { TbMailCheck } from "react-icons/tb";
import Input from '../App/Input/Input';
import { ChangeEvent, useState } from "react";
import { escapeHtml } from "../../utils/escapeHtml";
import { Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const [email, setEmail] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmail(escapeHtml(e.target.value));
  }

  const newsletterNeeded = () => {
    return location.pathname !== '/cart' && location.pathname !== '/faq' && location.pathname !== '/contact';
  }

  return (
    <div className="footer">
      {newsletterNeeded() &&

        <div className="footer_newsletter">
          <span className="footer_newsletter_title">Restez connecté avec les meilleures offres !</span>
          <span className="footer_newsletter_content">Inscrivez-vous à notre newsletter et soyez le premier à
            découvrir nos promotions exclusives sur les derniers téléphones.</span>
          <div className="footer_newsletter_form">
            <Input name="newsletter" type="email" text="Adresse mail" value={email} handleChange={handleChange} />
            <button className="footer_newsletter_form_button"><TbMailCheck size={22} />S'inscrire</button>
          </div>
        </div>
      }

      <div className={newsletterNeeded() ? "footer_links" : "footer_links footer_links-cart"}>
        <div className="footer_links_information">
          <span className="footer_links_information_title">Informations utiles</span>
          <div className="footer_links_information_content">
            <Link to="/contact" className="footer_links_information_content_item">FAQ</Link>
            <span className="footer_links_information_content_item">Mentions légales</span>
            <span className="footer_links_information_content_item">Politique d'expédition</span>
            <span className="footer_links_information_content_item">Politique de remboursement</span>
            <span className="footer_links_information_content_item">Conditions de vente</span>
          </div>
        </div>
        <div className="footer_links_contact">
          <span className="footer_links_contact_title">Nous contacter</span>
          <div className="footer_links_contact_content">
            <span className="footer_links_contact_content_item">WhatsApp: +33 {import.meta.env.VITE_PHONE}</span>
            <span className="footer_links_contact_content_item">Email: {import.meta.env.VITE_EMAIL}</span>
          </div>
        </div>
        <div className="footer_links_paiement">
          <FaCcVisa size={30} />
          <FaCcMastercard size={30} />
          <FaCcAmex size={30} />
        </div>
        <div className="footer_links_credit">
          &copy; 2024 {import.meta.env.VITE_APP_NAME}.
        </div>
      </div>
    </div >
  )
}

export default Footer;
