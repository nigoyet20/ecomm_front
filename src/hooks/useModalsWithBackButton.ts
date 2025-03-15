import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux"
import { closeAllModal } from "../store/reducer/modal";
import { selectModalVales } from "../utils/selectors";

export const useModalsWithBackButton = () => {
  const dispatch = useAppDispatch();
  const modals = useAppSelector(selectModalVales);

  const isAnyModalOpen = modals.some((modal) => modal);

  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      e.preventDefault();

      if (isAnyModalOpen) {
        dispatch(closeAllModal());
        return;
      }
    }
    window.addEventListener('popstate', handleBackButton);

    if (isAnyModalOpen) {
      window.history.pushState(null, '', window.location.href);
    }

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    }
  }, [isAnyModalOpen, dispatch]);
}
