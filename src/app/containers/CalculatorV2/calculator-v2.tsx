import React, { useState, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { parametersGrouped } from '../../resources/parameters';
import { PrimaryButton } from '../../components/Button/PrimaryButton';
import { ErrorModal } from '../../components/ErrorModal/ErrorModal';
import './parameters.scss';

interface ICalculatorV2Props {
  className?: string;
}

interface ParameterSelection {
  name: string;
  quantity: string;
  id: string;
}

const CalculatorV2: React.FC<ICalculatorV2Props> = ({ className }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [inputErrors, setInputErrors] = useState<Record<string, Record<string, boolean>>>({});
  const [selections, setSelections] = useState<Record<string, ParameterSelection[]>>(() => {
    // Initialize from URL params
    const initialSelections: Record<string, ParameterSelection[]> = {};
    
    // First, initialize all groups with empty selections
    Object.keys(parametersGrouped).forEach(group => {
      initialSelections[group] = [{ 
        id: `${group}-0`,
        name: '', 
        quantity: '' 
      }];
    });
    
    // Then handle old format parameters (e.g., kolor-name=bejca)
    Object.keys(parametersGrouped).forEach(group => {
      const name = searchParams.get(`${group}-name`);
      const quantity = searchParams.get(`${group}-quantity`);
      if (name) {
        initialSelections[group] = [{
          id: `${group}-0`,
          name,
          quantity: quantity || '1'
        }];
      }
    });
    
    // Then process new format parameters (e.g., kolor-0-name=lakierowanie_olejowanie)
    const groupedParams: Record<string, Array<{index: string, name: string, quantity: string, id: string}>> = {};
    
    searchParams.forEach((value, key) => {
      // Skip empty values and old format parameters
      if (!value || !key.includes('-')) return;
      
      // Parse the key (e.g., "kolor-0-name" -> {group: "kolor", index: "0", type: "name"})
      const match = key.match(/^([a-z_]+)-(\d+)-([a-z]+)$/);
      if (!match) return;
      
      const [, group, index, type] = match;
      if (!groupedParams[group]) {
        groupedParams[group] = [];
      }
      
      // Find or create the entry for this group and index
      let entry = groupedParams[group].find(e => e.index === index);
      if (!entry) {
        entry = { index, name: '', quantity: '', id: '' };
        groupedParams[group].push(entry);
      }
      
      // Update the appropriate field
      if (type === 'name') entry.name = value;
      if (type === 'quantity') entry.quantity = value;
      if (type === 'id') entry.id = value;
    });
    
    // Convert grouped parameters to selections
    Object.entries(groupedParams).forEach(([group, entries]) => {
      // Sort by index to maintain order
      entries.sort((a, b) => parseInt(a.index) - parseInt(b.index));
      
      // Convert to ParameterSelection format
      const groupSelections = entries.map(entry => ({
        id: entry.id || `${group}-${entry.index}`,
        name: entry.name,
        quantity: entry.quantity
      }));
      
      // If we already have selections from old format, merge them
      if (initialSelections[group]?.[0]?.name) {
        // Remove any duplicates (based on name)
        const existingNames = new Set(initialSelections[group].map(s => s.name));
        const newSelections = groupSelections.filter(s => !existingNames.has(s.name));
        initialSelections[group] = [...initialSelections[group], ...newSelections];
      } else if (groupSelections.some(s => s.name)) {
        initialSelections[group] = groupSelections;
      }
    });
    
    console.log('Initialized selections:', initialSelections);
    return initialSelections;
  });

  // Calculate total cost
  const totalCost = useMemo(() => {
    return Object.entries(selections).reduce((total, [group, groupSelections]) => {
      return total + groupSelections.reduce((groupTotal, { name, quantity }) => {
        if (!name) return groupTotal;
        const param = parametersGrouped[group].find(p => p.name === name);
        return groupTotal + (param?.price || 0) * safeParseFloat(quantity);
      }, 0);
    }, 0);
  }, [selections]);

  const hasValidSelections = useMemo(() => {
    return Object.values(selections).some(groupSelections => 
      groupSelections.some(({ name, quantity }) => name && safeParseFloat(quantity) > 0)
    );
  }, [selections]);

  const handleSelectChange = useCallback((group: string, value: string, selectionId: string) => {
    setSelections(prev => {
      const groupSelections = [...(prev[group] || [])];
      const index = groupSelections.findIndex(s => s.id === selectionId);
      if (index !== -1) {
        groupSelections[index] = {
          ...groupSelections[index],
          name: value,
          quantity: value ? (groupSelections[index].quantity || '1') : ''
        };
      }
      return { ...prev, [group]: groupSelections };
    });
  }, []);

  const handleQuantityChange = useCallback((group: string, quantity: string, selectionId: string) => {
    const isValid = validateInput(quantity);
    setInputErrors(prev => ({
      ...prev,
      [group]: { ...(prev[group] || {}), [selectionId]: !isValid }
    }));

    if (isValid) {
      setSelections(prev => {
        const groupSelections = [...(prev[group] || [])];
        const index = groupSelections.findIndex(s => s.id === selectionId);
        if (index !== -1) {
          groupSelections[index] = {
            ...groupSelections[index],
            quantity: quantity === '' ? '' : quantity.replace(',', '.')
          };
        }
        return { ...prev, [group]: groupSelections };
      });
    }
  }, []);

  const handleAddSelection = useCallback((group: string) => {
    setSelections(prev => {
      const groupSelections = [...(prev[group] || [])];
      // Use timestamp to ensure unique ID
      const newId = `${group}-${Date.now()}`;
      groupSelections.push({ id: newId, name: '', quantity: '' });
      return { ...prev, [group]: groupSelections };
    });
  }, []);

  const handleRemoveSelection = useCallback((group: string, selectionId: string) => {
    setSelections(prev => {
      const groupSelections = prev[group].filter(s => s.id !== selectionId);
      return { ...prev, [group]: groupSelections };
    });
  }, []);

  const handleGenerateOffer = useCallback(() => {
    if (hasValidSelections) {
      // Convert selections to URL params
      const newSearchParams = new URLSearchParams();
      Object.entries(selections).forEach(([group, groupSelections]) => {
        groupSelections.forEach((selection, index) => {
          if (selection.name) {
            newSearchParams.set(`${group}-${index}-name`, selection.name);
            newSearchParams.set(`${group}-${index}-quantity`, selection.quantity);
            newSearchParams.set(`${group}-${index}-id`, selection.id);
          }
        });
      });
      navigate({ pathname: "/oferta", search: newSearchParams.toString() });
    } else {
      setIsErrorModalOpen(true);
    }
  }, [hasValidSelections, navigate, selections]);

  return (
    <div className={`calculator-v2-container ${className || ''}`}>
      <h1 className="calculator-title">Kalkulator parametrów</h1>
      
      <div className="parameters-wrapper">
        {Object.entries(parametersGrouped).map(([group, parameters]) => (
          <div key={group} className="parameter-group">
            <label className="parameter-label">
              {group.charAt(0).toUpperCase() + group.slice(1)}:
            </label>
            <div className="selections-container">
              {(selections[group] || []).map((selection, idx) => (
                <div key={selection.id} className="selection-item">
                  <div className="select-wrapper">
                    <select
                      className={`parameter-select ${inputErrors[group]?.[selection.id] ? 'input-error' : ''}`}
                      value={selection.name}
                      onChange={e => handleSelectChange(group, e.target.value, selection.id)}
                      aria-label={`Wybierz ${group} ${idx + 1}`}
                      aria-invalid={inputErrors[group]?.[selection.id]}
                    >
                      <option value="">Wybierz opcję</option>
                      {parameters.map(param => (
                        <option key={param.name} value={param.name}>
                          {param.description} - {formatCurrency(param.price)}
                        </option>
                      ))}
                    </select>
                    {idx > 0 && (
                      <button
                        className="remove-selection-button"
                        onClick={() => handleRemoveSelection(group, selection.id)}
                        aria-label={`Usuń wybór ${idx + 1}`}
                      >
                        ×
                      </button>
                    )}
                    {selection.name && (
                      <div className="parameter-details">
                        <div className="parameter-info">
                          <span className="parameter-unit">
                            {parameters.find(p => p.name === selection.name)?.unit}
                          </span>
                          <span className="parameter-price">
                            {formatCurrency(parameters.find(p => p.name === selection.name)?.price || 0)}
                          </span>
                        </div>
                        <div className="quantity-input-wrapper">
                          <label className="quantity-label">
                            Liczba:
                          </label>
                          <input
                            className={`quantity-input ${inputErrors[group]?.[selection.id] ? 'input-error' : ''}`}
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*[.,]?[0-9]*"
                            value={selection.quantity}
                            onChange={e => handleQuantityChange(group, e.target.value, selection.id)}
                            aria-label={`Liczba dla ${group} ${idx + 1}`}
                            aria-invalid={inputErrors[group]?.[selection.id]}
                            placeholder="0"
                          />
                          {inputErrors[group]?.[selection.id] && (
                            <div className="error-message" role="alert">
                              Nieprawidłowa wartość
                            </div>
                          )}
                        </div>
                        <div className="parameter-total">
                          Suma: {formatCurrency(
                            (parameters.find(p => p.name === selection.name)?.price || 0) *
                            safeParseFloat(selection.quantity || '0')
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button
                className="add-selection-button"
                onClick={() => handleAddSelection(group)}
                type="button"
                aria-label={`Dodaj kolejny wybór dla ${group}`}
              >
                + Dodaj kolejny
              </button>
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