import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { checkTokenExpiration } from "../../../utils/checkTokenExpiration";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { actionLogout } from "../../../store/thunks/checkLogin";

interface PrivateRouteProps {
    children: JSX.Element;
    isAuthenticated: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, isAuthenticated }) => {
    const dispatch = useAppDispatch();
    const [shouldRedirect, setShouldRedirect] = React.useState(false);
    const pending = useAppSelector((state) => state.account.pending.checkToken);

    useEffect(() => {
        if (checkTokenExpiration() === false) {
            dispatch(actionLogout());
            setShouldRedirect(true);
        }
    }, [dispatch]);

    if (shouldRedirect || (!isAuthenticated && pending)) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

const AdminRoute: React.FC<PrivateRouteProps> = ({ children, isAuthenticated }) => {
    const dispatch = useAppDispatch();
    const [shouldRedirect, setShouldRedirect] = React.useState(false);
    const pending = useAppSelector((state) => state.account.pending.checkToken);
    const isAdmin = useAppSelector((state) => state.account.account.admin);

    useEffect(() => {
        if (!pending) {
            if (checkTokenExpiration() === false || !isAdmin) {
                dispatch(actionLogout());
                setShouldRedirect(true);
            }
        }
    }, [dispatch, isAdmin, pending]);

    if (shouldRedirect || (!isAuthenticated && pending)) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};


const NonPrivateRoute: React.FC<PrivateRouteProps> = ({ children, isAuthenticated }) => {
    return isAuthenticated ? <Navigate to="/" /> : children;
};

export { PrivateRoute, AdminRoute, NonPrivateRoute };

