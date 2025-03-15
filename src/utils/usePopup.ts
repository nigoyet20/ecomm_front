import { useState } from "react";
import { useAppDispatch } from "../hooks/redux";
import { setIsOpen, setPopup } from "../store/reducer/modal";

export const usePopupMessage = () => {
  const dispatch = useAppDispatch();
  const [timerPopup, setTimerPopup] = useState<NodeJS.Timeout | null>(null);

  const setPopupMessage = (message: string, error?: boolean) => {
    dispatch(setPopup({ message, error }));
    const timeout = setTimeout(() => {
      dispatch(setIsOpen({ modal: "popupIsOpen", value: false }));
    }, 6000);
    setTimerPopup(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }

  const handleClickPopup = () => {
    if (timerPopup)
      clearTimeout(timerPopup);
    dispatch(setIsOpen({ modal: 'popupIsOpen', value: false }));
  }

  return { setPopupMessage, handleClickPopup, timerPopup };
}