'use client';

import React from 'react';
import { Stack, Select, Checkbox } from '@mantine/core';
import { useSettingsForm } from '../hooks/useContentForm';
import { useSessionStore } from '@/stores/sessionStore';

const Content: React.FC = () => {
  const { session } = useSessionStore();
  const { form, loading, handleCheckboxChange, handleSelectChange } =
    useSettingsForm();

  return (
    <Stack gap="lg">
      <Select
        label="Word list sort order"
        placeholder="Select sort order"
        data={[
          { value: 'ALPHABETICAL', label: 'Alphabetical order' },
          { value: 'LATEST_FIRST', label: 'Latest word first' },
          { value: 'OLDEST_FIRST', label: 'Oldest word first' },
        ]}
        allowDeselect={false}
        disabled={session?.status === 'loading' || loading}
        key={form.key('wordListSortBy')}
        {...form.getInputProps('wordListSortBy')}
        onChange={handleSelectChange('wordListSortBy')}
      />
      <Checkbox
        label="Allow profane words?"
        description="Parental advisory is recommended"
        styles={{ icon: { color: 'white' }, description: { marginTop: 0 } }}
        disabled={session?.status === 'loading' || loading}
        key={form.key('profanesAllowed')}
        {...form.getInputProps('profanesAllowed')}
        onChange={handleCheckboxChange('profanesAllowed')}
        checked={form.values.profanesAllowed}
      />
    </Stack>
  );
};

export default Content;
