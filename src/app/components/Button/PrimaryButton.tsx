import * as React  from 'react';
import Button from '@mui/material/Button';
import './Button.scss'; // Import the external CSS file for styling

interface IButtonProps {
  label: string;
  onClick: (event: any) => void;
  className?: string;
}

export const PrimaryButton = ({ label, onClick, className }: IButtonProps) => {
  return (
    <Button color='primary' onClick={onClick}>
      {label}
    </Button>
  );
};
