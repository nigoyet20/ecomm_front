import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { actionChangeConnection, actionChangeCredentials, actionSetRecoveryToken } from '../../store/reducer/account';
import { actionCheckConnexion, actionCheckPasswordRecovery, actionCheckPasswordRecoverySend, actionCheckSignin, actionCheckSignup } from '../../store/thunks/checkLogin';
import { TbArrowBackUpDouble, TbPoint } from "react-icons/tb";
import { BsCapslockFill } from "react-icons/bs";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";



import './LoginPage.scss'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RefObject, useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import ButtonLoader from "../../components/App/ButtonLoader/ButtonLoader";
import axios from "axios";
import { validePassword } from "../../utils/regexValidator";
import { changeCredentialsPayload } from "../../@types/payload";
import { usePopupMessage } from "../../utils/usePopup";

function LoginPage() {
  const dispatch = useAppDispatch();

  const pending = useAppSelector((state) => state.account.pending);
  const connection = useAppSelector((state) => state.account.connection);
  const credentials = useAppSelector((state) => state.account.credentials);

  const connectionFocusRef = useRef<HTMLInputElement>(null);
  const loginFocusRef = useRef<HTMLInputElement>(null);
  const signupFocusRef = useRef<HTMLInputElement>(null);
  const signupPasswordRef = useRef<HTMLInputElement>(null);
  const signupPasswordConfirmRef = useRef<HTMLInputElement>(null);
  const passwordRecoveryFocusRef = useRef<HTMLInputElement>(null);
  const passwordRecoveryNewFocusRef = useRef<HTMLInputElement>(null);
  const passwordRecoveryConfirmNewFocusRef = useRef<HTMLInputElement>(null);

  const checkingRef = useRef<HTMLInputElement>(null);
  const loginRef = useRef<HTMLInputElement>(null);
  const signupRef = useRef<HTMLInputElement>(null);
  const passwordRecoveryRef = useRef<HTMLInputElement>(null);
  const passwordRecoveryNewRef = useRef<HTMLInputElement>(null);

  const [searchParams] = useSearchParams();

  const [emailSended, setEmailSended] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    caractMini8: false,
    minuscule: false,
    majuscule: false,
    chiffre: false,
    special: false,
  });
  const [passwordConfirmValidation, setPasswordConfirmValidation] = useState(false);
  const [passwordSignupFocus, setPasswordSignupFocus] = useState({
    password: false,
    passwordConfirm: false,
  });
  const [newPasswordConfirmValidation, setNewPasswordConfirmValidation] = useState(false);
  const [passwordRecoveryFocus, setpasswordRecoveryFocus] = useState({
    newPassword: false,
    newPasswordConfirm: false,
  });
  const [isCapsLockOn, setIsCapsLockOn] = useState({
    passwordSignin: false,
    password: false,
    passwordConfirm: false,
    newPassword: false,
    newPasswordConfirm: false,
  });
  const [passwordVisible, setPasswordVisible] = useState({
    passwordSignin: false,
    password: false,
    passwordConfirm: false,
    newPassword: false,
    newPasswordConfirm: false,
  });

  const navigate = useNavigate();
  const { setPopupMessage } = usePopupMessage();

  useEffect(() => {
    if (connection === 'checking' && connectionFocusRef.current)
      connectionFocusRef.current.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const token = searchParams.get('token');
    const passwordRecoveryToken = searchParams.get('pw-recovery');

    if (token) {
      axios
        .post(`${import.meta.env.VITE_APP_API_URL}/confirmation/${token}`)
        .then((res) => {
          navigate(res.data.redirectUrl);
        })
        .catch((err) => {
          console.log(err);
          navigate('/login?confirmed=false');
        });
    }

    if (passwordRecoveryToken) {
      dispatch(actionSetRecoveryToken(passwordRecoveryToken));
      dispatch(actionChangeConnection('passwordRecoveryNew'));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as changeCredentialsPayload;
    if (name === "password") {
      const passwordValidation = validePassword(value);
      setPasswordValidation(passwordValidation);
      if (value === credentials.passwordConfirm)
        setPasswordConfirmValidation(true);
      else
        setPasswordConfirmValidation(false);
    } else if (name === "passwordConfirm") {
      if (value === credentials.password)
        setPasswordConfirmValidation(true);
      else
        setPasswordConfirmValidation(false);
    } else if (name === "newPassword") {
      const passwordValidation = validePassword(value);
      setPasswordValidation(passwordValidation);
      if (value === credentials.newPasswordConfirm)
        setNewPasswordConfirmValidation(true);
      else
        setNewPasswordConfirmValidation(false);
    } else if (name === "newPasswordConfirm") {
      if (value === credentials.newPassword)
        setNewPasswordConfirmValidation(true);
      else
        setNewPasswordConfirmValidation(false);
    }
    dispatch(actionChangeCredentials({ name, value }));
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    if (event.target instanceof HTMLInputElement) {
      const { name } = event.target;
      if (name in isCapsLockOn)
        window.addEventListener("keydown", (e) => detectCapsLock(e, name), { once: true });

      if (name === "password" || name === "passwordConfirm") {
        setPasswordSignupFocus(prev => ({
          ...prev,
          password: name === 'password' ? true : false,
          passwordConfirm: name === 'passwordConfirm' ? true : false
        }))
      } else if (name === "newPassword" || name === "newPasswordConfirm")
        setpasswordRecoveryFocus(prev => ({
          ...prev,
          newPassword: name === 'newPassword' ? true : false,
          newPasswordConfirm: name === 'newPasswordConfirm' ? true : false
        }))
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { name } = event.target as HTMLInputElement;

    if (name in isCapsLockOn) {
      setIsCapsLockOn(prev => ({
        ...prev,
        [name]: event.getModifierState("CapsLock"),
      }));
    }
  };

  const detectCapsLock = (event: KeyboardEvent, inputName: string) => {
    setIsCapsLockOn(prev => ({
      ...prev,
      [inputName]: event.getModifierState("CapsLock"),
    }));
  }

  // const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
  //   const { name } = event.target;
  //   if (name === "password" || name === "passwordConfirm")
  //     setPasswordSignupFocus(prev => ({
  //       ...prev,
  //       password: name === 'password' ? false : prev.password,
  //       passwordConfirm: name === 'passwordConfirm' ? false : prev.passwordConfirm
  //     }))
  //   else if (name === "newPassword" || name === "newPasswordConfirm")
  //     setpasswordRecoveryFocus(prev => ({
  //       ...prev,
  //       newPassword: name === 'newPassword' ? false : prev.newPassword,
  //       newPasswordConfirm: name === 'newPasswordConfirm' ? false : prev.newPasswordConfirm
  //     }))
  // }

  const handleVisible = (inputName: keyof typeof passwordVisible) => {
    setPasswordVisible(prev => ({
      ...prev,
      [inputName]: !prev[inputName]
    }));
  }

  const changeConnection = () => {
    dispatch(actionChangeConnection('checking'));
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(actionCheckConnexion());
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.password === credentials.passwordConfirm) {
      const result = await dispatch(actionCheckSignup());
      if (actionCheckSignup.fulfilled.match(result)) {
        setPopupMessage("Merci de confirmer votre adresse mail avec le mail envoyé");
      }
    }
  }

  const handlePasswordRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSended(true);
    const result = await dispatch(actionCheckPasswordRecovery());
    if (actionCheckPasswordRecovery.fulfilled.match(result)) {
      setPopupMessage("Un mail de réinitialisation de mot de passe vous a été envoyé");
    }
  }

  const handlePasswordRecoveryNewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(actionCheckPasswordRecoverySend());
    if (actionCheckPasswordRecoverySend.fulfilled.match(result)) {
      setPopupMessage("Votre mot de passe a bien été modifié");
    } else {
      setPopupMessage("Erreur lors du changement de mot de passe");
    }
  }

  const handlePasswordRecovery = () => {
    dispatch(actionChangeConnection('passwordRecovery'));
  }

  const handleSiginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ls = JSON.parse(localStorage.getItem('cartVisitor') || '[]');
    let resultSignin;
    if (ls && ls.length > 0)
      resultSignin = await dispatch(actionCheckSignin(ls));
    else
      resultSignin = await dispatch(actionCheckSignin(null));

    if (actionCheckSignin.fulfilled.match(resultSignin)) {
      navigate('/profile');
    }
  }

  const handleTransitionEntered = (arg: RefObject<HTMLInputElement>) => {
    arg.current?.focus();
  }

  return (
    <div className="container">
      <CSSTransition in={connection === "checking"} nodeRef={checkingRef} classNames="checking_transi" timeout={300} onEntered={() => handleTransitionEntered(connectionFocusRef)} unmountOnExit appear>
        <div ref={checkingRef} className="checking container_part">
          <form onSubmit={handleEmailSubmit} className="checking_form">
            <span className="checking_form_title">Se connecter</span>
            <label htmlFor="mail" className="checking_form_mailLabel">Saisissez votre adresse e-mail.</label>
            <input type="mail" placeholder='E-mail' name='email' autoComplete="email" ref={connectionFocusRef} value={credentials.email} onChange={handleChange} className="checking_form_mailInput" />
            <ButtonLoader type='submit' disabled={credentials.formConnection} text='Continuer' isLoading={pending.checking} />
          </form>
          <div className="checking_bottom">
            <span className="checking_bottom_conf">Confidentialité</span>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition in={connection === "login"} nodeRef={loginRef} classNames="login_transi" timeout={300} onEntered={() => handleTransitionEntered(loginFocusRef)} unmountOnExit appear>
        <div ref={loginRef} className="checking container_part">
          <form onSubmit={handleSiginSubmit} className="checking_form">
            <span className="checking_form_title">Se connecter</span>
            <label htmlFor="password" className="checking_form_mailLabel">Indiquer votre mot de passe.</label>
            <div className="checking_form_passwordSignin_input">
              <input type={passwordVisible.passwordSignin ? "text" : "password"} placeholder='Mot de passe' name='passwordSignin' autoComplete="current-password" ref={loginFocusRef} value={credentials.passwordSignin} onChange={handleChange} onKeyDown={handleKeyDown} className="checking_form_passwordSignin_input_value" />
              <div className="checking_form_passwordSignin_input_infos">
                {
                  isCapsLockOn.passwordSignin && <div className="checking_form_passwordSignin_input_infos_btn"><BsCapslockFill size={18} /></div>
                }
                {
                  passwordVisible.passwordSignin ? <button type="button" className="checking_form_passwordSignin_input_infos_btn" onClick={() => handleVisible('passwordSignin')}><FaRegEyeSlash size={20} /></button> : <button type="button" className="checking_form_passwordSignin_input_infos_btn" onClick={() => handleVisible('passwordSignin')}><FaRegEye size={20} /></button>
                }
              </div>
            </div>
            <ButtonLoader type='submit' disabled={credentials.formConnection} text='Continuer' isLoading={pending.login} />
          </form>
          <div className="checking_form_errors">
            <span className="checking_form_errors_error">{credentials.errorSigin}</span>
          </div>
          <div className="checking_form_passwordLost">
            <button type="button" className="checking_form_passwordLost_text" onClick={handlePasswordRecovery}>Mot de passe oublié ?</button>
          </div>
          <div className={connection === 'checking' ? "checking_bottom checking_bottom-signup" : "checking_bottom"}>
            <span className="checking_bottom_conf">Confidentialité</span>
            <TbArrowBackUpDouble size={35} onClick={changeConnection} className="checking_bottom_back" />
          </div>
        </div>
      </CSSTransition>

      <CSSTransition in={connection === "signup"} nodeRef={signupRef} classNames="signup_transi" timeout={300} onEntered={() => handleTransitionEntered(signupFocusRef)} unmountOnExit appear>
        <div ref={signupRef} className="checking container_part">
          <form onSubmit={handleSignupSubmit} className="checking_form">
            <span className="checking_form_title">S'inscrire</span>
            <fieldset className="checking_form_password">
              <label htmlFor="password" className="checking_form_password_label">Choisissez votre mot de passe.</label>
              <div className="checking_form_password_input">
                <input type={passwordVisible.password ? "text" : "password"} placeholder='Mot de passe' name='password' autoComplete="new-password" ref={signupFocusRef} value={credentials.password} onChange={handleChange} onFocus={handleFocus} onKeyDown={handleKeyDown} className="checking_form_password_input_value" />
                <div className="checking_form_password_input_infos">
                  {
                    isCapsLockOn.password && <div className="checking_form_password_input_infos_btn"><BsCapslockFill size={18} /></div>
                  }
                  {
                    passwordVisible.password ? <button type="button" className="checking_form_password_input_infos_btn" onClick={() => handleVisible('password')}><FaRegEyeSlash size={20} /></button> : <button type="button" className="checking_form_password_input_infos_btn" onClick={() => handleVisible('password')}><FaRegEye size={20} /></button>
                  }
                </div>
              </div>
              <CSSTransition in={passwordSignupFocus.password} nodeRef={signupPasswordRef} classNames="extend-400t" timeout={500} unmountOnExit appear>
                <div ref={signupPasswordRef} className="checking_form_errors checking_form_errors-signup">
                  <span className={Object.values(passwordValidation).every(value => value === true) ? "checking_form_errors_error-signup checking_form_errors_error-signup-ok" : "checking_form_errors_error-signup"}>Le mot de passe doit contenir au minimum</span>
                  <span className={passwordValidation.caractMini8 ? "checking_form_errors_error-signup checking_form_errors_error-signup-ok" : "checking_form_errors_error-signup"}><TbPoint size={15} />8 caractères</span>
                  <span className={passwordValidation.minuscule ? "checking_form_errors_error-signup checking_form_errors_error-signup-ok" : "checking_form_errors_error-signup"}><TbPoint size={15} />1 minuscule</span>
                  <span className={passwordValidation.majuscule ? "checking_form_errors_error-signup checking_form_errors_error-signup-ok" : "checking_form_errors_error-signup"}><TbPoint size={15} />1 majuscule</span>
                  <span className={passwordValidation.chiffre ? "checking_form_errors_error-signup checking_form_errors_error-signup-ok" : "checking_form_errors_error-signup"}><TbPoint size={15} />1 chiffre</span>
                  <span className={passwordValidation.special ? "checking_form_errors_error-signup checking_form_errors_error-signup-ok" : "checking_form_errors_error-signup"}><TbPoint size={15} />1 caractère spécial</span>
                </div>
              </CSSTransition>
            </fieldset>


            <fieldset className="checking_form_passwordConfirm">
              <label htmlFor="password" className="checking_form_passwordConfirm_label">Confirmer votre mot de passe.</label>
              <div className="checking_form_password_input">
                <input type={passwordVisible.passwordConfirm ? "text" : "password"} placeholder='Mot de passe' name='passwordConfirm' value={credentials.passwordConfirm} onChange={handleChange} onFocus={handleFocus} onKeyDown={handleKeyDown} className="checking_form_passwordConfirm_input_value" />
                <div className="checking_form_password_input_infos">
                  {
                    isCapsLockOn.passwordConfirm && <div className="checking_form_password_input_infos_btn"><BsCapslockFill size={18} /></div>
                  }
                  {
                    passwordVisible.passwordConfirm ? <button type="button" className="checking_form_password_input_infos_btn" onClick={() => handleVisible('passwordConfirm')}><FaRegEyeSlash size={20} /></button> : <button type="button" className="checking_form_password_input_infos_btn" onClick={() => handleVisible('passwordConfirm')}><FaRegEye size={20} /></button>
                  }
                </div>
              </div>
              <CSSTransition in={passwordSignupFocus.passwordConfirm} nodeRef={signupPasswordConfirmRef} classNames="extend-400t" timeout={500} unmountOnExit appear>
                <div ref={signupPasswordConfirmRef}>
                  <span className={passwordConfirmValidation ? "checking_form_passwordConfirm_error checking_form_passwordConfirm_error-ok" : "checking_form_passwordConfirm_error"}><TbPoint size={15} />Les mots de passe doivent être identiques</span>
                </div>
              </CSSTransition>
            </fieldset>

            <ButtonLoader type='submit' disabled={(credentials.formSignup1 && credentials.formSignup2)} text='Continuer' isLoading={pending.signup} />
          </form>
          <div className={connection === 'checking' ? "checking_bottom checking_bottom-checking" : "checking_bottom"}>
            <span className="connection_bottom_conf">Confidentialité</span>
            <TbArrowBackUpDouble size={35} onClick={changeConnection} className="checking_bottom_back" />
          </div>
        </div>
      </CSSTransition>


      <CSSTransition in={connection === "passwordRecovery"} nodeRef={passwordRecoveryRef} classNames="checking_transi" timeout={300} onEntered={() => handleTransitionEntered(passwordRecoveryFocusRef)} unmountOnExit appear>
        <div ref={passwordRecoveryRef} className="checking container_part">
          <form onSubmit={handlePasswordRecoverySubmit} className="checking_form">
            <span className="checking_form_title">Réinitialiser votre mot de passe</span>
            <label htmlFor="mail" className="checking_form_mailLabel">Saisissez votre adresse e-mail.</label>
            <input type="mail" placeholder='E-mail' name='emailRecovery' ref={passwordRecoveryFocusRef} value={credentials.emailRecovery} onChange={handleChange} className="checking_form_mailInput" />
            <ButtonLoader type='submit' disabled={credentials.formPasswordRecovery || emailSended} text='Continuer' isLoading={pending.passwordRecoveryMailSnded} />
          </form>
          <div className="checking_bottom">
            <span className="checking_bottom_conf">Confidentialité</span>
            <TbArrowBackUpDouble size={35} onClick={changeConnection} className="checking_bottom_back" />
          </div>
        </div>
      </CSSTransition>


      <CSSTransition in={connection === "passwordRecoveryNew"} nodeRef={passwordRecoveryNewRef} classNames="checking_transi" timeout={300} onEntered={() => handleTransitionEntered(passwordRecoveryNewFocusRef)} unmountOnExit appear>
        <div ref={passwordRecoveryNewRef} className="checking container_part">
          <form onSubmit={handlePasswordRecoveryNewSubmit} className="checking_form">
            <span className="checking_form_title">Réinitialiser votre mot de passe</span>
            <fieldset className="checking_form_password">
              <label htmlFor="password" className="checking_form_password_label">Choisissez votre mot de passe.</label>
              <div className="checking_form_password_input">
                <input type={passwordVisible.newPassword ? "text" : "password"} placeholder='Mot de passe' name='newPassword' ref={signupFocusRef} value={credentials.newPassword} onChange={handleChange} onFocus={handleFocus} onKeyDown={handleKeyDown} className="checking_form_password_input_value" />
                <div className="checking_form_password_input_infos">
                  {
                    isCapsLockOn.newPassword && <div className="checking_form_password_input_infos_btn"><BsCapslockFill size={18} /></div>
                  }
                  {
                    passwordVisible.newPassword ? <button type="button" className="checking_form_password_input_infos_btn" onClick={() => handleVisible('newPassword')}><FaRegEyeSlash size={20} /></button> : <button type="button" className="checking_form_password_input_infos_btn" onClick={() => handleVisible('newPassword')}><FaRegEye size={20} /></button>
                  }
                </div>
              </div>
              <CSSTransition in={passwordRecoveryFocus.newPassword} nodeRef={passwordRecoveryNewFocusRef} classNames="extend-400t" timeout={500} unmountOnExit appear>
                <div ref={passwordRecoveryNewFocusRef} className="checking_form_errors checking_form_errors-signup">
                  <span className={Object.values(passwordValidation).every(value => value === true) ? "checking_form_errors_error-signup checking_form_errors_error-signup-ok" : "checking_form_errors_error-signup"}>Le mot de passe doit contenir au minimum</span>
                  <span className={passwordValidation.caractMini8 ? "checking_form_errors_error-signup checking_form_errors_error-signup-ok" : "checking_form_errors_error-signup"}><TbPoint size={15} />8 caractères</span>
                  <span className={passwordValidation.minuscule ? "checking_form_errors_error-signup checking_form_errors_error-signup-ok" : "checking_form_errors_error-signup"}><TbPoint size={15} />1 minuscule</span>
                  <span className={passwordValidation.majuscule ? "checking_form_errors_error-signup checking_form_errors_error-signup-ok" : "checking_form_errors_error-signup"}><TbPoint size={15} />1 majuscule</span>
                  <span className={passwordValidation.chiffre ? "checking_form_errors_error-signup checking_form_errors_error-signup-ok" : "checking_form_errors_error-signup"}><TbPoint size={15} />1 chiffre</span>
                  <span className={passwordValidation.special ? "checking_form_errors_error-signup checking_form_errors_error-signup-ok" : "checking_form_errors_error-signup"}><TbPoint size={15} />1 caractère spécial</span>
                </div>
              </CSSTransition>
            </fieldset>


            <fieldset className="checking_form_passwordConfirm">
              <label htmlFor="password" className="checking_form_passwordConfirm_label">Confirmer votre mot de passe.</label>
              <div className="checking_form_passwordConfirm_input">
                <input type={passwordVisible.newPasswordConfirm ? "text" : "password"} placeholder='Mot de passe' name='newPasswordConfirm' value={credentials.newPasswordConfirm} onChange={handleChange} onFocus={handleFocus} onKeyDown={handleKeyDown} className="checking_form_passwordConfirm_input_value" />
                <div className="checking_form_passwordConfirm_input_infos">
                  {
                    isCapsLockOn.newPasswordConfirm && <div className="checking_form_passwordConfirm_input_infos_btn"><BsCapslockFill size={18} /></div>
                  }
                  {
                    passwordVisible.newPasswordConfirm ? <button type="button" className="checking_form_passwordConfirm_input_infos_btn" onClick={() => handleVisible('newPasswordConfirm')}><FaRegEyeSlash size={20} /></button> : <button type="button" className="checking_form_passwordConfirm_input_infos_btn" onClick={() => handleVisible('newPasswordConfirm')}><FaRegEye size={20} /></button>
                  }
                </div>
              </div>
              <CSSTransition in={passwordRecoveryFocus.newPasswordConfirm} nodeRef={passwordRecoveryConfirmNewFocusRef} classNames="extend-400t" timeout={500} unmountOnExit appear>
                <div ref={passwordRecoveryConfirmNewFocusRef}>
                  <span className={newPasswordConfirmValidation ? "checking_form_passwordConfirm_error checking_form_passwordConfirm_error-ok" : "checking_form_passwordConfirm_error"}><TbPoint size={15} />Les mots de passe doivent être identiques</span>
                </div>
              </CSSTransition>
            </fieldset>

            <ButtonLoader type='submit' disabled={(credentials.formPasswordRecoveryNew1 && credentials.formPasswordRecoveryNew2)} text='Continuer' isLoading={pending.signup} />
          </form>
          <div className={connection === 'checking' ? "checking_bottom checking_bottom-checking" : "checking_bottom"}>
            <span className="checking_bottom_conf">Confidentialité</span>
          </div>
        </div>
      </CSSTransition>
    </div >
  )
}

export default LoginPage;
