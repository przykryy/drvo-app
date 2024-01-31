import React from 'react';
import './calculator.scss';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../../components/Button/PrimaryButton';
import { Parameter, parameters } from 'app/resources/parameters';

interface IItemProps {
  parameter: Parameter;
  onChange: (value: string) => void;
}


export const Calculator = () => {
  const mergeSearchParams = (parameters: Parameter[], searchParams: { [x: string]: any; }) =>
    parameters.map(param => ({ ...param, quantity: searchParams[param.name] ?? "" }));

  const [searchParams, setSearchParams] = useSearchParams();
  const viewModel: Parameter[] = mergeSearchParams(parameters, Object.fromEntries(searchParams.entries()));
  const navigate = useNavigate();

  return (
    <div className='app'>
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
          <tr >
            <th colSpan={4} style={{ textAlign: 'right' }}>Suma:</th>
            <th className="footer" id="summary">{SumCost()} zł</th>
          </tr>
          <tr className="desktop">
            <th colSpan={5}>
            <PrimaryButton  label={"Wygeneruj oferte"} onClick={() => {
              if (searchParams.toString() !== "")
                navigate({ pathname: "oferta", search: searchParams.toString() });
              else alert("Brak wybranych parametrów")
            }}></PrimaryButton>
            </th>
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

      {/* <table className="print">
        <tr >
          <th colSpan={2}></th>
          <th colSpan={2}>Razem cena BRUTTO:</th>
          <th className="footer" id="summary">{SumCost()} zł</th>
        </tr>
      </table> */}
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
  const { parameter: { name, description, unit, price, quantity }, onChange } = props;
  return (
    <tr>
      <td>{description}</td>
      <td>{unit}</td>
      <td>{price}</td>
      <td>
        <input
          style={{ textAlign: 'center' }}
          value={quantity}
          onChange={event => onChange(event.target.value)}
          name={name}
          size={2}
          type="num"
        />
      </td>
      <td>{Math.floor(safeParseFloat(quantity) * price)}</td>
    </tr>
  );
};

function safeParseFloat(value: string) {
  const val = parseFloat(value);
  return isNaN(val) ? 0 : val;
}