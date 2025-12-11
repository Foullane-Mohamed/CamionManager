import React, { createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const showSuccess = (msg) => toast.success(msg);
  const showError = (msg) => toast.error(msg);
  return (
    <NotificationContext.Provider value={{ showSuccess, showError }}>
      {children}
      <ToastContainer />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
