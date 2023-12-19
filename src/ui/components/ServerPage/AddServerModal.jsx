import { Formik } from 'formik';
import React, { useState } from 'react';
import { addServerModalInitialValues } from '../../../constants';
import { addServerModalValidator } from '../../../validators/addServerModalValidator';
import AddServerModalContent from './AddServerModalContent';
import { Dialog } from '@mui/material';
import { useNavigate } from 'react-router';

const AddServerModal = ({ isOpen, handleClose }) => {
  const [servers, setServers] = useState(
    JSON.parse(localStorage.getItem('servers') || '[]')
  );
  const navigate = useNavigate();

  const handleSubmit = (values, { resetForm }) => {
    const newServer = values.server;
    const newServers = [...servers, newServer];
    setServers(newServers);
    localStorage.setItem('servers', JSON.stringify(newServers));
    resetForm();
    handleClose();
    navigate(0);
  };
  return (
    <Dialog
      onClose={handleClose}
      open={isOpen}
      PaperProps={{
        sx: {
          '@media (max-height:800px)': {
            top: '95px',
          },
        },
      }}
      sx={{
        '& .MuiPaper-root': {
          maxWidth: 'none',
        },
      }}
    >
      <Formik
        initialValues={addServerModalInitialValues}
        onSubmit={handleSubmit}
        validationSchema={addServerModalValidator}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <AddServerModalContent handleClose={handleClose} />
      </Formik>
    </Dialog>
  );
};

export default AddServerModal;
