
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

type TimeDropdownProps = {
  value: string;
  onChange: (val: string) => void;
};

const options = ["5 hrs/week", "10 hrs/week", "15 hrs/week"];

export default function TimeDropdown({ value, onChange }: TimeDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Choose hours per week..." />
      </SelectTrigger>
      <SelectContent>
        {options.map(opt => (
          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
