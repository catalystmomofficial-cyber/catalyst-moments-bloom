import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'all', label: 'All Posts', tag: null },
  { id: 'pregnancy', label: 'Pregnancy', tag: 'pregnancy' },
  { id: 'postpartum', label: 'Postpartum', tag: 'postpartum' },
  { id: 'ttc', label: 'TTC', tag: 'ttc' },
  { id: 'wellness', label: 'Wellness', tag: 'wellness' },
  { id: 'nutrition', label: 'Nutrition', tag: 'nutrition' },
  { id: 'fitness', label: 'Fitness', tag: 'fitness' },
];

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.tag ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-all',
              selectedCategory === category.tag 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-secondary'
            )}
            onClick={() => onCategoryChange(category.tag)}
          >
            {category.label}
          </Badge>
        ))}
      </div>
    </div>
  );
};
