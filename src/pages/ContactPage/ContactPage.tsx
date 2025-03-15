import { ChangeEvent, useState } from "react";
import Input from "../../components/App/Input/Input";
import './ContactPage.scss'

function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  return (
    <div className='contactPage'>
      <div className="contactPage_title">
        <span className="contactPage_title_question">Comment pouvons-nous vous aider ?</span>
        <h1 className="contactPage_title_text">Restons connectés</h1>
        <span className="contactPage_title_description">N'hésitez pas à nous contacter !</span>
      </div>
      <form className="contactPage_form">
        <div className="contactPage_form_top">
          <Input name="name" type="text" text="Nom" backWhite={true} required={true} handleChange={handleInputChange} value={form.name} />
          <Input name="email" type="email" text="Email" backWhite={true} required={true} handleChange={handleInputChange} value={form.email} />
        </div>
        <Input type="textarea" name="message" text="Message" backWhite={true} required={true} handleChange={handleInputChange} value={form.message} rows={4} />
        <button type="submit" className="contactPage_form_button">Envoyer</button>
      </form>
    </div>
  )

}

export default ContactPage;
