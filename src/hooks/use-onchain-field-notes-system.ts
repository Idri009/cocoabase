import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createFieldNote,
  type FieldNote,
} from '@/lib/onchain-field-notes-system-utils';

export function useOnchainFieldNotesSystem() {
  const { address } = useAccount();
  const [notes, setNotes] = useState<FieldNote[]>([]);

  const createNote = async (
    plantationId: bigint,
    note: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const fieldNote = createFieldNote(address, plantationId, note);
    setNotes([...notes, fieldNote]);
  };

  return { notes, createNote, address };
}
