import React from 'react';
import { RouteComponentProps } from 'react-router';
import './style.css';

export namespace App {
  export interface Props extends RouteComponentProps<void> { }
}

interface Items {
  [key: string]: number | undefined
}

interface IItemProps {
  name: string;
  description: string;
  unit: string;
  price: number;
  quantity?: number;
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
    price: 718,
    quantity: 0,
  },
  {
    name: "zabiegowe",
    description: "Dopłata za stopnie zabiegowe kształt trójkąta, trapezu.",
    unit: "szt",
    price: 718,
    quantity: 0,
  },
  {
    name: "8cm_grubosc",
    description: "Dopłata za stopień 8cm grubości.",
    unit: "szt",
    price: 718,
    quantity: 0,
  },
  
];

export const App = () => {
  const [state, setState] = React.useState({ 
    "lakierowanie-lub-olejowanie": 0,
    "bejca": 0,
    "stopnie-beton-1m": 0,
    "stopnie-beton-1.25m": 0,
  } as Items);

  return (
    <div className="calculator">
      <table id="calculator" >
        <thead>
          <tr>
            <th>Parametry</th>
            <th>J.m.</th>
            <th>Cena jedn.</th>
            <th>Ilość</th>
            <th>Cena usługi</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th colSpan={4}>Razem cena BRUTTO:</th>
            <th id="summary">0</th>
          </tr>
        </tfoot>
        <tbody>
          <ItemCalculator
            description="Lakierowanie lub olejowanie."
            name="lakierowanie-lub-olejowanie"
            price={0}
            quantity={state["lakierowanie-lub-olejowanie"]}
            onChange={value => setState({ ...state, "lakierowanie-lub-olejowanie": value })}
            unit="szt"
            key="lakierowanie-lub-olejowanie"
          />
          <ItemCalculator
            description="Bejcowanie na wybrany kolor."
            name="bejca"
            quantity={state["bejca"]}
            onChange={value => setState({ ...state, "bejca": value })}
            price={80}
            unit="szt"
            key="bejca"
          />
          <ItemCalculator
            description="Stopnie mocowane do betonu wąskie schody do 1m."
            name="stopnie-beton-1m"
            quantity={state["stopnie-beton-1m"]}
            onChange={value => setState({ ...state, "stopnie-beton-1m": value })}
            price={500}
            unit="szt"
            key="stopnie-beton-1m"
          />
          <ItemCalculator
            description="Stopnie mocowane do betonu schody o szerokości od 1m do 1.25m."
            name="stopnie-beton-1.25m"
            quantity={state["stopnie-beton-1.25m"]}
            onChange={value => setState({ ...state, "stopnie-beton-1.25m": value })}
            price={500}
            unit="szt"
            key="stopnie-beton-1.25m"
          />
          <tr>
            <td>Stopnie mocowane do betonu schody o szerokości od 1.26m do 1.5m</td>
            <td>szt</td>
            <td>718.00</td>
            <td><input name="gadzie-gipsowe" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Stopnie mocowane do betonu schody o szerokości powyżej 1.5m</td>
            <td>szt</td>
            <td>931.00</td>
            <td><input name="gadzie-gipsowe" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Dopłata za stopnie zabiegowe kształt trójkąta, trapezu</td>
            <td>szt</td>
            <td>375.00</td>
            <td><input name="malowanie" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Dopłata za stopień 8cm grubości</td>
            <td>szt</td>
            <td>500.00</td>
            <td><input name="malowanie" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Dopłata za stopnie zapraszające półokrągłe</td>
            <td>szt</td>
            <td>588.00</td>
            <td><input name="malowanie" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Pole powierzchni podestu jeśli krótki do 1,39 m.</td>
            <td>m<sup>2</sup></td>
            <td>1500.00</td>
            <td><input name="kafelkowanie" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Pole powierzchni podestu jeśli długi 1,4 m do 1,79 m.</td>
            <td>m<sup>2</sup></td>
            <td>1763.00</td>
            <td><input name="kafelkowanie" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Pole powierzchni podestu jeśli bardzo długi powyżej 1,8 m.</td>
            <td>m<sup>2</sup></td>
            <td>2063.00</td>
            <td><input name="kafelkowanie" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Ilośc podstopnic drewnianych</td>
            <td>szt</td>
            <td>238.00</td>
            <td><input name="malowanie" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Ilość podstopnic drewnianych, pogrubianych schody dywanowe</td>
            <td>szt</td>
            <td>275.00</td>
            <td><input name="malowanie" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Ilośc podstopnic z MDF lakierowanego na połysk</td>
            <td>szt</td>
            <td>290.00</td>
            <td><input name="malowanie" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Ilośc podstopnic z MDF lakierowanego na mat</td>
            <td>szt</td>
            <td>250.00</td>
            <td><input name="malowanie" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Ilość podstopnic ze szkła lacobel klejonego na MDF</td>
            <td>szt</td>
            <td>333.00</td>
            <td><input name="malowanie" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Ilość podstopnic z giętego drewna</td>
            <td>szt</td>
            <td>2500.00</td>
            <td><input name="malowanie" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Cokoły drewniane listwy przy ścianach. Ilośc stopni</td>
            <td>szt</td>
            <td>163.00</td>
            <td><input name="montaz-okien" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Cokoły drewniane zacinane na 45°. Ilośc stopni</td>
            <td>szt</td>
            <td>300.00</td>
            <td><input name="montaz-okien" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Cokoły z MDF w polerkach na wysoki połysk. Ilośc stopni</td>
            <td>szt</td>
            <td>300.00</td>
            <td><input name="montaz-okien" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Cokoły ze szkła lacobel. Ilośc stopni</td>
            <td>szt</td>
            <td>350.00</td>
            <td><input name="montaz-okien" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Cokoły ze sztucznego kamienia kerrock. Ilośc stopni</td>
            <td>szt</td>
            <td>375.00</td>
            <td><input name="montaz-okien" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Policzki przy ścianach szeroka deska zamiast cokołów. Ilość stopni</td>
            <td>szt</td>
            <td>500.00</td>
            <td><input name="montaz-okien" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Obróbka krawędzi stropu kątownikiem drewnianym lub aluminiowym</td>
            <td>mb</td>
            <td>38.00</td>
            <td><input name="montaz-okien" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Obróbka krawędzi stropu nakładką z drewna i listwą z boku</td>
            <td>mb</td>
            <td>500.00</td>
            <td><input name="montaz-okien" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Poręcz mocowana do ściany</td>
            <td>mb</td>
            <td>563.00</td>
            <td><input name="montaz-okien" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Balustrada w drewnie i stali nierdzewnej</td>
            <td>mb</td>
            <td>1400.00</td>
            <td><input name="montaz-okien" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Balustrada spawana malowana proszkowo</td>
            <td>mb</td>
            <td>1500.00</td>
            <td><input name="montaz-okien" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Balustrada drewniana z tralkami kwadratowymi</td>
            <td>mb</td>
            <td>1750.00</td>
            <td><input name="montaz-okien" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Oświetlenie ledowe pod trepami sterowane czujnikiem ruchu. Ilośc stopni</td>
            <td>szt</td>
            <td>238.00</td>
            <td><input name="gadzie-gipsowe" size={5} type="text" /></td>
            <td>0</td>
          </tr>
          <tr>
            <td>Oświetlenie ledowe bez montażu elektryki. Ilośc stopni</td>
            <td>szt</td>
            <td>55.00</td>
            {/* <td><input defaultValue="44.00" name="gadzie-gipsowe-cena" size={5} type="text"/></td> */}
            <td><input name="gadzie-gipsowe" size={5} type="text" /></td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};


const ItemCalculator = (props: IItemProps) => {
  return (
    <tr>
      <td>{props.description}</td>
      <td>{props.unit}</td>
      <td>{props.price}</td>
      <td>
        <input
          value={props.quantity}
          onChange={event => props.onChange(parseInt(event.target.value, 10))}
          name={name}
          size={5}
          type="text"
        />
      </td>
      <td>{props.quantity! * props.price}</td>
    </tr>
  );
};