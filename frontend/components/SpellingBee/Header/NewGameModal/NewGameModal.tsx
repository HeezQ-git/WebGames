/* eslint-disable indent */
import React, { useEffect } from 'react';
import styles from './NewGameModal.module.css';
import { useModalStore } from '@/stores/modal';
import { Button, Checkbox, PinInput, Modal, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import toast from 'react-hot-toast';
import { fetcher } from '@/lib/fetcher';
import { useGlobalStore } from '@/stores/global';
import { MdOutlineCreate } from 'react-icons/md';

const NewGameModal = () => {
  const { isNewGameModalOpen, setIsNewGameModalOpen, setIsGamesModalOpen } =
    useModalStore();
  const { fetchGames, session } = useGlobalStore();

  const form = useForm({
    initialValues: {
      randomLetters: true,
      profanesAllowed: session?.data?.user?.profanesAllowed ?? false,
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
            ? { profanesAllowed: values.profanesAllowed }
            : {
                letters: [
                  ...values.letters.toUpperCase().split(''),
                  values.centerLetter.toUpperCase(),
                ],
                centerLetter: values.centerLetter.toUpperCase(),
                profanesAllowed: values.profanesAllowed,
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

  useEffect(() => {
    form.setFieldValue(
      'profanesAllowed',
      session?.data?.user?.profanesAllowed ?? false
    );
  }, [session?.data?.user?.profanesAllowed]);

  return (
    <Modal
      opened={isNewGameModalOpen}
      onClose={() => {
        setIsNewGameModalOpen(false);
        setIsGamesModalOpen(true);
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
        />

        {!values.randomLetters && (
          <>
            <Stack gap="0">
              <Text size="md">Center letter</Text>
              <PinInput
                placeholder="X"
                length={1}
                disabled={form.values.randomLetters}
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
                disabled={form.values.randomLetters}
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
        >
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default NewGameModal;
