import React, { useState } from 'react';
import { parametersGrouped } from '../../resources/parameters'; // Adjust the import path as necessary
import './parameters.scss';


const ParametersPage = () => {
    const [selectedParameters, setSelectedParameters] = useState<{ [key: string]: string }>({});
  
    const handleSelectChange = (group: string, value: string) => {
      setSelectedParameters(prevState => ({
        ...prevState,
        [group]: value,
      }));
    };
  
    return (
      <div className="parameters-page">
        {Object.keys(parametersGrouped).map(group => (
          <div key={group} className="parameters-group">
            <label htmlFor={group}>{group.charAt(0).toUpperCase() + group.slice(1)}:</label>
            <select
              id={group}
              value={selectedParameters[group] || ''}
              onChange={e => handleSelectChange(group, e.target.value)}
            >
              <option value="">Select a parameter</option>
              {parametersGrouped[group].map(param => (
                <option key={param.name} value={param.name}>
                  {param.description}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  };
  
  export default ParametersPage;