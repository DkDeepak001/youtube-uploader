import React from "react";
import { cn } from "../utils/cn";

// Define a base Card component
const BaseCard = (elementType: string, displayName: string) => {
  return React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      React.createElement(
        elementType,
        {
          ref,
          className: cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm",
            className
          ),
          ...props,
        },
        props.children
      )
    )
  );
};

// Create Card component
const Card = BaseCard("div", "Card");
Card.displayName = "Card";

// Create CardHeader component
const CardHeader = BaseCard("div", "CardHeader");
CardHeader.displayName = "CardHeader";

// Create CardTitle component
const CardTitle = BaseCard("h3", "CardTitle");
CardTitle.displayName = "CardTitle";

// Create CardDescription component
const CardDescription = BaseCard("p", "CardDescription");
CardDescription.displayName = "CardDescription";

// Create CardContent component
const CardContent = BaseCard("div", "CardContent");
CardContent.displayName = "CardContent";

// Create CardFooter component
const CardFooter = BaseCard("div", "CardFooter");
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
