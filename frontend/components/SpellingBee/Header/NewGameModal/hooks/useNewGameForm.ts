import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import toast from 'react-hot-toast';
import { fetcher } from '@/lib/fetcher';
import { useGameStore } from '@/stores/gameStore';
import { useModalStore } from '@/stores/modalStore';
import { useSessionStore } from '@/stores/sessionStore';

export const useNewGameForm = () => {
  const [loading, setLoading] = useState(false);

  const { setCurrentGame, fetchGames } = useGameStore();
  const { setOpenModal } = useModalStore();
  const { session } = useSessionStore();

  const form = useForm({
    initialValues: {
      randomLetters: true,
      profanesAllowed: session?.data?.user?.settings?.profanesAllowed ?? false,
      centerLetter: '',
      letters: '',
    },
    validate: {
      centerLetter: (value, values) => {
        if (values.randomLetters) return null;
        if (!value) return 'Center letter is required';
        if (value.length !== 1) return 'Center letter should be a single character';
        return null;
      },
      letters: (value, values) => {
        if (values.randomLetters) return null;
        if (!value) return 'Letters are required';
        if (value.length !== 6) return 'All 6 letters are required';
        const allLetters = values.centerLetter + values.letters;
        const uniqueLetters = new Set(allLetters.toUpperCase());
        if (uniqueLetters.size !== allLetters.length) return 'Letters should be unique';
        return null;
      },
    },
  });

  const values = form.values;

  const handleSubmit = async (values: any) => {
    form.validate();

    if (form.isValid()) {
      setLoading(true);

      const response = await toast.promise(
        fetcher('POST', { wholeResponse: true })(
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
        },
        {
          position: 'top-right',
          success: {
            icon: '🎉',
          },
        }
      );

      await fetchGames?.();
      form.reset();
      setOpenModal(null);
      if (response?.status === 200) setCurrentGame(response?.data?.id);

      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldValue(
      'profanesAllowed',
      session?.data?.user?.settings?.profanesAllowed ?? false
    );
  }, [session?.data?.user?.settings?.profanesAllowed]);

  return {
    form,
    values,
    loading,
    handleSubmit,
    setOpenModal,
  };
};
