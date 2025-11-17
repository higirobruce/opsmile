"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import moment from "moment"

export function DateAndTimePicker({ date, setDate }: { date: Date | undefined, setDate: (date: Date | undefined) => void }) {
    const [open, setOpen] = React.useState(false)
    const [meridiem, setMeridiem] = React.useState<'AM' | 'PM'>(date && date.getHours() >= 12 ? 'PM' : 'AM');

    React.useEffect(() => {
        if (date) {
            setMeridiem(date.getHours() >= 12 ? 'PM' : 'AM');
        }
    }, [date]);

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = e.target.value.split(':').map(Number);
        const newDate = date ? new Date(date) : new Date();
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        newDate.setSeconds(0);
        setDate(newDate);
        setMeridiem(hours >= 12 ? 'PM' : 'AM');
    };

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-3">
                <Label htmlFor="date-picker" className="px-1">
                    Date
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date-picker"
                            className="w-32 justify-between font-normal"
                        >
                            {date ? date.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            onSelect={(selectedDate) => {
                                if (selectedDate) {
                                    const newDate = date ? new Date(date) : new Date();
                                    newDate.setFullYear(selectedDate.getFullYear());
                                    newDate.setMonth(selectedDate.getMonth());
                                    newDate.setDate(selectedDate.getDate());
                                    setDate(newDate);
                                } else {
                                    setDate(undefined);
                                }
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col gap-3">
                <Label htmlFor="time-picker" className="px-1">
                    Time ({meridiem})
                </Label>
                <Input
                    type="time"
                    value={date ? moment(date).format('HH:mm') : ''}
                    onChange={handleTimeChange}
                    id="time-picker"
                    step="1"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
            </div>
        </div>
    )
}
