import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import moment from "moment";
import ProgramMore from "./programMore";
import { Badge } from "@/components/ui/badge";

interface ProgramTableProps {
    programs: {
        _id: string;
        name: string;
        description: string;
        startDate: string;
        endDate: string;
        location: string;
        status: string;
    }[];
}

export default function ProgramTable({ programs }: ProgramTableProps) {
    return (
        <div>
            <div className="overflow-hidden rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="h-9 py-2">Name</TableHead>
                            <TableHead className="h-9 py-2">Start Date</TableHead>
                            <TableHead className="h-9 py-2">End Date</TableHead>
                            <TableHead className="h-9 py-2">Location</TableHead>
                            <TableHead className="h-9 py-2">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {programs.map((program) => (
                            <TableRow key={program._id}>
                                <TableCell className="py-2 font-medium">
                                    {program.name}
                                </TableCell>
                                <TableCell className="py-1">{moment(program.startDate).format('YYYY-MMM-DD')}</TableCell>
                                <TableCell className="py-1">{moment(program.endDate).format('YYYY-MMM-DD')}</TableCell>
                                <TableCell className="py-1">{program.location}</TableCell>
                                <TableCell className="py-1 items-center justify-between flex">
                                    <Badge
                                        className={
                                            program.status === "ongoing"
                                                ? "bg-green-500 hover:bg-green-500/80"
                                                : program.status === "upcoming"
                                                    ? "bg-blue-500 hover:bg-blue-500/80"
                                                    : "bg-gray-500 hover:bg-gray-500/80"
                                        }
                                    >
                                        {program.status}
                                    </Badge>
                                    <ProgramMore programId={program._id} />
                                </TableCell>
                                
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
