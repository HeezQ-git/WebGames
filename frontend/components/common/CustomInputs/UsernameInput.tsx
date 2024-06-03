import { Loader, TextInput } from '@mantine/core';
import React from 'react';
import { MdOutlinePerson } from 'react-icons/md';

const UsernameInput = ({
  form,
  checkingUsername,
  submitting,
  ...props
}: {
  form: any;
  checkingUsername?: boolean;
  submitting?: boolean;
  [key: string]: any;
}) => {
  return (
    <TextInput
      placeholder="Username"
      leftSection={
        checkingUsername ? <Loader size="xs" /> : <MdOutlinePerson />
      }
      autoFocus
      required
      disabled={submitting}
      key={form.key('username')}
      {...form.getInputProps('username')}
      {...props}
    />
  );
};

export default UsernameInput;
