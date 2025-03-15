import './Checkbox.scss'

function Checkbox({ text, checked, handleChange, whitebg }: { text: string, checked: boolean, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void, whitebg?: boolean }) {
  return (
    <div className="checkbox">
      <input type="checkbox" name="default" id="default" className="checkbox_input" checked={checked} onChange={handleChange} />
      <label htmlFor="default" className={whitebg ? "checkbox_label checkbox_label-whitebg" : "checkbox_label"}>{text}</label>
    </div>
  )
}

export default Checkbox;
