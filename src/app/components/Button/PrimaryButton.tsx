import * as React  from 'react';
import './Button.scss'; // Import the external CSS file for styling

interface IButtonProps {
  label: string;
  onClick: (event: any) => void;
  className?: string;
}

export const PrimaryButton = ({ label, onClick, className }: IButtonProps) => {
  return (
    <button className={`custom-button ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};
