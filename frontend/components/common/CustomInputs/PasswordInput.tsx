import { PasswordInput } from '@mantine/core';
import React from 'react';
import { MdOutlineLock } from 'react-icons/md';

const CustomPasswordInput = ({
  disabled,
  form,
  ...props
}: {
  disabled?: boolean;
  form: any;
  [key: string]: any;
}) => {
  return (
    <PasswordInput
      placeholder="Password"
      leftSection={<MdOutlineLock />}
      required
      disabled={disabled}
      key={form.key('password')}
      {...form.getInputProps('password')}
      {...props}
    />
  );
};

export default CustomPasswordInput;
