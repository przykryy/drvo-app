import React, { useMemo, useCallback } from 'react';
import './offer.scss';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { Parameter, parameters } from 'app/resources/parameters';
import { formatCurrency } from '../../utils/formatters';
import { MdArrowBack, MdPrint } from 'react-icons/md';

// Enhanced type with pre-calculated values to avoid repeated parsing
interface ProcessedParameter extends Parameter {
  quantity: string;
  parsedQuantity: number;
  totalPrice: number;
}

interface IOfferItemProps {
  parameter: ProcessedParameter;
}

interface IOfferProps {
  className?: string;
}

// Memoized utility function - only recreated if needed
const safeParseFloat = (value: string): number => {
  if (!value || value.trim() === '') return 0;
  const normalizedValue = value.replace(',', '.');
  const parsed = parseFloat(normalizedValue);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
};

// Enhanced merging function that pre-calculates all values
const mergeSearchParams = (
  parameters: Parameter[], 
  searchParams: URLSearchParams
): ProcessedParameter[] => {
  const paramsMap = Object.fromEntries(searchParams.entries());
  
  return parameters
    .map(param => {
      const quantity = paramsMap[param.name] ?? "";
      const parsedQuantity = safeParseFloat(quantity);
      
      return { 
        ...param, 
        quantity,
        parsedQuantity,
        totalPrice: Math.floor(parsedQuantity * param.price)
      };
    })
    .filter(param => param.parsedQuantity > 0);
};

// Memoized date formatter to avoid repeated Date operations
const getCurrentDate = (() => {
  const date = new Date();
  return {
    formatted: date.toLocaleDateString('pl-PL'),
    timestamp: date.getTime().toString().slice(-6)
  };
})();

export const Offer: React.FC<IOfferProps> = ({ className }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Process parameters with pre-calculated values
  const processedParameters = useMemo(() => 
    mergeSearchParams(parameters, searchParams),
    [searchParams]
  );

  // Calculate totals and discount
  const { subtotal, discountPercent, totalCost } = useMemo(() => {
    const base = processedParameters.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountRaw = searchParams.get('rabat') ?? '';
    const parsed = clampPercentage(safeParseFloat(discountRaw));
    const discounted = Math.floor(base * Math.max(0, (100 - parsed)) / 100);
    return { subtotal: Math.floor(base), discountPercent: parsed, totalCost: discounted };
  }, [processedParameters, searchParams]);

  const [discountError, setDiscountError] = React.useState(false);

  const onChangeDiscount = useCallback((value: string) => {
    const normalized = value.replace(',', '.');
    const isValid = /^\d*\.?\d*$/.test(normalized);
    const percent = safeParseFloat(normalized);
    const withinRange = percent >= 0 && percent <= 100;
    setDiscountError(!(isValid && withinRange));

    if (isValid && withinRange) {
      setSearchParams(sp => {
        const newSp = new URLSearchParams(sp);
        if (value === '' || safeParseFloat(value) === 0) {
          newSp.delete('rabat');
        } else {
          newSp.set('rabat', value.replace(',', '.'));
        }
        return newSp;
      });
    }
  }, [setSearchParams]);

  // Memoized print handler to prevent unnecessary re-renders
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Early return if no parameters to display
  if (processedParameters.length === 0) {
    return (
      <div className={`offer-container ${className || ''}`}>
        <div className="offer-header">
          <Link 
            to={`/kalkulator${location.search}`} 
            className="back-link"
            aria-label="Powrót"
          >
            <MdArrowBack size={20} />
            Powrót
          </Link>
        </div>
        <div className="empty-state">
          <p>Brak parametrów do wyświetlenia w ofercie.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`offer-container ${className || ''}`}>
      <OfferHeader 
        location={location}
        onPrint={handlePrint}
      />

      <CompanySection />

      <h2 className="offer-title">Oferta usługi montażu schodów</h2>

      <OfferTable 
        parameters={processedParameters}
        subtotal={subtotal}
        discountPercent={discountPercent}
        totalCost={totalCost}
        discountInputValue={searchParams.get('rabat') ?? ''}
        onChangeDiscount={onChangeDiscount}
        discountError={discountError}
      />

      <OfferFooter />
    </div>
  );
};

// Extracted header component for better organization
const OfferHeader: React.FC<{
  location: ReturnType<typeof useLocation>;
  onPrint: () => void;
}> = React.memo(({ location, onPrint }) => (
  <div className='offer-header'>
    <Link 
      to={`/kalkulator${location.search}`} 
      className="back-link"
      aria-label="Powrót"
    >
      <MdArrowBack size={20} />
      Powrót
    </Link>
    <button 
      onClick={onPrint}
      className="print-button"
      aria-label="Drukuj"
    >
      <MdPrint size={20} />
      Drukuj
    </button>
  </div>
));

// Extracted company section for better maintainability
const CompanySection: React.FC = React.memo(() => (
  <div className='company-section'>
    <div className='company-info'>
      <img 
        src="/favicon.svg" 
        alt="Drvo logo" 
        className="company-logo"
        loading="lazy"
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
        Data wystawienia: {getCurrentDate.formatted}
      </p>
    </div>
  </div>
));

// Extracted table component with improved accessibility
const OfferTable: React.FC<{
  parameters: ProcessedParameter[];
  subtotal: number;
  discountPercent: number;
  totalCost: number;
  discountInputValue: string;
  onChangeDiscount: (value: string) => void;
  discountError: boolean;
}> = React.memo(({ parameters, subtotal, discountPercent, totalCost, discountInputValue, onChangeDiscount, discountError }) => (
  <div className="table-container" role="region" aria-label="Szczegóły oferty">
    <table role="table" aria-label="Tabela parametrów i kosztów">
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
        {parameters.map((parameter) => (
          <OfferItem
            key={parameter.name}
            parameter={parameter}
          />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th className='total-label' scope="row" colSpan={4}>Suma:</th>
          <td className="total-value" aria-live="polite">
            {formatCurrency(subtotal)}
          </td>
        </tr>
        {discountPercent > 0 && (
          <>
            <tr>
              <th className='total-label' scope="row" colSpan={4}>Rabat (%):</th>
              <td>
                <input
              id={`offer-input-rabat`}
              className={`quantity-input ${discountError ? 'input-error' : ''}`}
              value={discountInputValue}
              onChange={event => onChangeDiscount(event.target.value)}
              name={'rabat'}
              type="text"
              inputMode="decimal"
                  pattern="[0-9]*[.,?[0-9]*"
              aria-label={`Rabat procentowy`}
              aria-invalid={discountError}
              placeholder="0"
            />
            {discountError && (
              <div className="error-message" role="alert">
                Podaj wartość 0-100
              </div>
            )}
          </td>
        </tr>
        <tr>
          <th className='total-label' scope="row" colSpan={4}>Suma po rabacie:</th>
          <td className="total-value" aria-live="polite">
            {formatCurrency(totalCost)}
          </td>
        </tr>
          </>
        )}
      </tfoot>
    </table>
  </div>
));

// Extracted footer component
const OfferFooter: React.FC = React.memo(() => (
  <div className="offer-footer">
    <div className="terms">
      <h3>Warunki oferty:</h3>
      <ul>
        <li>Oferta ważna przez 30 dni od daty wystawienia</li>
        <li>Termin realizacji do uzgodnienia</li>
        <li>Ceny zawierają usługę montażu</li>
        <li>Transport na terenie województwa mazowieckiego gratis</li>
      </ul>
    </div>
  </div>
));

// Optimized OfferItem using pre-calculated values
const OfferItem: React.FC<IOfferItemProps> = React.memo(({ parameter }) => {
  const { description, unit, price, quantity, totalPrice } = parameter;
  
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

// helpers
const clampPercentage = (value: number): number => {
  if (!isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
};

// Set display names for better debugging
OfferHeader.displayName = 'OfferHeader';
CompanySection.displayName = 'CompanySection';
OfferTable.displayName = 'OfferTable';
OfferFooter.displayName = 'OfferFooter';
OfferItem.displayName = 'OfferItem';