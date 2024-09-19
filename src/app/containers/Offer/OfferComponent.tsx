import React, { useMemo, useCallback } from 'react';
import './offer.scss';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { Parameter, parameters } from 'app/resources/parameters';

interface IItemProps {
  parameter: Parameter;
  onChange: (value: string) => void;
}

const mergeSearchParams = (parameters: Parameter[], searchParams: { [x: string]: any; }) =>
  parameters.map(param => ({ ...param, quantity: searchParams[param.name] ?? "" }));

const safeParseFloat = (value: string) => {
  const val = parseFloat(value);
  return isNaN(val) ? 0 : val;
};

export const Offer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const viewModel = useMemo(() => {
    const mergedParams = mergeSearchParams(parameters, Object.fromEntries(searchParams.entries()));
    return mergedParams.filter(x => safeParseFloat(x.quantity) > 0);
  }, [searchParams]);

  const onChangeQuantity = useCallback((item: Parameter) => {
    return (quantity: string) => {
      setSearchParams(sp => {
        sp.set(item.name, quantity.replace(",", ".").toString());
        return sp;
      });
    };
  }, [setSearchParams]);

  const sumCost = useMemo(() => {
    return Math.floor(viewModel.reduce((sum, x) => sum + x.price * safeParseFloat(x.quantity), 0));
  }, [viewModel]);

  return (
    <div className='offer-container'>
      <Link to={`/kalkulator${location.search}`} className="back-link">
        Powrót do kalkulatora
      </Link>
      <div className='flex-container'>
        <div className='company-info-container'>
          <img src={require("../../../assets/favicon.svg").default} className='company-logo' alt="Logo firmy"></img>
          <h3>Drvo</h3>
        </div>
        <div className='contact-info'>
          <p>Kazimierz Przybyłek</p>
          <p>Oleksin 13, 08-130 Kotuń</p>
          <p>tel: <a href="tel:+48509296202">509 296 202</a></p>
          <p>email: <a href="mailto:kontakt@drvo.pl">kontakt@drvo.pl</a></p>
        </div>
      </div>
      <h2 className="offer-title">Oferta usługi montażu schodów</h2>
      <div className="table-container">
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
              <th colSpan={4}>Suma:</th>
              <th className="footer" id="summary">{sumCost} zł</th>
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
    </div>
  );
};

const ItemCalculator = React.memo((props: IItemProps) => {
  const { parameter: { description, unit, price, quantity } } = props;
  const cost = Math.floor(safeParseFloat(quantity) * price);
  
  return (
    <tr>
      <td>{description}</td>
      <td>{unit}</td>
      <td>{price}</td>
      <td>{quantity}</td>
      <td>{cost}</td>
    </tr>
  );
});