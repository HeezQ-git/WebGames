/* eslint-disable indent */
import React from 'react';
import Modal from '../../Modal/Modal';
import styles from './NewGameModal.module.css';
import { useModalStore } from '@/stores/modal';
import { Button, Checkbox, PinInput, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import toast from 'react-hot-toast';
import { fetcher } from '@/lib/fetcher';
import { useGlobalStore } from '@/stores/global';

const NewGameModal = () => {
  const { isNewGameModalOpen, setIsNewGameModalOpen, setIsGamesModalOpen } =
    useModalStore();
  const { fetchGames } = useGlobalStore();

  const form = useForm({
    initialValues: {
      randomLetters: true,
      centerLetter: '',
      letters: '',
    },
    validate: {
      centerLetter: (value, values) => {
        if (values.randomLetters) return null;
        if (!value) return 'Center letter is required';
        if (value.length !== 1)
          return 'Center letter should be a single character';
        return null;
      },
      letters: (value, values) => {
        if (values.randomLetters) return null;
        if (!value) return 'Letters are required';
        if (value.length !== 6) return 'All 6 letters are required';
        const allLetters = values.centerLetter + values.letters;
        const uniqueLetters = new Set(allLetters.toUpperCase());
        if (uniqueLetters.size !== allLetters.length)
          return 'Letters should be unique';
        return null;
      },
    },
  });

  const values = form.getValues();

  const handleSubmit = async (values: any) => {
    form.validate();

    if (form.isValid()) {
      await toast.promise(
        fetcher('POST')(
          'api/game/create',
          values.randomLetters
            ? undefined
            : {
                letters: [
                  ...values.letters.toUpperCase().split(''),
                  values.centerLetter.toUpperCase(),
                ],
                centerLetter: values.centerLetter.toUpperCase(),
              }
        ),
        {
          loading: 'Creating a new game...',
          success: 'Game created!',
          error: 'Failed to create a new game',
        }
      );

      await fetchGames?.();
      form.reset();
      setIsNewGameModalOpen(false);
      setIsGamesModalOpen(true);
    }
  };

  return (
    <Modal
      classNames={[styles.modal]}
      open={isNewGameModalOpen}
      closeModal={() => {
        setIsNewGameModalOpen(false);
        form.reset();
      }}
      title="Create a new game"
      subtitle="Random or custom letters?"
      noContentPadding
    >
      <form className={styles.form} onSubmit={form.onSubmit(handleSubmit)}>
        <Checkbox
          defaultChecked
          label="Use random letters?"
          color="var(--darker-gold)"
          key={form.key('randomLetters')}
          {...form.getInputProps('randomLetters')}
        />

        <Tooltip label="Center letter">
          <PinInput
            placeholder="X"
            length={1}
            disabled={form.values.randomLetters}
            key={form.key('centerLetter')}
            {...form.getInputProps('centerLetter')}
            value={values.centerLetter.toUpperCase()}
          />
        </Tooltip>

        <Tooltip label="Other letters">
          <PinInput
            placeholder="X"
            title="Other letters"
            length={6}
            disabled={form.values.randomLetters}
            key={form.key('letters')}
            {...form.getInputProps('letters')}
            value={values.letters.toUpperCase()}
          />
        </Tooltip>

        {form.errors.centerLetter ||
          (form.errors.letters && (
            <div className={styles.error}>
              {form.errors.centerLetter || form.errors.letters}
            </div>
          ))}

        <Button color="var(--darker-gold)" type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default NewGameModal;
