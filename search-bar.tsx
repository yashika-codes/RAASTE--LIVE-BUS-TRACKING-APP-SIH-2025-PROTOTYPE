"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const clearSearch = () => {
    onChange("")
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search routes, destinations, or stops..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-12 h-12 text-base"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {value && (
            <Button variant="ghost" size="sm" onClick={clearSearch} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>

      {/* Search Suggestions */}
      {value && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Quick filters:</span>
          {["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali"].map((city) => (
            <Button key={city} variant="outline" size="sm" onClick={() => onChange(city)} className="h-7 text-xs">
              {city}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
