import React from 'react';
import './offer.scss';
import { useSearchParams } from 'react-router-dom';
import { Parameter, parameters } from 'app/resources/parameters';
import { Box, Container, Typography } from '@mui/material';
interface IItemProps {
  parameter: Parameter;
  onChange: (value: string) => void;
}

export const Offer = () => {
  const mergeSearchParams = (parameters: Parameter[], searchParams: { [x: string]: any; }) =>
    parameters.map(param => ({ ...param, quantity: searchParams[param.name] ?? "" }));

  const [searchParams, setSearchParams] = useSearchParams();
  const viewModel: Parameter[] = mergeSearchParams(parameters, Object.fromEntries(searchParams.entries())).filter(x => safeParseFloat(x.quantity) > 0);

  return (
    <Container id="offer" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box>
      <div className='flex-container'>
        <div className='company-info-container'>
          <img src={require("../../../assets/favicon.svg").default} className='company-logo'></img>
          <h3>Drvo</h3>
        </div>
        <div>
          <Typography color="text.primary" variant="body2" fontWeight="bold">Kazimierz Przybyłek</Typography>
          <Typography color="text.primary" variant="body2" fontWeight="bold">Oleksin 13, 08-130 Kotuń</Typography>
          <Typography color="text.primary" variant="body2" fontWeight="bold">tel: <a href="tel:+48509296202" >509 296 202</a></Typography>
          <Typography color="text.primary" variant="body2" fontWeight="bold">email: <a href="mailto:kontakt@drvo.pl" >kontakt@drvo.pl</a></Typography>
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
      </Box>
    </Container>
  );

  function onChangeQuantity(item: Parameter) {
    return (quantity: string) => {
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