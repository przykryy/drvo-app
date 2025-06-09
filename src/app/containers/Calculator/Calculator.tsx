import React, { useState, useCallback, useMemo } from 'react';
import './calculator.scss';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../../components/Button/PrimaryButton';
import { Parameter, parameters } from 'app/resources/parameters';
import { ErrorModal } from 'app/components/ErrorModal/ErrorModal';

interface IItemProps {
  parameter: Parameter;
  onChange: (value: string) => void;
}

interface ICalculatorProps {
  className?: string;
}

export const Calculator: React.FC<ICalculatorProps> = ({ className }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [inputErrors, setInputErrors] = useState<Record<string, boolean>>({});

  // Memoized view model to prevent unnecessary recalculations
  const viewModel = useMemo(() => {
    return parameters.map(param => ({
      ...param,
      quantity: searchParams.get(param.name) ?? ""
    }));
  }, [searchParams]);

  // Memoized total cost calculation
  const totalCost = useMemo(() => {
    return Math.floor(viewModel.reduce((total, item) => 
      total + (item.price * safeParseFloat(item.quantity)), 0));
  }, [viewModel]);

  const hasValidInputs = useMemo(() => {
    return viewModel.some(item => safeParseFloat(item.quantity) > 0);
  }, [viewModel]);

  const handleGenerateOffer = useCallback(() => {
    if (hasValidInputs) {
      navigate({ pathname: "/oferta", search: searchParams.toString() });
    } else {
      setIsErrorModalOpen(true);
    }
  }, [hasValidInputs, navigate, searchParams]);

  const onChangeQuantity = useCallback((item: Parameter) => {
    return (quantity: string) => {
      // Validate input
      const isValid = validateInput(quantity);
      setInputErrors(prev => ({ ...prev, [item.name]: !isValid }));

      if (isValid) {
        setSearchParams(sp => {
          const newSp = new URLSearchParams(sp);
          if (quantity === '' || safeParseFloat(quantity) === 0) {
            newSp.delete(item.name);
          } else {
            newSp.set(item.name, quantity.replace(",", "."));
          }
          return newSp;
        });
      }
    };
  }, [setSearchParams]);

  return (
    <div className={`calculator-container ${className || ''}`}>
      <h1 className="calculator-title">Kalkulator kosztów</h1>
      
      <div className="table-wrapper">
        <table role="grid" aria-label="Kalkulator parametrów i kosztów">
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
              <ItemCalculator
                key={parameter.name}
                parameter={parameter}
                onChange={onChangeQuantity(parameter)}
                hasError={inputErrors[parameter.name]}
              />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={4} scope="row" className="total-label" data-label="Suma">
                Suma:
              </th>
              <td className="total-value" aria-live="polite">
                {formatCurrency(totalCost)}
              </td>
            </tr>
            <tr className="desktop">
              <td colSpan={5} className="action-cell">
                <PrimaryButton
                  id="generate-offer-button"
                  className="generate-offer-button"
                  label="Wygeneruj ofertę"
                  onClick={handleGenerateOffer}
                  disabled={!hasValidInputs}
                  aria-label="Wygeneruj ofertę na podstawie wprowadzonych parametrów"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mobile-action">
        <PrimaryButton
          id="generate-offer-button-mobile"
          className="generate-offer-button"
          label="Wygeneruj ofertę"
          onClick={handleGenerateOffer}
          disabled={!hasValidInputs}
          aria-label="Wygeneruj ofertę na podstawie wprowadzonych parametrów"
        />
      </div>

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        errorMessage="Proszę wprowadzić parametry przed wygenerowaniem oferty."
      />
    </div>
  );
};

interface IItemCalculatorProps extends IItemProps {
  hasError?: boolean;
}

const ItemCalculator: React.FC<IItemCalculatorProps> = React.memo(({ 
  parameter: { name, description, unit, price, quantity }, 
  onChange,
  hasError 
}) => {
  const totalPrice = useMemo(() => 
    Math.floor(safeParseFloat(quantity) * price), 
    [quantity, price]
  );

  return (
    <tr>
      <td data-label="Parametr">
        <label htmlFor={`input-${name}`} className="parameter-label">
          {description}
        </label>
      </td>
      <td data-label="Jednostka">{unit}</td>
      <td data-label="Cena">{formatCurrency(price)}</td>
      <td data-label="Liczba">
        <input
          id={`input-${name}`}
          className={`quantity-input ${hasError ? 'input-error' : ''}`}
          value={quantity}
          onChange={event => onChange(event.target.value)}
          name={name}
          type="text"
          inputMode="decimal"
          pattern="[0-9]*[.,]?[0-9]*"
          aria-label={`Liczba dla ${description}`}
          aria-invalid={hasError}
          placeholder="0"
        />
        {hasError && (
          <div className="error-message" role="alert">
            Nieprawidłowa wartość
          </div>
        )}
      </td>
      <td data-label="Cena usługi">{formatCurrency(totalPrice)}</td>
    </tr>
  );
});

ItemCalculator.displayName = 'ItemCalculator';

// Utility functions
const safeParseFloat = (value: string): number => {
  if (!value || value.trim() === '') return 0;
  const normalizedValue = value.replace(',', '.');
  const parsed = parseFloat(normalizedValue);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
};

const validateInput = (value: string): boolean => {
  const normalizedValue = value.replace(',', '.');
  return /^\d*\.?\d*$/.test(normalizedValue) && parseFloat(normalizedValue) >= 0;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};