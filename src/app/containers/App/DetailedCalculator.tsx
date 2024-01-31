// import React from 'react';
// import './detailed-calculator.scss';
// import { Unit } from 'app/models';

// interface IItemProps {
//   name: string;
//   description: string;
//   unit: string;
//   price: number;
//   quantity: string;
//   onChange: (value: string) => void;
// }

// enum MaterialType {
//   None = 'none',
// };

// const parameters = [
//   {
//     name: 'trepy',
//     width: 0,
//     length: 0,
//     material: MaterialType.None,
//     details: [
//       {
//         name: "stopnie_beton_1.25m",
//         description: "Stopnie mocowane do betonu schody o szerokości od 1m do 1.25m.",
//         unit: Unit.Szt,
//         price: 620,
//         quantity: "",
//       },
//       {
//         name: "stopnie_beton_1.5m",
//         description: "Stopnie mocowane do betonu schody o szerokości od 1.26m do 1.5m.",
//         unit: Unit.Szt,
//         price: 750,
//         quantity: "",
//       },
//       {
//         name: "stopnie_beton_1.5m+",
//         description: "Stopnie mocowane do betonu schody o szerokości powyżej 1.5m.",
//         unit: Unit.Szt,
//         price: 931,
//         quantity: "",
//       },
//     ]
//   },
//   {
//     name: 'podest',
//     isEnabled: false,
//     width: 0,
//     length: 0,
//     material: MaterialType.None,
//     details: [
//       {
//         name: "podest_1.39m",
//         description: "Pole powierzchni podestu jeśli krótki do 1.39 m.",
//         unit: Unit.M2,
//         price: 1500,
//         quantity: "",
//       },
//       {
//         name: "podest_1.79m",
//         description: "Pole powierzchni podestu jeśli długi 1.4 m do 1.79 m.",
//         unit: Unit.M2,
//         price: 1763,
//         quantity: "",
//       },
//       {
//         name: "podest_1.8m",
//         description: "Pole powierzchni podestu jeśli bardzo długi powyżej 1.8 m.",
//         unit: Unit.M2,
//         price: 2063,
//         quantity: "",
//       },
//       {
//         name: "podest_berlinecka",
//         description: "Podest wykonany z deski barlineckiej",
//         unit: Unit.M2,
//         price: 1050,
//         quantity: "",
//       }]
//   }
// ];
// export const App = () => {
//   const [state, setState] = React.useState(parameters);

//   return (
//     <div className='container'>
//       {state.map((item, index) => {
//         return (
//           <ItemDetailsComponent
//             key={index}
//             item={item}
//             onChange={(on) => {
//               const newState = [...state];
//               newState[index].isEnabled = on;
//               setState(newState);
//             }}
//             onChangeItemCalculator={x => setState(state)}
//           />
//         );
//       })}
//     </div>
//   );
// };

// const ItemDetailsComponent = (props: any) => {
//   return (
//     <div>
//         <label className="switch">
//           <input type="checkbox" onClick={() => props.onChange(!props.item.isEnabled)} />
//           <span className="slider round"></span>
//         </label>
//         {
//           props.item.isEnabled &&
//           <div className='divTable steelBlueCols'>
//             <div className='divTableBody'>
//               {props.item.details.map((item: any, index: number) => (
//                 <ItemCalculator
//                   key={index}
//                   {...item}
//                   onChange={(quantity) => {
//                     const newState = [...props.details];
//                     newState[index].quantity = quantity.replace(",", ".");

//                     props.onChangeItemCalculator(newState);
//                   }} />
//               ))}
//             </div>
//           </div>
//         }
//     </div>
//   );
// }


// const ItemCalculator = (props: IItemProps) => {
//   const { name, description, unit, price, quantity, onChange } = props;
//   return (
//     <div className='divTableRow'>
//       <div className='divTableCell'>{description}</div>
//       <div className='divTableCell'>{unit}</div>
//       <div className='divTableCell'>{price}</div>
//       <div className='divTableCell'>
//         <input
//           value={quantity}
//           onChange={event => onChange(event.target.value)}
//           name={name}
//           size={2}
//           type="number"
//         />
//       </div>
//       <div>{Math.floor(safeParseFloat(quantity) * price)}</div>
//     </div>
//   );
// };

// function safeParseFloat(value: string) {
//   const val = parseFloat(value);
//   return isNaN(val) ? 0 : val;
// }