import { FormEvent, useRef, useState } from 'react';
import './ModalCollectionFilter.scss';
import { CSSTransition } from 'react-transition-group';
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";

import ToggleSwitch from "../../App/ToggleSwitch/ToggleSwitch";
import PriceSelector from "../../App/PriceSelector/PriceSelector";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setFilterValue } from "../../../store/reducer/modal";

function ModalCollectionFilter({ isOpen, acceptFunction, cancelFunction, min, max }: { isOpen: boolean, acceptFunction: (e: FormEvent<HTMLFormElement>) => void, cancelFunction: () => void, min: number, max: number }) {
  const modalCollectionFilterBackgroundRef = useRef<HTMLDivElement>(null);
  const modalCollectionFilterRef = useRef<HTMLDivElement>(null);
  const [priceSectionIsopen, setPriceSectionIsOpen] = useState(false);
  const available = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.available);

  const dispatch = useAppDispatch();

  const toggleAvailable = () => {
    dispatch(setFilterValue({ name: "available", value: !available }));
  };

  return (
    <div>
      <CSSTransition nodeRef={modalCollectionFilterBackgroundRef} in={isOpen} timeout={300} classNames="modalCollectionFilter_fade" unmountOnExit>
        <div ref={modalCollectionFilterBackgroundRef} className="modalCollectionFilter_background" onClick={cancelFunction}></div>
      </CSSTransition>

      <CSSTransition nodeRef={modalCollectionFilterRef} in={isOpen} timeout={300} classNames="modalCollectionFilter_slide-up" unmountOnExit>
        <div ref={modalCollectionFilterRef} className="modalCollectionFilter">
          <form className="modalCollectionFilter_form" onSubmit={acceptFunction} onReset={cancelFunction}>
            <div className="modalCollectionFilter_categories">
              <div className="modalCollectionFilter_categories_header">
                <span className="modalCollectionFilter_categories_text">En stock uniquement</span>
                <ToggleSwitch value={available} toggleValue={toggleAvailable} />
              </div>

            </div>
            <div className={priceSectionIsopen ? "modalCollectionFilter_categories modalCollectionFilter_categories-price modalCollectionFilter_categories-price-open" : "modalCollectionFilter_categories modalCollectionFilter_categories-price"}>
              <div className="modalCollectionFilter_categories_header" onClick={() => setPriceSectionIsOpen(!priceSectionIsopen)}>
                <span className="modalCollectionFilter_categories_header_text">Prix</span>
                <div className={priceSectionIsopen ? "modalCollectionFilter_categories_header_icon modalCollectionFilter_categories_header_icon-open" : "modalCollectionFilter_categories_header_icon"}>
                  <MdOutlineKeyboardArrowUp size={25} />
                </div>
              </div>
              <PriceSelector isOpen={priceSectionIsopen} min={min} max={max} />
            </div>

            <div className="modalConfirm_buttons">
              <div className="modalConfirm_buttons_right">
                <button type="reset" className="modalConfirm_buttons_right_cancel">Annuler</button>
                <button type="submit" className="modalConfirm_buttons_right_submit">Confirmer</button>
              </div>
            </div>
          </form>
          <button className="modalCollectionFilter_exitBtn" onClick={cancelFunction}>
            <IoCloseSharp size={25} />
          </button>
        </div>
      </CSSTransition>
    </div>
  );
}

export default ModalCollectionFilter;
