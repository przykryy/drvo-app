import React from 'react';
import './offer.scss';
import { Unit } from 'app/models';
import { useSearchParams } from 'react-router-dom';
interface IItemProps {
  parameter: Parameter;
  onChange: (value: string) => void;
}

type Parameter = {
  name: string;
  description: string;
  unit: string;
  price: number;
  quantity: string;
}

const parameters: Parameter[] = [
  {
    name: "lakierowanie_olejowanie",
    description: "Lakierowanie lub olejowanie.",
    unit: Unit.Szt,
    price: 0,
    quantity: "",
  },
  {
    name: "bejca",
    description: "Bejcowanie na wybrany kolor.",
    unit: Unit.Szt,
    price: 50,
    quantity: "",
  },
  {
    name: "stopnie_beton_1m",
    description: "Stopnie mocowane do betonu wąskie schody do 1m.",
    unit: Unit.Szt,
    price: 550,
    quantity: "",
  },
  {
    name: "stopnie_beton_1.25m",
    description: "Stopnie mocowane do betonu schody o szerokości od 1m do 1.25m.",
    unit: Unit.Szt,
    price: 620,
    quantity: "",
  },
  {
    name: "stopnie_beton_1.5m",
    description: "Stopnie mocowane do betonu schody o szerokości od 1.26m do 1.5m.",
    unit: Unit.Szt,
    price: 750,
    quantity: "",
  },
  {
    name: "stopnie_beton_1.5m_plus",
    description: "Stopnie mocowane do betonu schody o szerokości powyżej 1.5m.",
    unit: Unit.Szt,
    price: 931,
    quantity: "",
  },
  {
    name: "zabiegowe",
    description: "Dopłata za stopnie zabiegowe kształt trójkąta, trapezu.",
    unit: Unit.Szt,
    price: 375,
    quantity: "",
  },
  {
    name: "8cm_grubosc",
    description: "Dopłata za stopień 8cm grubości.",
    unit: Unit.Szt,
    price: 500,
    quantity: "",
  },
  {
    name: "zapraszajace_polkragle",
    description: "Dopłata za stopnie zapraszające półokrągłe.",
    unit: Unit.Szt,
    price: 588,
    quantity: "",
  },
  {
    name: "podest_1.39m",
    description: "Pole powierzchni podestu jeśli krótki do 1.39 m.",
    unit: Unit.M2,
    price: 1500,
    quantity: "",
  },
  {
    name: "podest_1.79m",
    description: "Pole powierzchni podestu jeśli długi 1.4 m do 1.79 m.",
    unit: Unit.M2,
    price: 1763,
    quantity: "",
  },
  {
    name: "podest_1.8m",
    description: "Pole powierzchni podestu jeśli bardzo długi powyżej 1.8 m.",
    unit: Unit.M2,
    price: 2063,
    quantity: "",
  },
  {
    name: "podest_berlinecka",
    description: "Podest wykonany z deski barlineckiej",
    unit: Unit.M2,
    price: 1050,
    quantity: "",
  },
  {
    name: "podstopnice_drewniane",
    description: "Ilośc podstopnic drewnianych.",
    unit: Unit.Szt,
    price: 270,
    quantity: "",
  },
  {
    name: "podstopnice_drewniane_dywanowe",
    description: "Ilość podstopnic drewnianych, pogrubianych schody dywanowe.",
    unit: Unit.Szt,
    price: 320,
    quantity: "",
  },
  {
    name: "podstopnice_mdf_lakier_polysk",
    description: "Ilośc podstopnic z MDF lakierowanego na połysk.",
    unit: Unit.Szt,
    price: 290,
    quantity: "",
  },
  {
    name: "podstopnice_mdf_lakier_mat",
    description: "Ilośc podstopnic z MDF lakierowanego na mat.",
    unit: Unit.Szt,
    price: 250,
    quantity: "",
  },
  {
    name: "podstopnice_szklo_lacobel",
    description: "Ilość podstopnic ze szkła lacobel klejonego na MDF.",
    unit: Unit.Szt,
    price: 350,
    quantity: "",
  },
  {
    name: "podstopnice_giete_drewno",
    description: "Ilość podstopnic z giętego drewna.",
    unit: Unit.Szt,
    price: 2500,
    quantity: "",
  },
  {
    name: "cokol_drewniane",
    description: "Cokoły drewniane listwy przy ścianach.",
    unit: Unit.Szt,
    price: 163,
    quantity: "",
  },
  {
    name: "cokoly_drewniane_45_stopni",
    description: "Cokoły drewniane zacinane na 45°.",
    unit: Unit.Szt,
    price: 190,
    quantity: "",
  },
  {
    name: "cokoly_mdf_lakier_polysk",
    description: "Cokoły z MDF na wysoki połysk.",
    unit: Unit.Szt,
    price: 150,
    quantity: "",
  },
  {
    name: "cokoly_szklo_lacobel",
    description: "Cokoły ze szkła lacobel.",
    unit: Unit.Szt,
    price: 350,
    quantity: "",
  },
  {
    name: "policzki_szeroka_deska",
    description: "Policzki przy ścianach szeroka deska zamiast cokołów. Ilość stopni.",
    unit: Unit.Szt,
    price: 500,
    quantity: "",
  },
  {
    name: "krawedz_stropu_katownik",
    description: "Obróbka krawędzi stropu kątownikiem drewnianym lub aluminiowym.",
    unit: Unit.Mb,
    price: 45,
    quantity: "",
  },
  {
    name: "krawedz_stropu_nakladka",
    description: "Obróbka krawędzi stropu nakładką z drewna.",
    unit: Unit.Mb,
    price: 500,
    quantity: "",
  },
  {
    name: "porecz_drewno",
    description: "Poręcz mocowana do ściany.",
    unit: Unit.Mb,
    price: 563,
    quantity: "",
  },
  {
    name: "balustrada_drewno_stal",
    description: "Balustrada w drewnie z tralkami metalowymi.",
    unit: Unit.Mb,
    price: 1450,
    quantity: "",
  },
  {
    name: "balustrada_spawana",
    description: "Balustrada spawana malowana proszkowo.",
    unit: Unit.Mb,
    price: 1650,
    quantity: "",
  },
  {
    name: "balustrada_drewniana",
    description: "Balustrada drewniana z tralkami kwadratowymi.",
    unit: Unit.Mb,
    price: 1750,
    quantity: "",
  },
  {
    name: "led_montaz",
    description: "Oświetlenie ledowe pod trepami sterowane czujnikiem ruchu. Ilośc stopni.",
    unit: Unit.Szt,
    price: 238,
    quantity: "",
  },
  {
    name: "led_bez_montazu",
    description: "Oświetlenie ledowe bez montażu elektryki. Ilośc stopni.",
    unit: Unit.Szt,
    price: 150,
    quantity: "",
  },
];


export const Offer = () => {
  const mergeSearchParams = (parameters: Parameter[], searchParams: { [x: string]: any; }) =>
    parameters.map(param => ({ ...param, quantity: searchParams[param.name] ?? "" }));

  const [searchParams, setSearchParams] = useSearchParams();
  const viewModel: Parameter[] = mergeSearchParams(parameters, Object.fromEntries(searchParams.entries())).filter(x => safeParseFloat(x.quantity) > 0);

  return (
    <div className='container'>
      <div className='flex-container'>
        <div className='company-info-container'>
          <img src={require("../../../assets/favicon.svg").default} className='company-logo'></img>
          <h3>Drvo</h3>
        </div>
        <div>
          <p>Kazimierz Przybyłek</p>
          <p>Oleksin 13, 08-130 Kotuń</p>
          <p>tel: <a href="tel:+48509296202" >509 296 202</a></p>
        </div>
      </div>
      <h2 style={{justifyContent: 'space-between', textAlign: 'center'}}>Oferta usługi montażu schodów</h2>
      <table>
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
          <tr>
            <th colSpan={4} style={{textAlign: 'right'}}>Suma:</th>
            <th className="footer" id="summary">{SumCost()} zł</th>
          </tr>
        </tfoot>
        <tbody id="content">
          {viewModel.map((parameter: Parameter, index: React.Key) => (
            <ItemCalculator
              key={index}
              parameter={parameter}
              onChange={onChangeQuantity(parameter)} />
          ))}
        </tbody>
      </table>
    </div>
  );

  function onChangeQuantity(item: Parameter): (value: string) => void {
    return (quantity) => {
      setSearchParams(sp => {
        sp.set(item.name, quantity.replace(",", ".").toString());
        return sp;
      });
    };
  }

  function SumCost(): number {
    return Math.floor(viewModel.map(x => x.price * safeParseFloat(x.quantity)).reduce((previous, current) => current + previous));
  }
};

const ItemCalculator = (props: IItemProps) => {
  const { parameter: { description, unit, price, quantity } } = props;
  return (
    <tr>
      <td>{description}</td>
      <td>{unit}</td>
      <td>{price}</td>
      <td>{quantity}</td>
      <td>{Math.floor(safeParseFloat(quantity) * price)}</td>
    </tr>
  );
};

function safeParseFloat(value: string) {
  const val = parseFloat(value);
  return isNaN(val) ? 0 : val;
}