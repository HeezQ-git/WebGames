import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { fetcher } from '@/lib/fetcher';
import { useModalStore } from '@/stores/modalStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useGameStore } from '@/stores/gameStore';

export const useDangerAction = () => {
  const { setOpenModal } = useModalStore();
  const { dangerAction } = useSettingsStore();
  const { fetchGames } = useGameStore();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      confirm: '',
      agreement: false,
    },
    validate: {
      confirm: (value) => (value === 'CONFIRM' ? null : 'Invalid code'),
      agreement: (value) => (value ? null : 'You must agree to continue'),
    },
  });

  const handleDangerAction = async (values: typeof form.values) => {
    if (dangerAction === 'reset') {
      const res = await fetcher('DELETE', { wholeResponse: true })('api/player/progress');

      if (res.status === 200) {
        toast.success('Progress reset successfully');
        await fetchGames?.();
      } else {
        toast.error('An error occurred while resetting your progress');
      }
    } else {
      const res = await fetcher('DELETE', { wholeResponse: true })('api/player/account');

      if (res.status === 200) {
        router.push('/signout');
        toast.success('Account deleted successfully');
      } else {
        toast.error('An error occurred while deleting your account');
      }
    }

    setOpenModal('SETTINGS');
  };

  return { form, handleDangerAction, setOpenModal, dangerAction };
};
