import { Dialog, DialogContent } from '@mui/material';
import React from 'react';

const PriceModalWrapper = ({
  isOpen,
  onClose,
  children,
  contentProps,
  dialogProps,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} {...dialogProps}>
      <DialogContent {...contentProps}>{children}</DialogContent>
    </Dialog>
  );
};

export default PriceModalWrapper;
