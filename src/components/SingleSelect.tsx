import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect } from 'react';
import { SelectMenuProps } from '../types';

export interface SingleSelectProps {
  data: SelectMenuProps[];
  handleChange: (e: string) => void;
}

export default function SingleSelect({ data, handleChange }: SingleSelectProps) {
  const [category, setCategory] = React.useState<string>('');

  useEffect(() => {
    if (data.length === 0) {
      setCategory('');
    }
  }, [data]);

  const onChange = (event: SelectChangeEvent) => {
    handleChange(event.target.value);
    setCategory(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, marginTop: '1em', marginBottom: '1em' }}>
      <FormControl fullWidth>
        <Select value={category} onChange={onChange}>
          {data.map((e) => (
            <MenuItem key={e.label} value={e.value}>
              {e.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
