import React from 'react';
import { RouteComponentProps } from 'react-router';
import './style.css';

export namespace App {
  export interface Props extends RouteComponentProps<void> { }
}

interface IItemProps {
  name: string;
  description: string;
  unit: string;
  price: number;
  quantity: number;
  onChange: (value: number) => void;
}

const parameters = [
  {
    name: "lakierowanie_olejowanie",
    description: "Lakierowanie lub olejowanie.",
    unit: "szt",
    price: 0,
    quantity: 0,
  },
  {
    name: "bejca",
    description: "Bejcowanie na wybrany kolor.",
    unit: "szt",
    price: 80,
    quantity: 0,
  },
  {
    name: "stopnie_beton_1m",
    description: "Stopnie mocowane do betonu wąskie schody do 1m.",
    unit: "szt",
    price: 500,
    quantity: 0,
  },
  {
    name: "stopnie_beton_1.25m",
    description: "Stopnie mocowane do betonu schody o szerokości od 1m do 1.25m.",
    unit: "szt",
    price: 500,
    quantity: 0,
  },
  {
    name: "stopnie_beton_1.5m",
    description: "Stopnie mocowane do betonu schody o szerokości od 1.26m do 1.5m.",
    unit: "szt",
    price: 718,
    quantity: 0,
  },
  {
    name: "stopnie_beton_1.5m+",
    description: "Stopnie mocowane do betonu schody o szerokości powyżej 1.5m.",
    unit: "szt",
    price: 931,
    quantity: 0,
  },
  {
    name: "zabiegowe",
    description: "Dopłata za stopnie zabiegowe kształt trójkąta, trapezu.",
    unit: "szt",
    price: 375,
    quantity: 0,
  },
  {
    name: "8cm_grubosc",
    description: "Dopłata za stopień 8cm grubości.",
    unit: "szt",
    price: 500,
    quantity: 0,
  },
  {
    name: "zapraszajace_polkragle",
    description: "Dopłata za stopnie zapraszające półokrągłe.",
    unit: "szt",
    price: 588,
    quantity: 0,
  },
  {
    name: "podest_1.39m",
    description: "Pole powierzchni podestu jeśli krótki do 1.39 m.",
    unit: "m2",
    price: 1500,
    quantity: 0,
  },
  {
    name: "podest_1.79m",
    description: "Pole powierzchni podestu jeśli długi 1.4 m do 1.79 m.",
    unit: "m2",
    price: 1763,
    quantity: 0,
  },
  {
    name: "podest_1.8m",
    description: "Pole powierzchni podestu jeśli bardzo długi powyżej 1.8 m.",
    unit: "m2",
    price: 2063,
    quantity: 0,
  },
  {
    name: "podstopnice_drewniane",
    description: "Ilośc podstopnic drewnianych.",
    unit: "szt",
    price: 238,
    quantity: 0,
  },
  {
    name: "podstopnice_drewniane_dywanowe",
    description: "Ilość podstopnic drewnianych, pogrubianych schody dywanowe.",
    unit: "szt",
    price: 275,
    quantity: 0,
  },
  {
    name: "podstopnice_mdf_lakier_polysk",
    description: "Ilośc podstopnic z MDF lakierowanego na połysk.",
    unit: "szt",
    price: 290,
    quantity: 0,
  },
  {
    name: "podstopnice_mdf_lakier_mat",
    description: "Ilośc podstopnic z MDF lakierowanego na mat.",
    unit: "szt",
    price: 250,
    quantity: 0,
  },
  {
    name: "podstopnice_szklo_lacobel",
    description: "Ilość podstopnic ze szkła lacobel klejonego na MDF.",
    unit: "szt",
    price: 333,
    quantity: 0,
  },
  {
    name: "podstopnice_giete_drewno",
    description: "Ilość podstopnic z giętego drewna.",
    unit: "szt",
    price: 2500,
    quantity: 0,
  },
  {
    name: "cokol_drewniane",
    description: "Cokoły drewniane listwy przy ścianach. Ilośc stopni.",
    unit: "szt",
    price: 163,
    quantity: 0,
  },
  {
    name: "cokoly_drewniane_45_stopni",
    description: "Cokoły drewniane zacinane na 45°. Ilośc stopni.",
    unit: "szt",
    price: 300,
    quantity: 0,
  },
  {
    name: "cokoly_mdf_lakier_polysk",
    description: "Cokoły z MDF w polerkach na wysoki połysk. Ilośc stopni.",
    unit: "szt",
    price: 300,
    quantity: 0,
  },
  {
    name: "cokoly_szklo_lacobel",
    description: "Cokoły ze szkła lacobel. Ilośc stopni.",
    unit: "szt",
    price: 350,
    quantity: 0,
  },
  {
    name: "cokoly_kerrock",
    description: "Cokoły ze sztucznego kamienia kerrock. Ilośc stopni.",
    unit: "szt",
    price: 375,
    quantity: 0,
  },
  {
    name: "policzki_szeroka_deska",
    description: "Policzki przy ścianach szeroka deska zamiast cokołów. Ilość stopni.",
    unit: "szt",
    price: 500,
    quantity: 0,
  },
  {
    name: "krawedz_stropu_katownik",
    description: "Obróbka krawędzi stropu kątownikiem drewnianym lub aluminiowym.",
    unit: "mb",
    price: 38,
    quantity: 0,
  },
  {
    name: "krawedz_stropu_nakladka",
    description: "Obróbka krawędzi stropu nakładką z drewna i listwą z boku.",
    unit: "mb",
    price: 500,
    quantity: 0,
  },
  {
    name: "porecz_drewno",
    description: "Poręcz mocowana do ściany.",
    unit: "mb",
    price: 563,
    quantity: 0,
  },
  {
    name: "balustrada_drewno_stal",
    description: "Balustrada w drewnie i stali nierdzewnej.",
    unit: "mb",
    price: 1400,
    quantity: 0,
  },
  {
    name: "balustrada_spawana",
    description: "Balustrada spawana malowana proszkowo.",
    unit: "mb",
    price: 1500,
    quantity: 0,
  },
  {
    name: "balustrada_drewniana",
    description: "Balustrada drewniana z tralkami kwadratowymi.",
    unit: "mb",
    price: 1750,
    quantity: 0,
  },
  {
    name: "led_montaz",
    description: "Oświetlenie ledowe pod trepami sterowane czujnikiem ruchu. Ilośc stopni.",
    unit: "szt",
    price: 238,
    quantity: 0,
  },
  {
    name: "led_bez_montazu",
    description: "Oświetlenie ledowe bez montażu elektryki. Ilośc stopni.",
    unit: "szt",
    price: 55,
    quantity: 0,
  },
];

export const App = () => {
  const [state, setState] = React.useState(parameters);

  return (
    <div className="calculator">
      <table id="calculator" >
        <thead>
          <tr>
            <th>Parametry</th>
            <th>J.m.</th>
            <th>Cena</th>
            <th>Liczba</th>
            <th>Cena usługi</th>
          </tr>
        </thead>
        <tfoot>
          <tr >
            <th colSpan={2}></th>
            <th colSpan={2}>Razem cena BRUTTO:</th>
            <th className="footer" id="summary">{state.map(x => x.price * x.quantity).reduce((previous, current) => current + previous)} zł</th>
          </tr>
        </tfoot>
        <tbody>
          {state.map((item, index) => (
            <ItemCalculator
              key={index}
              {...item}
              onChange={(quantity) => {
                const newState = [...state];
                newState[index].quantity = quantity;
                setState(newState);
              }} />
          ))}
        </tbody>
      </table>
    </div>
  );
};


const ItemCalculator = (props: IItemProps) => {
  const { name, description, unit, price, quantity, onChange } = props;
  return (
    <tr>
      <td>{description}</td>
      <td>{unit}</td>
      <td>{price}</td>
      <td>
        <input
          value={quantity}
          onChange={event => onChange(parseInt(event.target.value, 10))}
          name={name}
          size={2}
          type="text"
        />
      </td>
      <td>{quantity * price}</td>
    </tr>
  );
};