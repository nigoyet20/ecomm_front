import './TextRadio.scss'

function TextRadio({ datas, stateSelected, setSelected }: { datas: string[], stateSelected: number, setSelected: (index: number) => void }) {

  const handleChange = (index: number) => {
    setSelected(index);
  }

  return (
    <div className="states">
      {datas.map((data, index) => (
        <label htmlFor="state" className={stateSelected === index ? "states_label states_label-checked" : "states_label"} key={index}>
          <input key={index} type="radio" name='prodcutStates' value={data} checked={stateSelected === index} onChange={() => handleChange(index)} className="states_label_input"></input>
          {data}
        </label>
      ))}
    </div>
  )
}

export default TextRadio;
