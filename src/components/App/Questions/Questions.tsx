import './Questions.scss';
import React from 'react';
import Question from '../Question/Question';
import questions from '../../../data/questions';

const Questions: React.FC = () => {

  return (
    <div className="questions">
      <span className="questions_intro">Vous hésitez toujours ?</span>
      <h3 className="questions_title">Vos questions fréquentes chez ODP</h3>
      <span className="questions_description">
        Si vous avez d'autres questions après avoir consulté les réponses ci-dessous, n'hésitez pas à nous contacter via WhatsApp, disponible en bas de la page.
      </span>
      <div className="questions_list">
        {questions.map((q, index) => (
          <Question key={index} title={q.title} content={q.content} />
        ))}
      </div>
      <div className="customer_service">
        <span className="customer_service_hourly">Notre service client est disponible du lundi au dimanche, de 8h à 19h.</span>
        <span className="customer_service_delay">Temps moyen de réponse : 24 heures</span>
        <button className="customer_service_button">Découvrez nos produits</button>
      </div >
    </div>
  );
};

export default Questions;
