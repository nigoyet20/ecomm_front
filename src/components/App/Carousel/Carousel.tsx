import { useEffect, useState, useCallback } from 'react';
import { CarouselI } from '../../../@types/carousel';
import './Carousel.scss'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

function Carousel({ slides, arrows, indicators, interval }: CarouselI) {
  const [slideState, setSlideState] = useState(0);
  const [transitionState, setTransitionState] = useState<'entering' | 'active' | 'inactive' | 'hidden'>('active');
  const [nextSlide, setNextSlide] = useState<number>(0);

  const setSlide = (index: number) => {
    setNextSlide(index);
    setTransitionState('inactive');

    setTimeout(() => {
      setSlideState(index);
      setTransitionState('entering');
      setTimeout(() => {
        setTransitionState('active');
      }, 200);
    }, 200);
  };

  const previousSlide = () => {
    const previousIndex = slideState === 0 ? slides.length - 1 : slideState - 1;
    setSlide(previousIndex);
  };

  const nextSlideHandler = useCallback(() => {
    const nextIndex = slideState === slides.length - 1 ? 0 : slideState + 1;
    setSlide(nextIndex);
  }, [slideState, slides.length]);

  useEffect(() => {
    if (interval === 0) return;
    const intervalSlide = setInterval(nextSlideHandler, interval * 1000);
    return () => clearInterval(intervalSlide);
  }, [nextSlideHandler, interval]);

  return (
    <div className="carousel">
      {arrows && <IoIosArrowBack className="carousel_arrow carousel_arrow-left" onClick={previousSlide} />}
      {slides.map((slide, index) => (
        <div
          key={index}
          style={{ height: '100%' }}
          className={`carousel_slide ${index === slideState
            ? "carousel_slide-active"
            : "carousel_slide-hidden"
            }`}
        >
          <img src={slide.src} alt={slide.alt} className={`carousel_slide ${index === slideState
            ? `carousel_slide-${transitionState}`
            : index === nextSlide
              ? 'carousel_slide-entering'
              : 'carousel_slide-hidden'
            }`} />
          <img src={slides[nextSlide].src} alt={slides[nextSlide].alt} />
          <div className="carousel_content">
            {slide.title && <span className={`carousel_content_title ${index === slideState
              ? `transi-ft-${transitionState}`
              : 'transi-ft-hidden'
              }`}>{slide.title}</span>}
            {slide.description && <span className={`carousel_content_description ${index === slideState
              ? `transi-f-${transitionState}`
              : 'transi-f-hidden'
              }`}>{slide.description}</span>}
            {slide.button && <Link to="/collection/iPhone" className={`carousel_content_button ${index === slideState
              ? `transi-f-${transitionState}`
              : 'transi-f-hidden'
              }`}>{slide.button}</Link>}
          </div>
        </div>

      ))}
      {arrows && <IoIosArrowForward className="carousel_arrow carousel_arrow-right" onClick={nextSlideHandler} />}
      {indicators && (
        <span className="carousel_indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setSlide(index)}
              aria-label="Indicateur de slide"
              className={`carousel_indicators_indicator ${nextSlide === index ? 'carousel_indicators_indicator-active' : 'carousel_indicators_indicator-inactive'
                }`}
            />
          ))}
        </span>
      )}
    </div>
  );
}

export default Carousel;
