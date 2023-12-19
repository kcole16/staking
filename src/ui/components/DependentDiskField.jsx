import { useField, useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { StyledSelect } from './StyledSelect';

const DependentDiskField = (props) => {
  const {
    values: { server },
    setFieldValue,
  } = useFormikContext();
  const [field] = useField(props);

  useEffect(() => {
    if (
      server &&
      server.Type &&
      server.Type !== 'Other' &&
      server.Type !== '-'
    ) {
      setFieldValue(props.name, '2');
    }
  }, [server, setFieldValue, props.name]);

  return <StyledSelect {...props} {...field} />;
};

export default DependentDiskField;
