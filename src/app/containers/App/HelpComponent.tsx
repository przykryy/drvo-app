import React from 'react';
import './style.scss';


// interface IItemProps {
//   parameter: Parameter;
//   onChange: (value: string) => void;
// }

// type Parameter = {
//   name: string;
//   description: string;
//   unit: string;
//   price: number;
//   quantity: string;
// }

export const HelpComponent = () => {
    return (
        <div id="image-container">
            <img src="../../../assets/favicon.svg" alt="Opis obrazka" />

            <div id="info-box">
                <p>Tutaj umieść informację o obrazku.</p>
            </div>
        </div>
    );
}
