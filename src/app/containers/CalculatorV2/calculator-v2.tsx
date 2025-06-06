import React, { useState, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { parametersGrouped } from '../../resources/parameters';
import { PrimaryButton } from '../../components/Button/PrimaryButton';
import { ErrorModal } from '../../components/ErrorModal/ErrorModal';
import './parameters.scss';

interface ICalculatorV2Props {
  className?: string;
}

const CalculatorV2: React.FC<ICalculatorV2Props> = ({ className }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [inputErrors, setInputErrors] = useState<Record<string, boolean>>({});

  // Memoized selected parameters with quantities
  const selectedParameters = useMemo(() => {
    const params: Record<string, { name: string; quantity: string }> = {};
    Object.keys(parametersGrouped).forEach(group => {
      const paramName = searchParams.get(`${group}-name`) || '';
      const quantity = searchParams.get(`${group}-quantity`) || '';
      if (paramName) {
        params[group] = { name: paramName, quantity };
      }
    });
    return params;
  }, [searchParams]);

  // Calculate total cost
  const totalCost = useMemo(() => {
    return Object.entries(selectedParameters).reduce((total, [group, { name, quantity }]) => {
      if (!name) return total;
      const param = parametersGrouped[group].find(p => p.name === name);
      return total + (param?.price || 0) * safeParseFloat(quantity);
    }, 0);
  }, [selectedParameters]);

  const hasValidSelections = useMemo(() => {
    return Object.values(selectedParameters).some(({ name, quantity }) => 
      name && safeParseFloat(quantity) > 0
    );
  }, [selectedParameters]);

  const handleSelectChange = useCallback((group: string, value: string) => {
    setSearchParams(sp => {
      const newSp = new URLSearchParams(sp);
      if (!value) {
        newSp.delete(`${group}-name`);
        newSp.delete(`${group}-quantity`);
      } else {
        newSp.set(`${group}-name`, value);
        // Initialize quantity to 1 if not set
        if (!newSp.has(`${group}-quantity`)) {
          newSp.set(`${group}-quantity`, '1');
        }
      }
      return newSp;
    });
  }, [setSearchParams]);

  const handleQuantityChange = useCallback((group: string, quantity: string) => {
    // Validate input
    const isValid = validateInput(quantity);
    setInputErrors(prev => ({ ...prev, [group]: !isValid }));

    if (isValid) {
      setSearchParams(sp => {
        const newSp = new URLSearchParams(sp);
        if (quantity === '' || safeParseFloat(quantity) === 0) {
          newSp.delete(`${group}-quantity`);
        } else {
          newSp.set(`${group}-quantity`, quantity.replace(',', '.'));
        }
        return newSp;
      });
    }
  }, [setSearchParams]);

  const handleGenerateOffer = useCallback(() => {
    if (hasValidSelections) {
      navigate({ pathname: "/oferta", search: searchParams.toString() });
    } else {
      setIsErrorModalOpen(true);
    }
  }, [hasValidSelections, navigate, searchParams]);

  return (
    <div className={`calculator-v2-container ${className || ''}`}>
      <h1 className="calculator-title">Kalkulator parametrów</h1>
      
      <div className="parameters-wrapper">
        {Object.entries(parametersGrouped).map(([group, parameters]) => (
          <div key={group} className="parameter-group">
            <label htmlFor={`select-${group}`} className="parameter-label">
              {group.charAt(0).toUpperCase() + group.slice(1)}:
            </label>
            <div className="select-wrapper">
              <select
                id={`select-${group}`}
                className={`parameter-select ${inputErrors[group] ? 'input-error' : ''}`}
                value={selectedParameters[group]?.name || ''}
                onChange={e => handleSelectChange(group, e.target.value)}
                aria-label={`Wybierz ${group}`}
                aria-invalid={inputErrors[group]}
              >
                <option value="">Wybierz opcję</option>
                {parameters.map(param => (
                  <option key={param.name} value={param.name}>
                    {param.description} - {formatCurrency(param.price)}
                  </option>
                ))}
              </select>
              {selectedParameters[group]?.name && (
                <div className="parameter-details">
                  <div className="parameter-info">
                    <span className="parameter-unit">
                      {parameters.find(p => p.name === selectedParameters[group]?.name)?.unit}
                    </span>
                    <span className="parameter-price">
                      {formatCurrency(parameters.find(p => p.name === selectedParameters[group]?.name)?.price || 0)}
                    </span>
                  </div>
                  <div className="quantity-input-wrapper">
                    <label htmlFor={`quantity-${group}`} className="quantity-label">
                      Liczba:
                    </label>
                    <input
                      id={`quantity-${group}`}
                      className={`quantity-input ${inputErrors[group] ? 'input-error' : ''}`}
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={selectedParameters[group]?.quantity || ''}
                      onChange={e => handleQuantityChange(group, e.target.value)}
                      aria-label={`Liczba dla ${group}`}
                      aria-invalid={inputErrors[group]}
                      placeholder="0"
                    />
                    {inputErrors[group] && (
                      <div className="error-message" role="alert">
                        Nieprawidłowa wartość
                      </div>
                    )}
                  </div>
                  <div className="parameter-total">
                    Suma: {formatCurrency(
                      (parameters.find(p => p.name === selectedParameters[group]?.name)?.price || 0) *
                      safeParseFloat(selectedParameters[group]?.quantity || '0')
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="calculator-summary">
        <div className="total-section">
          <span className="total-label">Suma:</span>
          <span className="total-value" aria-live="polite">
            {formatCurrency(totalCost)}
          </span>
        </div>

        <div className="action-buttons">
          <PrimaryButton
            id="generate-offer-button"
            className="generate-offer-button"
            label="Wygeneruj ofertę"
            onClick={handleGenerateOffer}
            disabled={!hasValidSelections}
            aria-label="Wygeneruj ofertę na podstawie wybranych parametrów"
          />
        </div>
      </div>

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        errorMessage="Proszę wybrać przynajmniej jeden parametr i podać jego liczbę przed wygenerowaniem oferty."
      />
    </div>
  );
};

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

export default CalculatorV2;