import { useState, useCallback } from 'react';
import { useForm } from '@mantine/form';
import toast from 'react-hot-toast';
import { fetcher } from '@/lib/fetcher';
import { useSessionStore } from '@/stores/sessionStore';
import { useGameStore } from '@/stores/gameStore';

export const useSettingsForm = () => {
  const [loading, setLoading] = useState(false);
  const { session } = useSessionStore();
  const { fetchGames } = useGameStore();

  const form = useForm({
    initialValues: {
      profanesAllowed: session?.data?.user?.settings?.profanesAllowed ?? false,
      wordListSortBy: session?.data?.user?.settings?.wordListSortBy ?? 'ALPHABETICAL',
    },
  });

  const handleCheckboxChange = useCallback(
    (checkboxName: string) =>
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (loading) return;

        setLoading(true);
        form.setFieldValue(checkboxName, event.target.checked);

        await toast.promise(
          fetcher('PATCH', { wholeResponse: true })('api/player/update', {
            ...session?.data?.user?.settings,
            [checkboxName]: event.target.checked,
          }),
          {
            loading: 'Updating settings...',
            success: () => {
              session?.update({
                settings: {
                  ...session?.data?.user?.settings,
                  [checkboxName]: event.target.checked,
                },
              });
              return 'Settings updated successfully';
            },
            error: () => {
              form.setFieldValue(checkboxName, !event.target.checked);
              return 'Failed to update settings';
            },
          },
          {
            position: 'top-right',
          }
        );

        setLoading(false);
      },
    [loading, form, session]
  );

  const handleSelectChange = useCallback(
    (selectName: string) => async (value: string | null) => {
      if (loading) return;

      setLoading(true);
      form.setFieldValue(selectName, value);

      await toast.promise(
        fetcher('PATCH', { wholeResponse: true })('api/player/update', {
          ...session?.data?.user?.settings,
          [selectName]: value,
        }),
        {
          loading: 'Updating settings...',
          success: () => {
            fetchGames?.();
            session?.update({
              settings: {
                ...session?.data?.user?.settings,
                [selectName]: value,
              },
            });
            return 'Settings updated successfully';
          },
          error: () => {
            form.setFieldValue(
              selectName,
              (session?.data?.user?.settings as any)?.[selectName] ?? 'ALPHABETICAL'
            );
            return 'Failed to update settings';
          },
        },
        {
          position: 'top-right',
        }
      );

      setLoading(false);
    },
    [loading, form, session]
  );

  return {
    form,
    loading,
    handleCheckboxChange,
    handleSelectChange,
  };
};
