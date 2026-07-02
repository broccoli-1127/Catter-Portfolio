import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Content
      ref={ref}
      className={`z-50 min-w-[8rem] rounded-md border bg-white p-1 text-sm shadow-md ${className}`}
      {...props}
    />
  )
)
export const DropdownMenuItem = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={`flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 outline-none hover:bg-gray-100 ${className}`}
      {...props}
    />
  )
)
