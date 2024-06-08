'use client';
import React, { useState } from 'react';
import styles from './SignIn.module.css';
import {
  Button,
  Highlight,
  Paper,
  PasswordInput,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { MdOutlineInfo, MdOutlineLock, MdOutlineLogin } from 'react-icons/md';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import UsernameInput from '@/components/common/CustomInputs/UsernameInput';
import { useGlobalStore } from '@/stores/global';

type FormData = {
  username: string;
  password: string;
};

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { session, fetchGames } = useGlobalStore();

  const form = useForm<FormData>({
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    setLoading(true);

    const res = await signIn('credentials', {
      ...data,
      redirect: false,
    });

    if (res?.status === 200) {
      toast.success('Successfully signed in!');
      await session?.update({ name: data.username });
      await fetchGames?.();
      router.back();
    } else {
      form.setErrors({
        username: true,
        password: 'Invalid credentials',
      });
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Paper shadow="md" withBorder p="lg" radius={8} className={styles.paper}>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            form.onSubmit(handleSubmit)(e);
          }}
        >
          <Text
            fz="md"
            ta="center"
            component="div"
            className={styles.progressInfo}
          >
            Sign in to restore your progress{' '}
            <Tooltip label="Your progress will be saved and available on all devices">
              <ThemeIcon variant="light" size="sm" radius="xl">
                <MdOutlineInfo />
              </ThemeIcon>
            </Tooltip>
          </Text>
          <div className={styles.inputs}>
            <UsernameInput form={form} disabled={loading} />
            <PasswordInput
              placeholder="Password"
              leftSection={<MdOutlineLock />}
              required
              disabled={loading}
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
          </div>
          <div className={styles.signupText}>
            <Text
              fz="sm"
              ta="center"
              component="span"
              className={styles.noAccount}
            >
              Don't have an account?
            </Text>
            <Tooltip
              label="It's free!"
              position="top"
              withArrow
              openDelay={500}
            >
              <Link href="/signup" className={styles.link}>
                <Highlight
                  fz="sm"
                  ta="center"
                  highlight="Sign up"
                  highlightStyles={{
                    backgroundImage:
                      'linear-gradient(45deg, var(--mantine-color-orange-5), var(--mantine-color-yellow-5))',
                    fontWeight: 700,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Sign up
                </Highlight>
              </Link>
            </Tooltip>
          </div>
          <Button
            leftSection={<MdOutlineLogin size={16} />}
            variant="gradient"
            gradient={{
              from: 'orange',
              to: 'yellow',
              deg: 45,
            }}
            type="submit"
            loading={loading}
          >
            Sign in!
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default SignIn;
