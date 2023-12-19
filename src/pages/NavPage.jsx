import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navPageDialogData } from '../constants';
import ChooseDialog from '../ui/components/ChooseDialog';

const NavPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <ChooseDialog
      title="Select an option"
      isOpen={true}
      onClose={handleClose}
      data={navPageDialogData}
    />
  );
};

export default NavPage;

