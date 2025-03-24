import './Checkbox.scss'

function Checkbox({ text, checked, handleChange, whitebg, name }: { text: string, checked: boolean, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void, whitebg?: boolean, name?: string }) {
  return (
    <div className="checkbox">
      <input type="checkbox" name={name ? name : "default"} id={name ? name : "default"} className="checkbox_input" checked={checked} onChange={handleChange} />
      <label htmlFor={name ? name : "default"} className={whitebg ? "checkbox_label checkbox_label-whitebg" : "checkbox_label"}>{text}</label>
    </div>
  )
}

export default Checkbox;
