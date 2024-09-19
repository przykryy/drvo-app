import * as React  from 'react';
import './Button.scss'; // Import the external CSS file for styling

interface IButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  label?: string;
  className?: string;
  id?: string;
}

export const PrimaryButton: React.FC<IButtonProps> = ({ onClick, children, label, className, id }) => {
  return (
    <button className={`custom-button ${className || ''}`} onClick={onClick} id={id}>
      {label || children}
    </button>
  );
};
