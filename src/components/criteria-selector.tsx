'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { CATEGORY_LABELS } from '@/lib/criteria-templates';
import type { RequestCriterion } from '@/lib/types/criteria';

interface CriteriaSelectorProps {
  criteria: RequestCriterion[];
  onChange: (criteria: RequestCriterion[]) => void;
}

export function CriteriaSelector({ criteria, onChange }: CriteriaSelectorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState<RequestCriterion['category']>('ervaring');

  const grouped = criteria.reduce<Record<string, RequestCriterion[]>>((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {});

  const toggleRequired = (id: string) => {
    onChange(
      criteria.map((c) => (c.id === id ? { ...c, required: !c.required } : c))
    );
  };

  const removeCriterion = (id: string) => {
    onChange(criteria.filter((c) => c.id !== id));
  };

  const addCustom = () => {
    if (!newLabel.trim()) return;
    const id = `custom-${Date.now()}`;
    onChange([...criteria, { id, category: newCategory, label: newLabel.trim(), required: false }]);
    setNewLabel('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {CATEGORY_LABELS[category] || category}
          </h4>
          <div className="space-y-2">
            {items.map((criterion) => (
              <div
                key={criterion.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={true}
                    onCheckedChange={() => removeCriterion(criterion.id)}
                  />
                  <span className="text-sm">{criterion.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={criterion.required ? 'default' : 'secondary'}
                    className="cursor-pointer select-none"
                    onClick={() => toggleRequired(criterion.id)}
                  >
                    {criterion.required ? 'Vereist' : 'Gewenst'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCriterion(criterion.id)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {criteria.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Geen criteria geselecteerd. Voeg criteria toe of selecteer een functie met een standaard template.
        </p>
      )}

      {showAddForm ? (
        <div className="p-4 border rounded-lg bg-blue-50 space-y-3">
          <h4 className="text-sm font-semibold">Aangepast criterium toevoegen</h4>
          <div className="flex gap-2">
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="bijv. Ervaring met ECMO"
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            />
            <Select
              value={newCategory}
              onValueChange={(v) => setNewCategory(v as RequestCriterion['category'])}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={addCustom} disabled={!newLabel.trim()}>
              Toevoegen
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
              Annuleren
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Aangepast criterium toevoegen
        </Button>
      )}
    </div>
  );
}
