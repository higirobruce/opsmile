"use client"
import { TrendingUp } from "lucide-react"
import { Label, Legend, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { useCallback, useEffect, useState } from "react"
import { ChartCardSkeleton } from "./chart-skeleton-pie"

interface Program {
    _id: string;
    status: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";



export function ChartPieDonutActive({
    data,
    chartConfig,
    title,
    description
}: { data: PieSectorDataItem[]; chartConfig: ChartConfig, title: string, description: string }) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                {/* <CardDescription>January - June 2024</CardDescription> */}
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Legend />
                        <Pie
                            data={data}
                            dataKey="counts"
                            nameKey="labels"
                            innerRadius={60}
                            strokeWidth={5}
                            activeIndex={0}
                            activeShape={({
                                outerRadius = 0,
                                ...props
                            }: PieSectorDataItem) => (
                                <Sector {...props} outerRadius={outerRadius + 10} />
                            )}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
        </Card>
    )
}

export function ProgramStatusPieChart() {
    const { token } = useAuth();
    const [programStatusData, setProgramStatusData] = useState<PieSectorDataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProgramStatus = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/programs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const programs: Program[] = await response.json();

            const statusCounts = programs.reduce((acc, program) => {
                acc[program.status] = (acc[program.status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const transformedData: PieSectorDataItem[] = Object.entries(statusCounts).map(([status, count], index) => ({
                labels: status, // Using 'browser' as a generic label for status
                counts: count, // Using 'counts' as a generic label for count
                fill: `var(--chart-${index + 1})`, // Assigning a color from chartConfig
            }));
            setProgramStatusData(transformedData);
        } catch (err: any) {
            setError(err.message);
            toast.error("Failed to fetch program status data.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchProgramStatus();
    }, [fetchProgramStatus]);

    // if (loading) return <div className="p-4 border rounded-lg">Loading program status data...</div>;
    // if (error) return <div className="p-4 border rounded-lg text-red-500">Error: {error}</div>;

    const chartConfig1 = {
        counts: {
            label: "Programs",
        },
        "In Progress": {
            label: "In Progress",
            color: "var(--chart-1)",
        },
        Completed: {
            label: "Completed",
            color: "var(--chart-2)",
        },
        Pending: {
            label: "Pending",
            color: "var(--chart-3)",
        },
        Cancelled: {
            label: "Cancelled",
            color: "var(--chart-4)",
        },
        "On Hold": {
            label: "On Hold",
            color: "var(--chart-5)",
        },
    } satisfies ChartConfig;
    return (
        <>
            {loading && <ChartCardSkeleton />}
            {!loading && !error && <ChartPieDonutActive
                title="Program Status Overview"
                description="Current status of all programs"
                chartConfig={chartConfig1}
                data={programStatusData} />}
        </>
    );
}
