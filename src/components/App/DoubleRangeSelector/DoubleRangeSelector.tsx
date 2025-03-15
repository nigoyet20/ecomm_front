import { ChangeEvent, useEffect } from "react";
import "./DoubleRangeSelector.scss";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setFilterValue } from "../../../store/reducer/modal";

const CatlogPriceFilter = ({ direct }: { direct?: boolean }) => {
  const dispatch = useAppDispatch();

  // const initialMinPrice = useAppSelector((state) => state.ModalMenu.priceRangeModal.initialMinPrice);
  // const initialMaxPrice = useAppSelector((state) => state.ModalMenu.priceRangeModal.initialMaxPrice);
  const sliderMinValue = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.sliderMinValue);
  const sliderMaxValue = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.sliderMaxValue);
  const minVal = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.minVal);
  const maxVal = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.maxVal);
  const minInput = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.minInput);
  const maxInput = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.maxInput);
  const isDragging = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.isDraging);
  const minGap = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.minGap);

  useEffect(() => {
    setSliderTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minVal, maxVal]);

  const slideMin = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= sliderMinValue && maxVal - value >= minGap) {
      dispatch(setFilterValue({ name: "minVal", value }));
      dispatch(setFilterValue({ name: "minInput", value: e.target.value }));
      if (direct) {
        dispatch(setFilterValue({ name: "filtered", value: true }));
        dispatch(setFilterValue({ name: "selectedMinPrice", value: value }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const slideMax = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value <= sliderMaxValue && value - minVal >= minGap) {
      dispatch(setFilterValue({ name: "maxVal", value }));
      dispatch(setFilterValue({ name: "maxInput", value: e.target.value }));
      if (direct) {
        dispatch(setFilterValue({ name: "filtered", value: true }));
        dispatch(setFilterValue({ name: "selectedMaxPrice", value: value }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const setSliderTrack = () => {
    const range = document.querySelector(".slider-track") as HTMLElement;
    if (range) {
      const minPercent =
        ((minVal - sliderMinValue) / (sliderMaxValue - sliderMinValue)) * 100;
      const maxPercent =
        ((maxVal - sliderMinValue) / (sliderMaxValue - sliderMinValue)) * 100;

      range.style.left = `${minPercent}%`;
      range.style.right = `${100 - maxPercent}%`;
    }
  };

  const handleMinInput = (e: ChangeEvent<HTMLInputElement>) => {
    // const value = e.target.value === "" ? sliderMinValue : parseInt(e.target.value, 10);
    const value = parseInt(e.target.value, 10);
    dispatch(setFilterValue({ name: "minInput", value }));
    // if (value >= sliderMinValue && value < maxVal - minGap) {
    //   dispatch(setFilterValue({ name: "minInput", value }));
    //   dispatch(setFilterValue({ name: "minVal", value }));
    // }
  };

  const handleMaxInput = (e: ChangeEvent<HTMLInputElement>) => {
    // const value = e.target.value === "" ? sliderMaxValue : parseInt(e.target.value, 10);
    const value = e.target.value;
    dispatch(setFilterValue({ name: "maxInput", value }));


    // if (value <= sliderMaxValue && value > minVal + minGap) {
    //   dispatch(setFilterValue({ name: "maxInput", value }));
    //   dispatch(setFilterValue({ name: "maxVal", value }));
    // }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: string) => {
    if (e.key === "Enter") {
      const value = parseInt(e.currentTarget.value, 10);
      if (
        type === "min" &&
        value >= sliderMinValue &&
        value < maxVal - minGap
      ) {
        dispatch(setFilterValue({ name: "minVal", value }));
        if (direct) {
          dispatch(setFilterValue({ name: "filtered", value: true }));
          dispatch(setFilterValue({ name: "selectedMinPrice", value: value }));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

      } else if (
        type === "max" &&
        value <= sliderMaxValue &&
        value > minVal + minGap
      ) {
        dispatch(setFilterValue({ name: "maxVal", value }));
        if (direct) {
          dispatch(setFilterValue({ name: "filtered", value: true }));
          dispatch(setFilterValue({ name: "selectedMaxPrice", value: value }));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  };

  const startDrag = () => {
    dispatch(setFilterValue({ name: "isDraging", value: true }));
  };

  const stopDrag = () => {
    dispatch(setFilterValue({ name: "isDraging", value: false }));
  };

  return (
    <div className="double-slider-box">
      <div className="range-slider">
        <div className="slider-track"></div>
        <input
          type="range"
          min={sliderMinValue}
          max={sliderMaxValue}
          value={minVal}
          onChange={slideMin}
          onMouseDown={startDrag}
          onMouseUp={stopDrag}
          onTouchStart={startDrag}
          onTouchEnd={stopDrag}
          className="min-val"
        />
        <input
          type="range"
          min={sliderMinValue}
          max={sliderMaxValue}
          value={maxVal}
          onChange={slideMax}
          onMouseDown={startDrag}
          onMouseUp={stopDrag}
          onTouchStart={startDrag}
          onTouchEnd={stopDrag}
          className="max-val"
        />
        {isDragging && <div className="min-tooltip">{minVal}</div>}
        {isDragging && <div className="max-tooltip">{maxVal}</div>}
      </div>
      <div className="input-box">
        <div className="min-box">
          <input
            type="number"
            value={minInput}
            onChange={handleMinInput}
            onKeyDown={(e) => handleInputKeyDown(e, "min")}
            className="min-input"
            min={sliderMinValue}
            max={maxVal - minGap}
          />
        </div>
        <div className="max-box">
          <input
            type="number"
            value={maxInput}
            onChange={handleMaxInput}
            onKeyDown={(e) => handleInputKeyDown(e, "max")}
            className="max-input"
            min={minVal + minGap}
            max={sliderMaxValue}
          />
        </div>
      </div>
    </div>
  );
};

export default CatlogPriceFilter;
