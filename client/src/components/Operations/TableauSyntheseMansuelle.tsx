// components/TableauSyntheseMensuelle.tsx
import React from "react";

interface Operation {
  id: string;
  mois: string;
  recettes: number;
  depenses: number;
}

interface Props {
  currentYear: number;
  soldeAnneePrecedente: number;
  operations: Operation[];
  totalRecettes: number;
  totalDepenses: number;
  solde: number;
}

const TableauSyntheseMensuelle: React.FC<Props> = ({
  currentYear,
  soldeAnneePrecedente,
  operations,
  totalRecettes,
  totalDepenses,
  solde,
}) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Synthèse mensuelle des recettes et dépenses</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="px-4 py-2 text-left border border-gray-600">Mois</th>
            <th className="px-4 py-2 text-left border border-gray-600">Recettes</th>
            <th className="px-4 py-2 text-left border border-gray-600">Dépenses</th>
            <th className="px-4 py-2 text-left border border-gray-600">Solde</th>
          </tr>
        </thead>
        <tbody>
          <tr className="font-semibold text-blue-800 bg-blue-100">
            <td className="px-4 py-2 border border-gray-600">Solde {currentYear - 1}</td>
            <td className="px-4 py-2 border border-gray-600">{soldeAnneePrecedente.toLocaleString()} FG</td>
            <td className="px-4 py-2 border border-gray-600"></td>
            <td className="px-4 py-2 border border-gray-600"></td>
          </tr>

          {operations.map((op) => (
            <tr key={op.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 border border-gray-600">{op.mois}</td>
              <td className="px-4 py-2 border border-gray-600">{op.recettes.toLocaleString()} FG</td>
              <td className="px-4 py-2 border border-gray-600">{op.depenses.toLocaleString()} FG</td>
              <td className="px-4 py-2 border border-gray-600">
                {(op.recettes - op.depenses).toLocaleString()} FG
              </td>
            </tr>
          ))}

          <tr className="font-bold bg-gray-100">
            <td className="px-4 py-2 border border-gray-600">Total</td>
            <td className="px-4 py-2 border border-gray-600">{totalRecettes.toLocaleString()} FG</td>
            <td className="px-4 py-2 border border-gray-600">{totalDepenses.toLocaleString()} FG</td>
            <td className="px-4 py-2 border border-gray-600">{solde.toLocaleString()} FG</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={3} className="px-4 py-2 border border-gray-600">
              {`Solde au 31 Décembre ${currentYear}`}
            </th>
            <td className="px-4 py-2 border border-gray-600">{solde.toLocaleString()} FG</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TableauSyntheseMensuelle;
