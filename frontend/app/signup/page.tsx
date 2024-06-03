'use client';
import React, { useEffect, useState } from 'react';
import styles from './SignUp.module.css';
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
import {
  MdOutlineInfo,
  MdOutlineLock,
  MdOutlinePersonAdd,
} from 'react-icons/md';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useDebouncedValue } from '@mantine/hooks';
import { fetcher } from '@/lib/fetcher';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  checkUsername,
  validateConfirmPassword,
  validatePassword,
  validateUsername,
} from '@/lib/validation';
import UsernameInput from '@/components/common/CustomInputs/UsernameInput';
import CustomPasswordInput from '@/components/common/CustomInputs/PasswordInput';

type FormData = {
  username: string;
  password: string;
  confirmPassword: string;
};

const SignIn = () => {
  const [submitting, setSubmitting] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const form = useForm<FormData>({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: validateUsername,
      password: validatePassword,
      confirmPassword: (confirmPassword): string | null =>
        validateConfirmPassword(form.values.password, confirmPassword),
    },
    validateInputOnChange: true,
  });

  const [debouncedUsername] = useDebouncedValue(form.values.username, 400);

  const handleSubmit = async (data: FormData) => {
    setSubmitting(true);

    if (await checkUsername(data.username, setCheckingUsername)) {
      setSubmitting(false);

      return form.setErrors({
        username: 'Username is already taken',
      });
    }

    const res = await fetcher('POST', { wholeResponse: true })(
      'api/auth/signup',
      {
        username: data.username,
        password: data.password,
      }
    );

    if (res.status === 201) {
      const res = await signIn('credentials', {
        ...data,
        isInitial: true,
        redirect: false,
      });

      if (!res?.ok) {
        form.setErrors({
          username: true,
          password: true,
          confirmPassword: 'Something went wrong with signing in',
        });
      } else {
        toast.success('Successfully signed up!');
        await update({ name: data.username });
        router.back();
        router.back();
      }
    } else {
      form.setErrors({
        username: true,
        password: true,
        confirmPassword: 'Something went wrong with signing up',
      });
    }

    setSubmitting(false);
  };

  useEffect(() => {
    (async () => {
      if (!debouncedUsername) return;

      if (await checkUsername(debouncedUsername, setCheckingUsername)) {
        form.setErrors({
          username: 'Username is already taken',
        });
      }
    })();
  }, [debouncedUsername]);

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
            Sign up to save your progress{' '}
            <Tooltip label="All games that you've played as a guest will be saved on your new account!">
              <ThemeIcon variant="light" size="sm" radius="xl">
                <MdOutlineInfo />
              </ThemeIcon>
            </Tooltip>
          </Text>
          <div className={styles.inputs}>
            <UsernameInput
              checkingUsername={checkingUsername}
              form={form}
              submitting={submitting}
            />
            <CustomPasswordInput form={form} disabled={submitting} />
            <PasswordInput
              placeholder="Confirm password"
              leftSection={<MdOutlineLock />}
              required
              disabled={form.values.password.length < 8}
              key={form.key('confirmPassword')}
              {...form.getInputProps('confirmPassword')}
            />
          </div>
          <div className={styles.signupText}>
            <Text
              fz="sm"
              ta="center"
              component="span"
              className={styles.noAccount}
            >
              Already have an account?
            </Text>
            <Link href="/signin" className={styles.link}>
              <Highlight
                fz="sm"
                ta="center"
                highlight="Sign in"
                highlightStyles={{
                  backgroundImage:
                    'linear-gradient(45deg, var(--mantine-color-orange-5), var(--mantine-color-yellow-5))',
                  fontWeight: 700,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Sign in
              </Highlight>
            </Link>
          </div>
          <Button
            leftSection={<MdOutlinePersonAdd size={16} />}
            variant="gradient"
            gradient={{
              from: 'orange',
              to: 'yellow',
              deg: 45,
            }}
            type="submit"
            loading={submitting}
          >
            Sign up!
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default SignIn;
