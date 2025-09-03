"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Check, Filter } from "lucide-react"

type ChildProps = {
  selectedFilter: string | null
  setSelectedFilter: React.Dispatch<React.SetStateAction<string | null>>
}

export default function Dropdown({
  selectedFilter,
  setSelectedFilter
}: ChildProps) {
  const filterOptions = [
    { value: "Mua", label: "Mua" },
    { value: "Bán", label: "Bán" },
    { value: "Chuyển nhượng", label: "Chuyển nhượng" }
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm'>
          <Filter className='w-4 h-4 mr-2' />
          {selectedFilter ? `Lọc: ${selectedFilter}` : "Lọc giao dịch"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem
          onClick={() => setSelectedFilter(null)}
          className='flex items-center justify-between'
        >
          Tất cả giao dịch
          {selectedFilter === null && <Check className='w-4 h-4' />}
        </DropdownMenuItem>
        {filterOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setSelectedFilter(option.value)}
            className='flex items-center justify-between'
          >
            {option.label}
            {selectedFilter === option.value && <Check className='w-4 h-4' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
