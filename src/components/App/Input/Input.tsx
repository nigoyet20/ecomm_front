import { useState } from 'react';
import './Input.scss'
import { inputI } from '../../../@types/props';

function Input({ name, type, text, backWhite, required, handleChange, value, modal, disabled, rows, columns, backgroundColor }: inputI) {
  const [isFocus, setIsFocus] = useState(false);

  const handleFocus = () => {
    setIsFocus(true);
  }

  const handleBlur = () => {
    setIsFocus(false);
  }

  if (type === "textarea")
    return (
      <>
        {
          backWhite ? (
            <fieldset className={isFocus ? "inputModifWhite inputModifWhite-focus" : "inputModifWhite"} >
              <textarea id={name} name={name} className={disabled ? "inputModifWhite_input inputModifWhite_input-disabled" : "inputModifWhite_input"} onFocus={handleFocus} onBlur={handleBlur} required={required} onChange={handleChange} value={value} data-modal={modal} disabled={disabled} placeholder='' rows={rows} cols={columns} />
              <label className="inputModifWhite_label inputModifWhite_label-textarea" htmlFor={name}>{text}</label>
            </fieldset >
          ) : (
            <fieldset className={isFocus ? "inputModif inputModif-focus" : "inputModif"}>
              <textarea id={name} name={name} className={disabled ? "inputModif_input inputModif_input-disabled" : "inputModif_input"} onFocus={handleFocus} onBlur={handleBlur} required onChange={handleChange} data-modal={modal} disabled={disabled} placeholder='' rows={rows} cols={columns} />
              <label className="inputModif_label inputModif_label-textarea" htmlFor={name}>{text}</label>
            </fieldset>
          )
        }
      </>
    )

  return (
    <>
      {
        backWhite ? (
          <fieldset className={isFocus ? "inputModifWhite inputModifWhite-focus" : "inputModifWhite"} style={{ backgroundColor: backgroundColor }} >
            <input id={name} name={name} className={disabled ? "inputModifWhite_input inputModifWhite_input-disabled" : "inputModifWhite_input"} type={type} onFocus={handleFocus} onBlur={handleBlur} required={required} onChange={handleChange} value={value} data-modal={modal} disabled={disabled} placeholder='' />
            <label className="inputModifWhite_label" htmlFor={name}>{text}</label>
          </fieldset >
        ) : (
          <fieldset className={isFocus ? "inputModif inputModif-focus" : "inputModif"} style={{ backgroundColor: backgroundColor }}>
            <input id={name} name={name} className={disabled ? "inputModif_input inputModif_input-disabled" : "inputModif_input"} type={type} onFocus={handleFocus} onBlur={handleBlur} required onChange={handleChange} data-modal={modal} disabled={disabled} placeholder='' />
            <label className="inputModif_label" htmlFor={name}>{text}</label>
          </fieldset>
        )
      }
    </>)
}

export default Input;
