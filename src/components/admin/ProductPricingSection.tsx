import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ProductPricingData, SpecificPrice } from '@/types/product';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SpecificPriceModal } from './SpecificPriceModal';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Info } from 'lucide-react';
import { useEffect } from 'react';

interface ProductPricingSectionProps {
  data: ProductPricingData;
  onChange: (data: ProductPricingData) => void;
}

// Common tax rules (can be made dynamic later)
const TAX_RULES = [
  { id: 'gst-12', name: '12% GST Rate Slab (12%)', rate: 12 },
  { id: 'gst-18', name: '18% GST Rate Slab (18%)', rate: 18 },
  { id: 'gst-5', name: '5% GST Rate Slab (5%)', rate: 5 },
  { id: 'no-tax', name: 'No Tax (0%)', rate: 0 },
];

export const ProductPricingSection = ({ data, onChange }: ProductPricingSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<SpecificPrice | null>(null);

  // Calculate tax-inclusive price when tax-exclusive price or tax rate changes
  useEffect(() => {
    if (data.retailPriceTaxExcl > 0 && data.taxRate > 0) {
      const taxIncl = data.retailPriceTaxExcl * (1 + data.taxRate / 100);
      if (Math.abs(data.retailPriceTaxIncl - taxIncl) > 0.01) {
        onChange({ ...data, retailPriceTaxIncl: parseFloat(taxIncl.toFixed(6)) });
      }
    } else if (data.retailPriceTaxExcl > 0 && data.retailPriceTaxIncl !== data.retailPriceTaxExcl) {
      onChange({ ...data, retailPriceTaxIncl: data.retailPriceTaxExcl });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.retailPriceTaxExcl, data.taxRate]);


  const handleTaxRuleChange = (ruleId: string) => {
    const rule = TAX_RULES.find(r => r.id === ruleId);
    if (rule) {
      onChange({
        ...data,
        taxRule: rule.name,
        taxRate: rule.rate,
      });
    }
  };

  const handleSavePrice = (specificPrice: SpecificPrice) => {
    const existingPrices = data.specificPrices || [];
    const existingIndex = existingPrices.findIndex(sp => sp.id === specificPrice.id);
    
    let updatedPrices: SpecificPrice[];
    if (existingIndex >= 0) {
      // Update existing
      updatedPrices = [...existingPrices];
      updatedPrices[existingIndex] = specificPrice;
    } else {
      // Add new
      updatedPrices = [...existingPrices, specificPrice];
    }

    onChange({
      ...data,
      specificPrices: updatedPrices,
    });
    
    setEditingPrice(null);
  };

  const handleDeletePrice = (priceId: string) => {
    if (confirm('Are you sure you want to delete this specific price?')) {
      const updatedPrices = (data.specificPrices || []).filter(sp => sp.id !== priceId);
      onChange({
        ...data,
        specificPrices: updatedPrices,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Retail Price Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Retail Price</h3>
          <p className="text-sm text-muted-foreground">Set the selling price for this product</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label htmlFor="retailPriceTaxExcl">Retail price (tax excl.) *</Label>
            <Input
              id="retailPriceTaxExcl"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={data.retailPriceTaxExcl || ''}
              onChange={(e) => onChange({
                ...data,
                retailPriceTaxExcl: parseFloat(e.target.value) || 0,
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxRule">Tax rule *</Label>
            <Select
              value={TAX_RULES.find(r => r.name === data.taxRule)?.id || ''}
              onValueChange={handleTaxRuleChange}
            >
              <SelectTrigger id="taxRule">
                <SelectValue placeholder="Select tax rule" />
              </SelectTrigger>
              <SelectContent>
                {TAX_RULES.map((rule) => (
                  <SelectItem key={rule.id} value={rule.id}>
                    {rule.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="retailPriceTaxIncl">Retail price (tax incl.)</Label>
            <Input
              id="retailPriceTaxIncl"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={data.retailPriceTaxIncl || ''}
              readOnly
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">Tax IN: {data.taxRate || 0}%</p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <a href="#" className="text-primary hover:underline">Manage tax rules</a>
        </div>
      </div>

      <Separator />

      {/* Cost Price Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Cost Price</h3>
          <p className="text-sm text-muted-foreground">Your cost for this product (internal use)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPriceTaxExcl">Cost price (tax excl.)</Label>
          <Input
            id="costPriceTaxExcl"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={data.costPriceTaxExcl || ''}
            onChange={(e) => onChange({
              ...data,
              costPriceTaxExcl: parseFloat(e.target.value) || 0,
            })}
          />
        </div>
      </div>

      <Separator />

      {/* Specific Prices / Bulk Discounts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Specific prices</h3>
            <p className="text-sm text-muted-foreground">
              Set specific prices and bulk discounts for different conditions
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add a specific price
          </Button>
        </div>

        {(data.specificPrices && data.specificPrices.length > 0) ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead>Combination</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Specific price (tax excl.)</TableHead>
                  <TableHead>Discount (tax incl.)</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.specificPrices.map((sp, index) => (
                  <TableRow key={sp.id}>
                    <TableCell className="font-mono text-xs">{index + 1}</TableCell>
                    <TableCell>{sp.combination || 'All combinations'}</TableCell>
                    <TableCell>{sp.currency || 'All currencies'}</TableCell>
                    <TableCell>{sp.country || 'All countries'}</TableCell>
                    <TableCell>{sp.group || 'All groups'}</TableCell>
                    <TableCell>{sp.store || 'All stores'}</TableCell>
                    <TableCell>
                      {sp.applyToAllCustomers ? 'All customers' : (sp.customer || '—')}
                    </TableCell>
                    <TableCell>
                      {sp.useSpecificPrice && sp.specificPriceTaxExcl
                        ? `₹${sp.specificPriceTaxExcl.toFixed(2)}`
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {sp.useDiscount && sp.discountValue
                        ? `${sp.discountType === 'percentage' ? sp.discountValue + '%' : `₹${sp.discountValue.toFixed(2)}`}`
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {sp.isUnlimited 
                        ? 'Unlimited'
                        : sp.startDate && sp.endDate
                        ? `${sp.startDate} → ${sp.endDate}`
                        : '—'}
                    </TableCell>
                    <TableCell>{sp.minQuantity || 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingPrice(sp);
                            setModalOpen(true);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePrice(sp.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            <p>No specific prices defined yet.</p>
            <p className="text-sm mt-1">Click "Add a specific price" to create your first pricing rule.</p>
          </div>
        )}
      </div>

      {/* Specific Price Modal */}
      <SpecificPriceModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingPrice(null);
        }}
        onSave={handleSavePrice}
        specificPrice={editingPrice}
        taxRate={data.taxRate}
      />
    </div>
  );
};

