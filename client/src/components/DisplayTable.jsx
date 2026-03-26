import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React from 'react'

const DisplayTable = ({ data, column }) => {
    const table = useReactTable({
        data,
        columns: column,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="border-b-2 border-stone-200">
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-4 py-5 text-xs font-black uppercase tracking-widest text-stone-400">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr 
                                    key={row.id} 
                                    className="hover:bg-amber-50/50 transition-colors group"
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-4 py-4 text-stone-700">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={column.length} className="px-4 py-20 text-center">
                                    <p className="text-stone-400 font-medium italic">No subcategories to display</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Footer - Minimalist style */}
            <div className="mt-6 px-4 flex justify-between items-center border-t border-stone-100 pt-4">
                <p className="text-[11px] font-black uppercase tracking-tighter text-stone-400">
                    Inventory System <span className="text-amber-500 mx-1">//</span> Total: {table.getRowModel().rows.length} Entries
                </p>
            </div>
        </div>
    )
}

export default DisplayTable