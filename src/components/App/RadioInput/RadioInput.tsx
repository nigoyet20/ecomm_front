import { ChangeEvent } from "react";
import './RadioInput.scss'

function RadioInput({ name, id, text, key, checked = false, handleChange }: { name: string, id: number, text: string, key?: number, checked: boolean, handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>) => void }) {

  return (
    <div className="radioInput" key={key}>
      <label htmlFor={id.toString()} className="radioInput_radio">
        <input type="radio" name={name} id={id.toString()} value={id.toString()} checked={checked} className="radioInput_radio_input" onChange={handleChange}></input>
        <span className="radioInput_radio_mark"></span>
        {text}
      </label>
    </div >
  )
}

export default RadioInput;
