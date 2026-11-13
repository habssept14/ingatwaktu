"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label as LabelPrimitive } from "@radix-ui/react-label";

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <LabelPrimitive
      ref={ref}
      className={cn("text-sm font-medium text-[hsl(var(--bone))] mb-1.5", className)}
      {...props}
    />
  )
);
Label.displayName = LabelPrimitive.displayName;

export { Label };