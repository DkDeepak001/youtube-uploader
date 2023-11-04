"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../utils/cn";
import { Button } from "./button";
import { Calendar } from "./calender";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function DatePickerDemo() {
  // Initialize state for the selected date
  const [date, setDate] = useState<Date | undefined>();

  // Calculate the CSS classes for the button based on the selected date
  const buttonClasses = cn(
    "w-[280px] justify-start text-left font-normal",
    !date && "text-muted-foreground"
  );

  // Calculate the text content of the button based on the selected date
  const buttonText = date ? format(date, "PPP") : <span>Pick a date</span>;

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* Render the button with the appropriate classes and text */}
        <Button variant={"outline"} className={buttonClasses}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {/* Render the Calendar component */}
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
