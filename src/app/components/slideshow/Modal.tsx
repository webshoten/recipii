import { GenerateIngredientByAI } from '@/app/components/slideshow/server/GenerateIngredientByAI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getFoodImage } from '@/repository/food/getFoodImage';
import { Minus, Plus } from 'lucide-react';
import type React from 'react';
import { useLayoutEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Apple, Beef, Carrot, Fish, Wheat } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Ingredient } from '@/app/components/slideshow/Slideshow';
import { Generate5NutrientsByAI } from '@/app/components/slideshow/server/Generate5NutrientsByAI';

export type Items = {
  name: string;
  quantity: string | null;
}[];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  submitIngredient: (items: Items) => void;
  ingredient: Ingredient | undefined;
  foodFilePath: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  submitIngredient,
  ingredient,
  foodFilePath,
}) => {
  const [inputs, setInputs] = useState<
    {
      name: string;
      quantity: string | null;
    }[]
  >(ingredient?.ingredients || []);
  const [nutritions, setNutritions] = useState<{
    carbohydrate: number;
    protein: number;
    fat: number;
    vitamin: number;
    mineral: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (ingredient && ingredient?.ingredients.length > 0) {
      setInputs(ingredient?.ingredients);
    } else {
      setInputs(() => [{ name: '', quantity: '' }]);
    }
  }, [ingredient]);

  if (!isOpen) return null;

  const addInput = () => {
    setInputs((prev) => [...prev, { name: '', quantity: '' }]);
  };

  const removeInput = (index: number) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const handleNameChange = (index: number, name: string) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], name };
    setInputs(newInputs);
  };

  const handleQuantityChange = (index: number, quantity: string) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], quantity };
    setInputs(newInputs);
  };

  const submit = () => {
    if (
      ingredient?.ingredients.map((x) => {
        return { name: x.name, quantity: x.quantity };
      }) !== inputs
    ) {
      submitIngredient(inputs);
    }
    onClose();
  };

  const generateIngredientByAI = async () => {
    const url = await getFoodImage(foodFilePath);
    const res = await GenerateIngredientByAI(url);
    setInputs([...res]);
  };

  return (
    <div className="absolute flex items-center justify-center">
      <div
        onClick={() => submit() /** モーダルが閉じたとき */}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-0 top-0 left-0"
      ></div>
      <div className="bg-white rounded-lg p-6 w-full max-w-md z-50 fixed ">
        <Tabs defaultValue="recipe" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-10">
            <TabsTrigger value="recipe">レシピ</TabsTrigger>
            <TabsTrigger
              onClick={async () => {
                debugger;
                const res = await Generate5NutrientsByAI(
                  inputs.map((a) => {
                    return { name: a.name, quantity: a.quantity + 'g' };
                  }),
                );
                debugger;
                setNutritions({
                  carbohydrate:
                    Number(res.find((a) => a.name === '炭水化物')?.percent) ||
                    0,
                  fat: Number(res.find((a) => a.name === '脂質')?.percent) || 0,
                  mineral:
                    Number(res.find((a) => a.name === 'ミネラル')?.percent) ||
                    0,
                  protein:
                    Number(res.find((a) => a.name === 'タンパク質')?.percent) ||
                    0,
                  vitamin:
                    Number(res.find((a) => a.name === 'ビタミン')?.percent) ||
                    0,
                });
              }}
              value="nutrition"
            >
              栄養バランス(AI)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipe">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4 p-3">
                {inputs.map((input, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Input
                      className="flex-grow mr-1"
                      placeholder={`入力欄 ${index + 1}`}
                      value={input.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="グラム"
                        className="flex-grow"
                        value={input.quantity || ''}
                        onChange={(e) =>
                          handleQuantityChange(index, e.target.value)
                        }
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        g
                      </span>
                    </div>

                    {inputs.length > 1 && (
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
                <Button
                  className="ml-1"
                  onClick={() => generateIngredientByAI()}
                >
                  AI食材生成
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nutrition">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <Wheat className="w-5 h-5 text-yellow-500" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div>炭水化物</div>
                      <div>{nutritions?.carbohydrate}%</div>
                    </div>
                    <Progress
                      value={nutritions?.carbohydrate}
                      className="h-2"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Beef className="w-5 h-5 text-red-500" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div>タンパク質</div>
                      <div>{nutritions?.protein}%</div>
                    </div>
                    <Progress value={nutritions?.protein} className="h-2" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Fish className="w-5 h-5 text-blue-500" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div>脂質</div>
                      <div>{nutritions?.fat}%</div>
                    </div>
                    <Progress value={nutritions?.fat} className="h-2" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Carrot className="w-5 h-5 text-orange-500" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div>ビタミン</div>
                      <div>{nutritions?.vitamin}%</div>
                    </div>
                    <Progress value={nutritions?.vitamin} className="h-2" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Apple className="w-5 h-5 text-green-500" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div>ミネラル</div>
                      <div>{nutritions?.mineral}%</div>
                    </div>
                    <Progress value={nutritions?.mineral} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h4 className="text-sm font-medium mb-2">アドバイス</h4>
                <p className="text-sm text-muted-foreground">
                  このお食事は全体的にバランスが良好です。特にタンパク質の摂取が理想的な範囲内にあります。
                  ただし、脂質の摂取がやや少なめなので、オリーブオイルやアボカドなどの健康的な脂質を取り入れることをお勧めします。
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Modal;
