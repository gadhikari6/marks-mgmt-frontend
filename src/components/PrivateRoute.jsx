// PrivateRoute.jsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Settings from './Settings/Settings';

const PrivateRoute = ({ element: Component, isAuthenticated, redirectTo = '/login', ...rest }) => {
  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Settings /> : <Navigate to={redirectTo} replace />}
    />
  );
};

export default PrivateRoute;
