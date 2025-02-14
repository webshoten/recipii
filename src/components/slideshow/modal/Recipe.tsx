import { ItemsState } from '@/components/slideshow/modal/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { analyzeImage } from '@/lib/generateIngredientsByAI';
import { getFoodImage } from '@/repository/server/food/getFoodImage';
import { Minus, Plus } from 'lucide-react';

export const Recipe: React.FC<{
  itemsState: ItemsState;
  foodFilePath: string;
}> = ({ itemsState, foodFilePath }) => {
  const [items, setItems] = itemsState;

  const handleNameChange = (index: number, name: string) => {
    const newInputs = [...items];
    newInputs[index] = { ...newInputs[index], name };
    setItems(newInputs);
  };

  const handleQuantityChange = (index: number, quantity: string) => {
    const newInputs = [...items];
    newInputs[index] = { ...newInputs[index], quantity };
    setItems(newInputs);
  };

  const removeInput = (index: number) => {
    const newInputs = items.filter((_, i) => i !== index);
    setItems(newInputs);
  };

  const addInput = () => {
    setItems((prev) => [...prev, { name: '', quantity: '' }]);
  };

  const generateIngredientByAI = async () => {
    const url = await getFoodImage(foodFilePath);
    const res = await analyzeImage(url);
    setItems([...res]);
  };

  return (
    <>
      <ScrollArea className="h-[360px]">
        <div className="space-y-4 p-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <Input
                className="flex-grow mr-1"
                placeholder={`入力欄 ${index + 1}`}
                value={item.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="グラム"
                  className="flex-grow"
                  value={item.quantity || ''}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  g
                </span>
              </div>

              {items.length > 1 && (
                <Button
                  variant="ghost"
                  onClick={() => removeInput(index)}
                  className="ml-2"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex justify-between mt-4">
        <Button onClick={addInput}>
          <Plus className="h-4 w-4" />
        </Button>
        <div>
          <Button className="ml-1" onClick={() => generateIngredientByAI()}>
            AI食材分析
          </Button>
        </div>
      </div>
    </>
  );
};
