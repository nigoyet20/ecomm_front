import './PriceSelector.scss'
import DoubleRangeSelector from "../DoubleRangeSelector/DoubleRangeSelector";
import { useRef } from "react";
import { CSSTransition } from 'react-transition-group';

function PriceSelector({ isOpen, min, max, direct }: { isOpen: boolean, min: number, max: number, direct?: boolean }) {
  const PriceSelectorRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition nodeRef={PriceSelectorRef} in={isOpen} timeout={500} classNames="card-conteiner_fade" unmountOnExit>
      <div ref={PriceSelectorRef} className="card-conteiner">
        <div className="card-content">
          <div data-range="#third" data-value-1="#second" data-value-0="#first" className="slider">
            <label className="label-min-value">{min}</label>
            <label className="label-max-value">{max}</label>
          </div>
          <DoubleRangeSelector direct={direct} />
        </div>
      </div>
    </CSSTransition>

  )
}

export default PriceSelector;
