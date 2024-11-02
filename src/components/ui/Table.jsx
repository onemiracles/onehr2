import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Table = forwardRef(({ headers, data, className, ...props }, ref) => {
    return (
      <div className="overflow-x-auto">
        <table ref={ref} className={cn("min-w-full divide-y divide-gray-200 dark:divide-gray-700", className)} {...props}>
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  });