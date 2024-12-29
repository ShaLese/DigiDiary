import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DiaryEntry } from '../types';
import EntryForm from './EntryForm';

interface EntryEditProps {
  entries: DiaryEntry[];
  onSave: (entry: DiaryEntry) => void;
}

export default function EntryEdit({ entries, onSave }: EntryEditProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const entry = entries.find(e => e.id === id);

  useEffect(() => {
    if (!entry) {
      navigate('/entries');
    }
  }, [entry, navigate]);

  if (!entry) {
    return null;
  }

  return <EntryForm initialEntry={entry} onSave={onSave} />;
}