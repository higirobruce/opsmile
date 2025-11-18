import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton({ columns = 5, rows = 6 }: { columns?: number; rows?: number }) {
  return (
    <Table className="table-fixed animate-pulse">

      {/* HEADER */}
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {Array.from({ length: columns }).map((_, i) => (
            <TableHead key={i} className="h-11">
              <Skeleton className="h-4 w-24 rounded-md" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      {/* BODY */}
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-4 w-full rounded-md" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}