import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { SelectMenuProps } from '../types';

interface MUISelectProps {
  disabled: boolean;
  data: SelectMenuProps[];
  handleChange: (e: string[]) => void;
}

export default function MultiSelect({ data, handleChange, disabled }: MUISelectProps) {
  const [selectedValue, setSelectedValue] = useState<string[]>([]);

  useEffect(() => {
    handleChange(selectedValue);
  }, [handleChange, selectedValue]);

  useEffect(() => {
    if (data.length === 0) {
      setSelectedValue([]);
    }
  }, [data]);

  const onChange = (event: SelectChangeEvent<typeof selectedValue>) => {
    const {
      target: { value },
    } = event;
    setSelectedValue(typeof value === 'string' ? value.split(',') : value);
    // handleChange(selectedValue);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select value={selectedValue} multiple onChange={(e) => onChange(e)} disabled={disabled}>
          {data.map((e) => (
            <MenuItem key={e.label} value={e.label}>
              {e.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
