import React from 'react';

export default function Table({ columns = [], data = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border bg-white">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="border-b px-3 py-2 text-left font-semibold">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="odd:bg-gray-50">
              {columns.map((c) => (
                <td key={c.key} className="border-t px-3 py-2">
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

