import { Box } from '@mui/material';
import { Formik } from 'formik';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addServerInitialValues } from '../constants';
import SnackbarAlert from '../ui/components/SnackbarAlert';
import { addServerValidator } from '../validators/addServerValidator';
import AddServerForm from '../ui/components/ServerPage/AddServerForm';

const AddServer = () => {
  const navigate = useNavigate();
  const [servers, setServers] = useState(
    JSON.parse(localStorage.getItem('servers') || '[]')
  );
  const [keys, setKeys] = useState(
    JSON.parse(localStorage.getItem('keys') || '[]')
  );
  const [warningMount, setWarningMount] = useState('');

  const handleSubmit = (values) => {
    const newServer = values.server;
    const newKey = values.key;
    newServer.key = newKey.name;
    const newServers = [...servers, newServer];
    const newKeys = [...keys, newKey];
    setServers(newServers);
    setKeys(newKeys);
    localStorage.setItem('servers', JSON.stringify(newServers));
    localStorage.setItem('keys', JSON.stringify(newKeys));
    navigate('/pools/create');
  };

  return (
    <Box>
      <SnackbarAlert
        msg={warningMount}
        setMsg={setWarningMount}
        severity="error"
      />
      <Formik
        initialValues={addServerInitialValues}
        onSubmit={handleSubmit}
        validationSchema={addServerValidator}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <AddServerForm />
      </Formik>
    </Box>
  );
};

export default AddServer;
