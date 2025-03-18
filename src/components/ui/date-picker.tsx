import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    date?: Date
    setDate?: (date: Date | undefined) => void
    selected?: Date
    onSelect?: (date: Date | undefined) => void
    className?: string
    placeholder?: string
    disabled?: boolean
}

export function DatePicker({
    date,
    setDate,
    selected,
    onSelect,
    className,
    placeholder = "Selecione uma data",
    disabled = false
}: DatePickerProps) {
    // Compatibilidade para usar qualquer um dos padrões de props (date/setDate ou selected/onSelect)
    const selectedDate = date || selected
    const handleSelect = React.useCallback((date: Date | undefined) => {
        if (setDate) setDate(date)
        if (onSelect) onSelect(date)
    }, [setDate, onSelect])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                        className
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                        format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    initialFocus
                    locale={ptBR}
                />
            </PopoverContent>
        </Popover>
    )
} 