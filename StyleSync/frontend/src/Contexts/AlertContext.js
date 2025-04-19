import React, { createContext, useState, useContext } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';


const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ message: '', severity: 'success', open: false });

  const showAlert = (message, severity = 'success') => {
    if (message) {
      setAlert({ message, severity, open: true });
      if (severity === 'success') {
        setTimeout(() => {
          setAlert((currentAlert) => {
            if (currentAlert.message === message && currentAlert.severity === severity) {
              return { ...currentAlert, open: false };
            }
            return currentAlert;
          });
        }, 5000);
      }
    }
  };

  const closeAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const openAlert = () => {
    setAlert({ ...alert, open: true });
  };

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert, openAlert }}>
      {children}
      <Stack
        sx={{
          width: '100%',
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          pointerEvents: 'none', // ensures the alerts don't block other elements
        }}
      >
        {alert.open && (
          <Alert variant="filled"
            onClose={closeAlert}
            severity={alert.severity}
            sx={{ pointerEvents: 'all' }} // ensures the close button is clickable
          ><AlertTitle>{alert.severity.toUpperCase()}</AlertTitle>
            {alert.message}
          </Alert>
        )}
      </Stack>
    </AlertContext.Provider>
  );
};
