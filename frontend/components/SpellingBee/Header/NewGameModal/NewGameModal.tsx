'use client';

import React from 'react';
import styles from './NewGameModal.module.css';
import { Button, Checkbox, PinInput, Modal, Stack, Text } from '@mantine/core';
import { MdOutlineCreate } from 'react-icons/md';
import { useNewGameForm } from './hooks/useNewGameForm';
import { useModalStore } from '@/stores/modalStore';

const NewGameModal = () => {
  const { openModal } = useModalStore();
  const { form, values, loading, handleSubmit, setOpenModal } =
    useNewGameForm();

  return (
    <Modal
      opened={openModal === 'NEW_GAME'}
      onClose={() => {
        setOpenModal('GAMES');
        form.reset();
      }}
      title={<span className="modalTitle">Create a new game</span>}
      className={styles.modalContent}
      centered
      overlayProps={{
        backgroundOpacity: 0.3,
        blur: 3,
      }}
    >
      <form className={styles.form} onSubmit={form.onSubmit(handleSubmit)}>
        <Checkbox
          defaultChecked
          label="Use random letters?"
          description="If checked, random letters will be generated"
          color="gold.7"
          styles={{ description: { marginTop: 0 } }}
          key={form.key('randomLetters')}
          {...form.getInputProps('randomLetters')}
          disabled={loading}
        />

        {!values.randomLetters && (
          <>
            <Stack gap="0">
              <Text size="md">Center letter</Text>
              <PinInput
                placeholder="X"
                length={1}
                disabled={form.values.randomLetters || loading}
                key={form.key('centerLetter')}
                {...form.getInputProps('centerLetter')}
                value={values.centerLetter.toUpperCase()}
              />
            </Stack>

            <Stack gap="0">
              <Text size="md">Other letters</Text>
              <PinInput
                placeholder="X"
                title="Other letters"
                length={6}
                disabled={form.values.randomLetters || loading}
                key={form.key('letters')}
                {...form.getInputProps('letters')}
                value={values.letters.toUpperCase()}
              />
            </Stack>
          </>
        )}

        <Checkbox
          label="Allow profane words in this game?"
          description="Parental advisory is recommended"
          color="gold.7"
          styles={{ description: { marginTop: 0 } }}
          key={form.key('profanesAllowed')}
          {...form.getInputProps('profanesAllowed')}
          checked={form.values.profanesAllowed}
          disabled={loading}
        />

        {(form.errors.centerLetter || form.errors.letters) && (
          <div className={styles.error}>
            {form.errors.centerLetter || form.errors.letters}
          </div>
        )}

        <Button
          leftSection={<MdOutlineCreate size={16} />}
          color="gold.7"
          type="submit"
          loading={loading}
        >
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default NewGameModal;
