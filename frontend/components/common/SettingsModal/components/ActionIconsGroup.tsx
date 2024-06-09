import React from 'react';
import { useSessionStore } from '@/stores/sessionStore';
import { useSettingsStore, EditableElement } from '@/stores/settingsStore';
import { ActionIcon, Tooltip } from '@mantine/core';
import { MdOutlineClose, MdOutlineEdit, MdOutlineSave } from 'react-icons/md';

const ActionIconsGroup = ({ fieldName }: { fieldName: string }) => {
  const { editingElement, setEditingElement, form } = useSettingsStore();

  const { session } = useSessionStore();

  return (
    <ActionIcon.Group>
      {editingElement !== fieldName && (
        <Tooltip label="Edit">
          <ActionIcon
            disabled={session?.status !== 'authenticated'}
            color="brightBlue.4"
            size="md"
            onClick={() => setEditingElement(fieldName as EditableElement)}
          >
            <MdOutlineEdit />
          </ActionIcon>
        </Tooltip>
      )}
      {editingElement === fieldName && (
        <>
          <Tooltip label="Cancel">
            <ActionIcon
              color="red.6"
              autoContrast={false}
              size="md"
              onClick={() => {
                setEditingElement(null);
                form.setValues({
                  username: '',
                  oldPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
              }}
            >
              <MdOutlineClose />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Save">
            <ActionIcon
              color="emerald.8"
              autoContrast={false}
              size="md"
              type="submit"
            >
              <MdOutlineSave />
            </ActionIcon>
          </Tooltip>
        </>
      )}
    </ActionIcon.Group>
  );
};

export default ActionIconsGroup;
