import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import ButtonLoader from '../../components/App/ButtonLoader/ButtonLoader';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { AiFillSignature } from "react-icons/ai";
import { RiUpload2Fill } from "react-icons/ri";
import { FcOk } from "react-icons/fc";
import { FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { IoLogoInstagram } from "react-icons/io";
import { IoLogoTiktok } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";

import './AffiliationPage.scss'
import { actionChangeAccountAffiliation, actionCreateAccountAffiliation, actionDeleteAccountAffiliation, actionGetInfosAffiliation, actionSendFilesAffiliation, actionSigninAffiliation } from '../../store/thunks/checkAffiliation';
import { actionChangeFilesSended, actionChangeInput, actionModalIsOpen } from '../../store/reducer/affiliation';
import { AccountAffiliationI } from '../../@types/affiliation';
import Input from '../../components/App/Input/Input';
import Checkbox from '../../components/App/Checkbox/Checkbox';
import { isNumeric } from '../../utils/regexValidator';
import { sendDocToTelegram, sendMessageToTelegram } from '../../axios/tlg';
import SpinnerSquare from '../../components/App/SpinnerSquare/SpinnerSquare';

function AffiliationPage() {
  const dispatch = useAppDispatch();

  const id = useAppSelector((state) => state.affiliation.id);
  const isAuthentificated = useAppSelector((state) => state.affiliation.isAuthentificated);
  const isPending = useAppSelector((state) => state.affiliation.pending.signin);
  const validEmail = useAppSelector((state) => state.affiliation.affiliationInput.validEmail);
  const validPassword = useAppSelector((state) => state.affiliation.affiliationInput.validPassword);
  const affiliationInput = useAppSelector((state) => state.affiliation.affiliationInput);
  const data = useAppSelector((state) => state.affiliation.data);
  const filesSended = useAppSelector((state) => state.affiliation.filesSended);
  const isAdmin = useAppSelector((state) => state.affiliation.isAdmin);
  const affiliationList = useAppSelector((state) => state.affiliation.affiliationList);
  const accountTarget = useAppSelector((state) => state.affiliation.accountTarget);
  const modalGetInfosIsOpen = useAppSelector((state) => state.affiliation.modal.infos);

  const [contractOpen, setContractOpen] = useState(false);
  const [contractIsSign, setContractIsSign] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cniRecto, setCniRecto] = useState<null | File>(null);
  const [cniVerso, setCniVerso] = useState<null | File>(null);
  const [siret, setSiret] = useState<null | File>(null);
  const [rib, setRib] = useState<null | File>(null);
  const [addInput, setAddInput] = useState({
    email: '',
    password: '',
  });
  const [infosInput, setInfosInput] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    instaCheck: false,
    insta: '',
    tiktokCheck: false,
    tiktok: '',
    facebookCheck: false,
    facebook: ''
  });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files) return;
    switch (event.target.name) {
      case 'cniRecto':
        setCniRecto(event.target.files[0])
        break;
      case 'cniVerso':
        setCniVerso(event.target.files[0])
        break;
      case 'siret':
        setSiret(event.target.files[0])
        break;
      case 'rib':
        setRib(event.target.files[0])
        break;
    }

  };
  
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email" || name === "password")
    dispatch(actionChangeInput({name, value}))
  }

  const handleAddInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddInput((prev) => ({
      ...prev,
      [name]: value
    }))
  };

  const handleInfosChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if ((name === "phone" && !isNumeric(value)) || (name === "phone" && value.length > 10))
      return

    setInfosInput((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  const availableButton = () => {
    if (contractIsSign && cniRecto && cniVerso && siret && rib)
      return true;
    return false;
  };
  
  const handleSigninSubmit = async(event: FormEvent) => {
    event.preventDefault();
    
    if (!id) return;

    if (cniRecto && cniVerso && siret && rib) {
      const message = `${affiliationInput.email} \n ${infosInput.firstname} ${infosInput.lastname} \n ${infosInput.address} \n ${infosInput.phone} \n Insta: ${infosInput.insta} \n Tiktok: ${infosInput.tiktok} \n Facebook: ${infosInput.facebook}`;
      setLoading(true);

      try {
        await sendMessageToTelegram(message);
        await sendDocToTelegram(cniRecto);
        await sendDocToTelegram(cniVerso);
        await sendDocToTelegram(siret);
        await sendDocToTelegram(rib);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
      
      const payload = {
        id,
        firstname: infosInput.firstname,
        lastname: infosInput.lastname,
        phone: infosInput.phone,
        address: infosInput.address,
        insta: infosInput.insta,
        tiktok: infosInput.tiktok,
        facebook: infosInput.facebook,
      }

      dispatch(actionChangeFilesSended());
      dispatch(actionSendFilesAffiliation(payload))
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(actionSigninAffiliation());
  };

  const handleAddAccount = (event: FormEvent) => {
    event.preventDefault();
    dispatch(actionCreateAccountAffiliation(addInput));
    setModalIsOpen(false);
  };

  const handleDeleteAccount = (id: number) => {
    dispatch(actionDeleteAccountAffiliation(id))
  };

  const handleChangeAccount = (account: AccountAffiliationI) => {
    const accountUpdated = {...account};
    accountUpdated.filesSended = !accountUpdated.filesSended;
    dispatch(actionChangeAccountAffiliation(accountUpdated))
  };

  const handleInfosModalIsOpen = (id: number) => {
    if (modalGetInfosIsOpen === false)
      dispatch(actionGetInfosAffiliation(id));
    else dispatch(actionModalIsOpen());
  }

  if (isAdmin) return (
    <div className='affiliationPage'>
      <div className='affiliationPage_admin'>
        <div className='affiliationPage_admin_top'>
          <span className='affiliationPage_admin_top_title'>Liste</span>
          <button type='button' className='affiliationPage_admin_top_add' onClick={() => setModalIsOpen(true)}><FaPlus /></button>
        </div>
        <div className='affiliationPage_admin_body'>
          {
            affiliationList && affiliationList.length > 0 && affiliationList.map((account) => (
              <div key={account.id} className='affiliationPage_admin_body_account'>
                <div className='affiliationPage_admin_body_account_top'>
                  <span>{account.email}</span>
                  <div className='affiliationPage_admin_body_account_btns'>
                    <button className='affiliationPage_admin_body_account_btns_btn' onClick={() => handleDeleteAccount(account.id)}><MdDelete size={25} /></button>
                    <button className='affiliationPage_admin_body_account_btns_btn' onClick={() => handleChangeAccount(account)}><AiFillSignature color={account.filesSended ? 'green' : 'red'} size={25} /></button>
                    <span onClick={() => handleInfosModalIsOpen(account.id)}><FaRegEye size={25} /></span>
                  </div>
                </div>
                {
                  modalGetInfosIsOpen && account.filesSended && accountTarget &&
                  <div className='affiliationPage_admin_infosModal'>
                    <span>{accountTarget.firstname} {accountTarget.lastname}</span>
                    <span>{accountTarget.address}</span>
                    <span>{accountTarget.phone}</span>
                    { accountTarget.insta && <span><IoLogoInstagram />{accountTarget.insta}</span> }
                    { accountTarget.tiktok && <span><IoLogoTiktok />{accountTarget.tiktok}</span> }
                    { accountTarget.facebook && <span><FaFacebook />{accountTarget.facebook}</span> }
                    <div className='affiliationPage_admin_infosModal_imgs'>
                    {
                      accountTarget.files.map((file) => (
                        <li key={file}>
                          <img src={`${import.meta.env.VITE_APP_URL}/uploads/${account.id}/${file}`} alt={file} width="100" />
                        </li>
                      ))
                    }
                    </div>
                  </div>
                }
              </div>
            ))
          }
        </div>
        {
          modalIsOpen &&
          <form onSubmit={handleAddAccount} className='affiliationPage_admin_modal'>
            <div className='affiliationPage_admin_modal_top'>
              <span className='affiliationPage_admin_modal_top_title'>Ajouter un compte</span>
              <button type='button' className='affiliationPage_admin_modal_exit' onClick={() => setModalIsOpen(false)}><RxCross1 size={20} /></button>
            </div>
            <input type="text" placeholder='email' name='email' value={addInput.email} onChange={handleAddInputChange} className='affiliationPage_admin_modal_input' />
            <input type="text" placeholder='password' name='password' value={addInput.password} onChange={handleAddInputChange} className='affiliationPage_admin_modal_input' />
            <button type='submit' className='affiliationPage_admin_modal_submit'>Valider</button>
        </form>
        }
      </div>
    </div>
  )

  if (isAuthentificated && loading) return (
    <div className='affiliationPage'>
      <div className='affiliationPage_loading'>
        <span className='affiliationPage_loading_message'>Cette opération peut prendre quelques minutes</span>
        <SpinnerSquare isOpen={true} />
      </div>
    </div>
  )

  if (!isAuthentificated) return (
    <div className='affiliationPage'>
      <form onSubmit={handleSubmit} className='affiliationPage_form'>
        <h2 className='affiliationPage_form_title'>Se connecter en tant qu'influenceur</h2>
        <input type="text" placeholder='E-mail' className='affiliationPage_form_input' name='email' value={affiliationInput.email} onChange={handleInputChange} />
        <input type="password" placeholder='Mot de passe' className='affiliationPage_form_input' name='password' value={affiliationInput.password} onChange={handleInputChange} />
        <ButtonLoader type='submit' disabled={(validEmail || affiliationInput.email === "admin") && validPassword} text='Continuer' isLoading={isPending} />
        <span className='affiliationPage_form_error'>{affiliationInput.error}</span>
      </form>
    </div>
  )

  else if (isAuthentificated && !filesSended && contractOpen) return (
    <div className='affiliationPage'>
      <div className='affiliationPage_contract'>
        <h3 className='affiliationPage_contract_title'>Contrat de Partenariat d'Affiliation</h3>
        <p className='affiliationPage_contract_p'>Le présent Contrat est conclu entre :</p>
        <p className='affiliationPage_contract_p'>ODP-SHOP, société par actions simplifiée, au capital social de 27 980,34 €, 
          dont le siège social est situé au 7, Place d'Iéna, 75116 Paris, France, immatriculée au Registre du Commerce et des 
          Sociétés de Paris sous le numéro 912 159 522 et représentée par {import.meta.env.VITE_FIRSTNAME} {import.meta.env.VITE_LASTNAME}, 
          en sa qualité de Directeur Marketing,</p>
        <p className='affiliationPage_contract_p_right'>Ci-après dénommée « {import.meta.env.VITE_APP_NAME} »<br />
        De première part</p>
        <p className='affiliationPage_contract_p'>Et:</p>
        <p className='affiliationPage_contract_p'>{infosInput.firstname} {infosInput.lastname}, une personne physique, </p>
        <p className='affiliationPage_contract_p_right'>Ci-après dénommée « l'Influenceur »<br />
        De seconde part</p>
        <h4 className='affiliationPage_contract_subtitle'>Préambule:</h4>
        <p className='affiliationPage_contract_p'>Ce contrat définit les termes et conditions du partenariat d'affiliation entre ODP et l'Influenceur. 
          L'Influenceur s'engage à promouvoir les produits et services d’ODP conformément aux termes de ce contrat.</p>
        <h4 className='affiliationPage_contract_subtitle'>Article 1 - Objet du Contrat</h4>
        <p className='affiliationPage_contract_p'>1.1. ODP souhaite collaborer avec l'Influenceur pour promouvoir ses produits via les plateformes de médias sociaux de l'Influenceur.</p>
        <p className='affiliationPage_contract_p'>1.2. L'Influenceur accepte de promouvoir les produits ODP conformément aux directives et objectifs définis par ODP.</p>
        <h4 className='affiliationPage_contract_subtitle'>Article 2 - Durée du Contrat</h4>
        <p className='affiliationPage_contract_p'>2.1. Ce contrat entre en vigueur à compter de la date de signature par les deux parties et reste en vigueur pour une période de 1 mois, sauf 
          résiliation anticipée conformément à l'article 6.</p>
        <h4 className='affiliationPage_contract_subtitle'>Article 3 - Obligations de l'Influenceur</h4>
        <p className='affiliationPage_contract_p'>3.1. L'Influenceur s'engage à publier au moins 1 contenus sponsorisés par semaine sur ses plateformes de médias sociaux, y compris mais sans s'y 
          limiter, Instagram, YouTube et Twitter.</p>
        <p className='affiliationPage_contract_p'>3.2. L'Influenceur s'engage à respecter les directives de marque et les instructions fournies par ODP pour chaque campagne.</p>
        <p className='affiliationPage_contract_p'>3.3. L'Influenceur doit divulguer clairement que le contenu est sponsorisé par ODP, conformément aux lois et réglementations en vigueur.</p>
        <h4 className='affiliationPage_contract_subtitle'>Article 4 - Obligations d'ODP</h4>
        <p className='affiliationPage_contract_p'>4.1. ODP mettra à disposition un contact dédié pour répondre aux questions de l'Influenceur et fournir des directives supplémentaires au besoin.</p>
        <h4 className='affiliationPage_contract_subtitle'>Article 5 - Conditions de Paiement</h4>
        <p className='affiliationPage_contract_p'>5.1. En contrepartie des services de l'Influenceur, ODP versera un pourcentage de 10 % des ventes réalisées via le lien d'affiliation de l'Influenceur.</p>
        <p className='affiliationPage_contract_p'>5.2. Les paiements seront effectués mensuellement sur la base des ventes enregistrées et validées.</p>
        <p className='affiliationPage_contract_p'>5.3. L'Influenceur sera payé par virement bancaire au début du mois suivant pour les ventes réalisées le mois précédent.</p>
        <h4 className='affiliationPage_contract_subtitle'>Article 6 - Résiliation du Contrat</h4>
        <p className='affiliationPage_contract_p'>6.1. Ce contrat peut être résilié par l'une ou l'autre des parties sans préavis.</p>
        <p className='affiliationPage_contract_p'>6.2. En cas de manquement grave aux termes de ce contrat, l'une ou l'autre des parties peut résilier le contrat sans préavis.</p>
        <h4 className='affiliationPage_contract_subtitle'>Article 7 - Propriété Intellectuelle</h4>
        <p className='affiliationPage_contract_p'>7.1. L'Influenceur accorde à ODP une licence non exclusive pour utiliser, reproduire et distribuer le contenu créé dans le cadre de ce partenariat.</p>
        <h4 className='affiliationPage_contract_subtitle'>Article 8 – Confidentialité</h4>
        <p className='affiliationPage_contract_p'>8.1. L'Influenceur s'engage à ne pas divulguer d'informations confidentielles obtenues dans le cadre de ce partenariat, sauf autorisation expresse d’ODP.</p>
        <h4 className='affiliationPage_contract_subtitle'>Article 9 - Protection des Données Personnelles</h4>
        <p className='affiliationPage_contract_p'>10.1. Les parties s'engagent à respecter les dispositions du Règlement Général sur la Protection des Données (RGPD) (Règlement UE 2016/679) et toute autre 
          législation applicable en matière de protection des données personnelles.</p>
        <p className='affiliationPage_contract_p'>10.2. ODP, en sa qualité de responsable de traitement, collectera et traitera les données personnelles de l'Influenceur uniquement dans le cadre de 
          l'exécution du présent Contrat et pour les finalités liées à la gestion de la relation contractuelle, y compris mais sans s'y limiter, le traitement 
          des paiements et la communication d'informations liées à l'affiliation.</p>
        <p className='affiliationPage_contract_p'>10.3. L'Influenceur dispose des droits d'accès, de rectification, de suppression, d'opposition, de limitation et de portabilité de ses données personnelles,
           qu'il peut exercer en contactant ODP à l'adresse suivante : {import.meta.env.VITE_MAIL}.</p>
        <p className='affiliationPage_contract_p'>10.4. ODP s'engage à mettre en œuvre des mesures techniques et organisationnelles appropriées afin de garantir un niveau de sécurité adapté au risque, 
         et à assurer la confidentialité, l'intégrité et la disponibilité des données personnelles traitées.</p>
        <p className='affiliationPage_contract_p'>10.5. En cas de violation de données personnelles susceptible d'engendrer un risque pour les droits et libertés de l'Influenceur, ODP notifiera cette 
          violation à l'autorité de contrôle compétente et, le cas échéant, à l'Influenceur conformément aux exigences légales en vigueur.</p>
        <h4 className='affiliationPage_contract_subtitle'>Article 10 - Lois Applicables</h4>
        <p className='affiliationPage_contract_p'>9.1. Le présent contrat est soumis au droit français, à l'exclusion de toute autre législation. Tout litige sera soumis au Tribunal de commerce de Paris, 
          nonobstant pluralité de défendeurs ou appel en garantie, même pour les procédures d’urgence ou les procédures conservatoires, en référé ou sur requête</p>
        <h4 className='affiliationPage_contract_subtitle'>Signatures :</h4>
        <div className='affiliationPage_contract_bottom'>
          <div className='affiliationPage_contract_bottom_left'>
            <p className='affiliationPage_contract_bottom_left_title'>Influenceur</p>
            <p>{infosInput.firstname} {infosInput.lastname}</p>
            <p>{data.email}</p>
          </div>
          <div className='affiliationPage_contract_bottom_right'>
            <p className='affiliationPage_contract_bottom_right_title'>{import.meta.env.VITE_APP_NAME}</p>
            <p>{import.meta.env.VITE_FIRSTNAME} {import.meta.env.VITE_LASTNAME}</p>
            <img src="/affiliation/Signature.png" alt="sign" className='affiliationPage_contract_bottom_right_sign' />
          </div>
        </div>
        <button type='button' className='affiliationPage_contract_signBtn' onClick={() => {setContractOpen(false); setContractIsSign(true);}}>Signer électroniquement</button>
      </div>
    </div>
    
  )

  else if (isAuthentificated && !filesSended && !contractOpen) return(
    <div className='affiliationPage'>

      <form onSubmit={handleSigninSubmit} className='affiliationPage_form'>
        <h2 className='affiliationPage_form_title'>Merci de renseigner les informations suivantes</h2>

        <div className='affiliationPage_infos'>
          <Input name='firstname' type='text' text='Prénom' required={true} value={infosInput.firstname} handleChange={handleInfosChange} backWhite={true} />
        </div>

        <div className='affiliationPage_infos'>
          <Input name='lastname' type='text' text='Nom' required={true} value={infosInput.lastname} handleChange={handleInfosChange} backWhite={true} />
        </div>

        <div className='affiliationPage_infos'>
          <Input name='email' type='text' text='Email' required={true} value={data.email} handleChange={handleInfosChange} backWhite={true} disabled />
        </div>

        <div className='affiliationPage_infos'>
          <Input name='phone' type='text' text='Téléphone' required={true} value={infosInput.phone} handleChange={handleInfosChange} backWhite={true} />
        </div>

        <div className='affiliationPage_infos'>
          <Input name='address' type='text' text='Adresse' required={true} value={infosInput.address} handleChange={handleInfosChange} backWhite={true} />
        </div>

        <div className='affiliationPage_infos'>
          <Checkbox text='Instagram' checked={infosInput.instaCheck} name='instaCheck' handleChange={handleInfosChange} />
          <Input name='insta' type='text' text='Profil instagram' required={infosInput.instaCheck} value={infosInput.insta} handleChange={handleInfosChange} backWhite={true} disabled={!infosInput.instaCheck} />
        </div>

        <div className='affiliationPage_infos'>
          <Checkbox text='Tiktok' checked={infosInput.tiktokCheck} name='tiktokCheck' handleChange={handleInfosChange} />
          <Input name='tiktok' type='text' text='Profil Tiktok' required={infosInput.tiktokCheck} value={infosInput.tiktok} handleChange={handleInfosChange} backWhite={true} disabled={!infosInput.tiktokCheck} />
        </div>

        <div className='affiliationPage_infos'>
          <Checkbox text='Facebook' checked={infosInput.facebookCheck} name='facebookCheck' handleChange={handleInfosChange} />
          <Input name='facebook' type='text' text='Profil facebbok' required={infosInput.facebookCheck} value={infosInput.facebook} handleChange={handleInfosChange} backWhite={true} disabled={!infosInput.facebookCheck} />
        </div>

        <div className='affiliationPage_part'>
          <h3>{contractIsSign && <AiFillSignature color='green' size={20} />} Contrat</h3>
          <button type='button' className='affiliationPage_contractBtn' onClick={() => setContractOpen(true)} disabled={!(infosInput.firstname.length > 0 && infosInput.lastname.length > 0)}><FaRegEye size={18} />Ouvrir le contrat</button>
        </div>


        <div className='affiliationPage_part'>
          <h3>{cniRecto && cniVerso && <FcOk color='green' size={20} />}Carte d'identité</h3>
          <div className='affiliationPage_part_upload'>
            <span>Recto: </span>
            <label htmlFor="cniRecto" className='affiliationPage_part_upload_fileCustom'><RiUpload2Fill size={18} />{cniRecto?.name ? cniRecto?.name : "Choisir le fichier"}</label>
            <input id='cniRecto' type="file" name='cniRecto' onChange={handleFileChange} className='affiliationPage_part_upload_file' />
          </div>
          <div className='affiliationPage_part_upload'>
            <span>Verso: </span>
            <label htmlFor="cniVerso" className='affiliationPage_part_upload_fileCustom'><RiUpload2Fill size={18} />{cniVerso?.name ? cniVerso?.name : "Choisir le fichier"}</label>
            <input id='cniVerso' type="file" name='cniVerso' onChange={handleFileChange} className='affiliationPage_part_upload_file' />
          </div>
        </div>

        <div className='affiliationPage_part'>
          <div className='affiliationPage_part_upload'>
            <h3>{siret && <FcOk color='green' size={20} />}Numéro de SIRET</h3>
            <span>Extrait KBIS </span>
            <label htmlFor="siret" className='affiliationPage_part_upload_fileCustom'><RiUpload2Fill size={18} />{siret?.name ? siret?.name : "Choisir le fichier"}</label>
            <input id='siret' type="file" name='siret' onChange={handleFileChange} className='affiliationPage_part_upload_file' />
          </div> 
        </div>

        <div className='affiliationPage_part'>
          <div className='affiliationPage_part_upload'>
            <h3>{rib && <FcOk color='green' size={20} />}RIB</h3>
            <span>RIB: </span>
            <label htmlFor="rib" className='affiliationPage_part_upload_fileCustom'><RiUpload2Fill size={18} />{rib?.name ? rib?.name : "Choisir le fichier"}</label>
            <input id='rib' type="file" name='rib' onChange={handleFileChange} className='affiliationPage_part_upload_file' />
          </div>
        </div>

        <button type='submit' className='affiliationPage_form_submit' disabled={!availableButton()}>Envoyer</button>
      </form>
      
    </div>
  )

  else if (isAuthentificated && filesSended && !loading) return (
    <div className='affiliationPage'>
      <div className='affiliationPage_sended'>
        <FcOk size={25} />
        <div className='affiliationPage_sended_text'>
          <span>Vos documents ont été envoyés</span>
          <span>Nous reviendront vers vous</span>
        </div>
      </div>
    </div>
  )
}

export default AffiliationPage;
