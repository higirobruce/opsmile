"use client"

import { useEffect, useId, useState } from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import {
    ChevronDownIcon,
    ChevronFirstIcon,
    ChevronLastIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    Edit,
    Router
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"

type Item = {
    _id: string
    registrationNumber: string
    firstName: string
    lastName: string
    gender: string
    province: { name: string, code: string, _id: string }
    district: { name: string, code: string, _id: string }
    program: { _id: string, name: string }
    phoneNumber: string
    status: "Active" | "Inactive" | "Pending"
    balance: number
}

const columns: ColumnDef<Item>[] = [
    {
        header: "Patient Code",
        accessorKey: "registrationNumber",
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("registrationNumber")}</div>
        ),
        size: 180,
    },
    {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => (
            <div className="font-medium truncate">
                {row.original.firstName} {row.original.lastName}
            </div>
        ),
        size: 180,
    },
    {
        header: "Gender",
        accessorKey: "gender",
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.gender}
            </div>
        ),
        size: 180,
    },
    {
        header: "Location",
        accessorKey: "location",
        cell: ({ row }) => (
            <div>
                <span className="text-sm leading-none">
                    {row.original.province.name}, {row.original.district.name}
                </span>{" "}
            </div>
        ),
        size: 180,
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
            <Badge
                className={cn(
                    row.getValue("status") === "Inactive" &&
                    "bg-muted-foreground/60 text-primary-foreground"
                )}
            >
                {row.getValue("status") || 'Active'}
            </Badge>
        ),
        size: 120,
    },
    {
        header: "Program",
        accessorKey: "program",
        cell: ({ row }) => (
            <div className="font-sm truncate">
                {row.original.program.name}
            </div>
        ),
        size: 120,
    },
    {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => (
            <div className="font-sm">
                <Link href={`/patients/${row.original._id}`}>
                    <Button variant="link" className='place-self-end cursor-pointer'>
                        <Edit /> More
                    </Button>
                </Link>
            </div>
        ),
        size: 120,
    },

    // <Button className='place-self-end' onClick={() => router.push('patients/' + patientData._id)}>
    //                                 <Edit /> More
    //                             </Button>
]

export default function PatientsTable(
    { totalCount,
        patientData,
        currentPage,
        setCurrentPage,
        setTotalPages,
        setPageSize,
        pageSize,
        totalPages }:
        {
            totalCount: number,
            patientData: Item[],
            currentPage: number,
            setCurrentPage: (page: number) => void,
            setTotalPages: (pages: number) => void,
            setPageSize: (size: number) => void,
            pageSize: number,
            totalPages: number
        }) {
    const id = useId()
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: currentPage - 1,
        pageSize: pageSize,
    })

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "name",
            desc: false,
        },
    ])

    const [data, setData] = useState<Item[]>([])


    const table = useReactTable({
        data: patientData,
        columns,
        manualPagination: true,
        // pageCount: totalCount,
        rowCount: totalCount,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        enableSortingRemoval: false,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
        },
    })

    useEffect(() => {
        setCurrentPage(pagination.pageIndex + 1)
        setPageSize(pagination.pageSize)
    }, [pagination.pageIndex, pagination.pageSize])

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-md border bg-background">
                <Table className="table-fixed">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: `${header.getSize()}px` }}
                                            className="h-11"
                                        >
                                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                <div
                                                    className={cn(
                                                        header.column.getCanSort() &&
                                                        "font-semibold flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                                                    )}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    onKeyDown={(e) => {
                                                        // Enhanced keyboard handling for sorting
                                                        if (
                                                            header.column.getCanSort() &&
                                                            (e.key === "Enter" || e.key === " ")
                                                        ) {
                                                            e.preventDefault()
                                                            header.column.getToggleSortingHandler()?.(e)
                                                        }
                                                    }}
                                                    tabIndex={header.column.getCanSort() ? 0 : undefined}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: (
                                                            <ChevronUpIcon
                                                                className="shrink-0 opacity-60"
                                                                size={16}
                                                                aria-hidden="true"
                                                            />
                                                        ),
                                                        desc: (
                                                            <ChevronDownIcon
                                                                className="shrink-0 opacity-60"
                                                                size={16}
                                                                aria-hidden="true"
                                                            />
                                                        ),
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            ) : (
                                                flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-8">
                {/* Results per page */}
                <div className="flex items-center gap-3">
                    <Label htmlFor={id} className="max-sm:sr-only">
                        Rows per page
                    </Label>
                    <Select
                        value={table.getState().pagination.pageSize.toString()}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger id={id} className="w-fit whitespace-nowrap">
                            <SelectValue placeholder="Select number of results" />
                        </SelectTrigger>
                        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                            {[5, 10, 25, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={pageSize.toString()}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Page number information */}
                <div className="flex grow justify-end text-sm whitespace-nowrap text-muted-foreground">
                    <p
                        className="text-sm whitespace-nowrap text-muted-foreground"
                        aria-live="polite"
                    >
                        <span className="text-foreground">
                            {table.getState().pagination.pageIndex *
                                table.getState().pagination.pageSize +
                                1}
                            -
                            {Math.min(
                                Math.max(
                                    table.getState().pagination.pageIndex *
                                    table.getState().pagination.pageSize +
                                    table.getState().pagination.pageSize,
                                    0
                                ),
                                totalCount
                            )}
                        </span>{" "}
                        of{" "}
                        <span className="text-foreground">
                            {totalCount.toString()}
                        </span>
                    </p>
                </div>
                {/* Pagination buttons */}
                <div>
                    <Pagination>
                        <PaginationContent>
                            {/* First page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.firstPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    aria-label="Go to first page"
                                >
                                    <ChevronFirstIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            {/* Previous page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    aria-label="Go to previous page"
                                >
                                    <ChevronLeftIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            {/* Next page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    aria-label="Go to next page"
                                >
                                    <ChevronRightIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            {/* Last page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.lastPage()}
                                    disabled={!table.getCanNextPage()}
                                    aria-label="Go to last page"
                                >
                                    <ChevronLastIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
            {/* <p className="mt-4 text-center text-sm text-muted-foreground">
        Paginated table made with{" "}
        <a
          className="underline hover:text-foreground"
          href="https://tanstack.com/table"
          target="_blank"
          rel="noopener noreferrer"
        >
          TanStack Table
        </a>
      </p> */}
        </div>
    )
}
