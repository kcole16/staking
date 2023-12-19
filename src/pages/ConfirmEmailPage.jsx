import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authService } from '../helpers/auth';
import ResultModal from '../ui/components/AuthModals/ResultModal';

const ConfirmEmailPage = () => {
  const [modalTitle, setModalTitle] = useState('');
  const [isFailed, setModalIsFailed] = useState(false);
  const { email, token } = useParams();

  useEffect(() => {
    if (modalTitle === '' && email && token) {
      setModalIsFailed(false);
      authService.confirmEmail(email, token).then((res) => {
        if (res.status === 'success') {
          setModalTitle('Registration confirmed!');
        } else if (res.status === 'fail') {
          setModalIsFailed(true);
          setModalTitle(res.message);
        } else {
          setModalTitle('Something went wrong...');
        }
      });
    }
  }, [modalTitle, email, token]);

  return modalTitle ? (
    <ResultModal
      isOpen={true}
      title={modalTitle}
      backTo="/signin"
      buttonText="close"
      submitButtonText="DONE"
      navigateOnSubmit="/signin"
      isFailed={isFailed}
    />
  ) : null;
};

export default ConfirmEmailPage;

