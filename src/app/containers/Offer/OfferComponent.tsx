import React, { useMemo } from 'react';
import './offer.scss';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { Parameter, parameters } from 'app/resources/parameters';
import { formatCurrency } from '../../utils/formatters';

interface IOfferItemProps {
  parameter: Parameter & { quantity: string };
}

interface IOfferProps {
  className?: string;
}

const mergeSearchParams = (parameters: Parameter[], searchParams: URLSearchParams): Array<Parameter & { quantity: string }> => {
  const paramsMap = Object.fromEntries(searchParams.entries());
  return parameters
    .map(param => ({ 
      ...param, 
      quantity: paramsMap[param.name] ?? "" 
    }))
    .filter(param => safeParseFloat(param.quantity) > 0);
};

const safeParseFloat = (value: string): number => {
  if (!value || value.trim() === '') return 0;
  const normalizedValue = value.replace(',', '.');
  const parsed = parseFloat(normalizedValue);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
};

export const Offer: React.FC<IOfferProps> = ({ className }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const viewModel = useMemo(() => 
    mergeSearchParams(parameters, searchParams),
    [searchParams]
  );

  const totalCost = useMemo(() => 
    Math.floor(viewModel.reduce((sum, item) => 
      sum + item.price * safeParseFloat(item.quantity), 0)
    ),
    [viewModel]
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`offer-container ${className || ''}`}>
      <div className="offer-header">
        <Link 
          to={`/kalkulator${location.search}`} 
          className="back-link"
          aria-label="Powrót do kalkulatora"
        >
          Powrót do kalkulatora
        </Link>
        <button 
          onClick={handlePrint}
          className="print-button"
          aria-label="Drukuj ofertę"
        >
          Drukuj ofertę
        </button>
      </div>

      <div className='company-section'>
        <div className='company-info'>
          <img 
            src={require("../../../assets/favicon.svg").default} 
            className='company-logo' 
            alt="Logo firmy Drvo"
          />
          <div className="company-details">
            <h1 className="company-name">Drvo</h1>
            <div className='contact-info'>
              <p>Kazimierz Przybyłek</p>
              <p>Oleksin 13, 08-130 Kotuń</p>
              <p>
                <a href="tel:+48509296202" aria-label="Zadzwoń pod numer 509 296 202">
                  tel: 509 296 202
                </a>
              </p>
              <p>
                <a href="mailto:kontakt@drvo.pl" aria-label="Wyślij email na adres kontakt@drvo.pl">
                  email: kontakt@drvo.pl
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="offer-meta">
          <p className="offer-date">
            Data wystawienia: {new Date().toLocaleDateString('pl-PL')}
          </p>
          <p className="offer-number">
            Nr oferty: {new Date().getTime().toString().slice(-6)}
          </p>
        </div>
      </div>

      <h2 className="offer-title">Oferta usługi montażu schodów</h2>

      <div className="table-container" role="region" aria-label="Szczegóły oferty">
        <table role="grid" aria-label="Tabela parametrów i kosztów">
          <thead>
            <tr>
              <th scope="col">Parametry</th>
              <th scope="col">J.m.</th>
              <th scope="col">Cena</th>
              <th scope="col">Liczba</th>
              <th scope="col">Cena usługi</th>
            </tr>
          </thead>
          <tbody>
            {viewModel.map((parameter) => (
              <OfferItem
                key={parameter.name}
                parameter={parameter}
              />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={4}>Suma:</th>
              <td className="total-value" aria-live="polite">
                {formatCurrency(totalCost)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="offer-footer">
        <div className="terms">
          <h3>Warunki oferty:</h3>
          <ul>
            <li>Oferta ważna przez 30 dni od daty wystawienia</li>
            <li>Ceny zawierają podatek VAT</li>
            <li>Termin realizacji do uzgodnienia</li>
          </ul>
        </div>
        <div className="signature">
          <p>Podpis osoby upoważnionej</p>
          <div className="signature-line"></div>
        </div>
      </div>
    </div>
  );
};

const OfferItem: React.FC<IOfferItemProps> = React.memo(({ parameter }) => {
  const { description, unit, price, quantity } = parameter;
  const totalPrice = Math.floor(safeParseFloat(quantity) * price);
  
  return (
    <tr>
      <td data-label="Parametr">{description}</td>
      <td data-label="Jednostka">{unit}</td>
      <td data-label="Cena">{formatCurrency(price)}</td>
      <td data-label="Liczba">{quantity}</td>
      <td data-label="Cena usługi">{formatCurrency(totalPrice)}</td>
    </tr>
  );
});

OfferItem.displayName = 'OfferItem';