import React from 'react';
import './calculator.scss';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../../components/Button/PrimaryButton';
import { Parameter, parameters } from 'app/resources/parameters';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Container from '@mui/material/Container';

interface IItemProps {
  parameter: Parameter;
  onChange: (value: string) => void;
}


export const CalculatorMui = () => {
  const mergeSearchParams = (parameters: Parameter[], searchParams: { [x: string]: any; }) =>
    parameters.map(param => ({ ...param, quantity: searchParams[param.name] ?? "" }));

  const [searchParams, setSearchParams] = useSearchParams();
  const viewModel: Parameter[] = mergeSearchParams(parameters, Object.fromEntries(searchParams.entries()));
  const navigate = useNavigate();

  return (
    <Container id="kalkulator" sx={{ py: { xs: 8, sm: 16 } }}>
    <TableContainer>
      <Table>
        <TableHead >
          <TableRow>
            <TableCell>ParameTableRowy</TableCell>
            <TableCell>J.m.</TableCell>
            <TableCell>Cena</TableCell>
            <TableCell>Liczba</TableCell>
            <TableCell>Cena usługi</TableCell>
          </TableRow>
        </TableHead >
        <tfoot>
          <TableRow >
            <TableCell colSpan={4} style={{ textAlign: 'right' }}>Suma:</TableCell>
            <TableCell className="footer" id="summary">{SumCost()} zł</TableCell>
          </TableRow>
          <TableRow className="desktop">
            <TableCell colSpan={5}>
              <PrimaryButton  label={"Wygeneruj oferte"} onClick={() => {
                if (searchParams.toString() !== "")
                  navigate({ pathname: "../oferta", search: searchParams.toString() });
                else alert("Brak wybranych parameTableRowów")
              }}></PrimaryButton>
            </TableCell>
          </TableRow>
        </tfoot>
        <TableBody id="content">
          {viewModel.map((parameter: Parameter, index: React.Key) => (
            <ItemCalculator
              key={index}
              parameter={parameter}
              onChange={onChangeQuantity(parameter)} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      {/* <table className="print">
        <TableRow >
          <TableCell colSpan={2}></TableCell>
          <TableCell colSpan={2}>Razem cena BRUTTO:</TableCell>
          <TableCell className="footer" id="summary">{SumCost()} zł</TableCell>
        </TableRow>
      </table> */}
    </Container>
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
    <TableRow>
      <TableCell>{description}</TableCell>
      <TableCell>{unit}</TableCell>
      <TableCell>{price}</TableCell>
      <TableCell>
        <input
          style={{ textAlign: 'center' }}
          value={quantity}
          onChange={event => onChange(event.target.value)}
          name={name}
          size={2}
          type="num"
        />
      </TableCell>
      <TableCell>{Math.floor(safeParseFloat(quantity) * price)}</TableCell>
    </TableRow>
  );
};

function safeParseFloat(value: string): number {
  const val = parseFloat(value);
  return isNaN(val) ? 0 : val;
}