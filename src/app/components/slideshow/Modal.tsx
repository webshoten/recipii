import { Nutorition } from '@/app/components/slideshow/Nutrition';
import { Recipe } from '@/app/components/slideshow/Recipe';
import { Ingredient } from '@/app/components/slideshow/Slideshow';
import { Generate5NutrientsByAI } from '@/app/components/slideshow/server/Generate5NutrientsByAI';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type React from 'react';
import { useLayoutEffect, useState } from 'react';

export type Items = {
  name: string;
  quantity: string | null;
}[];

export type Nutorition = {
  carbohydrate: number;
  protein: number;
  fat: number;
  vitamin: number;
  mineral: number;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  submitIngredient: (items: Items) => void;
  ingredient: Ingredient | undefined;
  foodFilePath: string;
}

export type ItemsState = [Items, React.Dispatch<React.SetStateAction<Items>>];
export type NutritionState = [
  Nutorition | null,
  React.Dispatch<React.SetStateAction<Nutorition | null>>,
];

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  submitIngredient,
  ingredient,
  foodFilePath,
}) => {
  const itemsState = useState<Items>(ingredient?.ingredients || []);
  const [inputs, setInputs] = itemsState;
  const nutritionState = useState<Nutorition | null>(null);
  const [nutritions, setNutritions] = nutritionState;
  console.log(nutritions);
  const [tab, setTab] = useState<'recipe' | 'nutrition'>('recipe');

  useLayoutEffect(() => {
    if (ingredient && ingredient?.ingredients.length > 0) {
      setInputs(ingredient?.ingredients);
    } else {
      setInputs(() => [{ name: '', quantity: '' }]);
    }
  }, [ingredient]);

  useLayoutEffect(() => {
    if (tab === 'nutrition') {
      generate5NutrientsByAI().then(() => {});
    }
  }, [tab]);

  if (!isOpen) return null;

  const onModalClose = () => {
    if (
      ingredient?.ingredients.map((x) => {
        return { name: x.name, quantity: x.quantity };
      }) !== inputs
    ) {
      submitIngredient(inputs);
    }
    setTab('recipe');
    onClose();
  };

  const generate5NutrientsByAI = async () => {
    const res = await Generate5NutrientsByAI(
      inputs.map((a) => {
        return { name: a.name, quantity: a.quantity + 'g' };
      }),
    );
    setNutritions({
      carbohydrate: Number(res.find((a) => a.name === '炭水化物')?.percent),
      fat: Number(res.find((a) => a.name === '脂質')?.percent),
      mineral: Number(res.find((a) => a.name === 'ミネラル')?.percent),
      protein: Number(
        res.find((a) => a.name === 'タンパク質' || a.name === 'たんぱく質')
          ?.percent,
      ),
      vitamin: Number(res.find((a) => a.name === 'ビタミン')?.percent),
    });
  };

  return (
    <div className="absolute flex items-center justify-center">
      <div
        onClick={() => onModalClose() /** モーダルが閉じたとき */}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-0 top-0 left-0"
      ></div>
      <div className="bg-white rounded-lg p-6 w-full max-w-md z-50 h-[500px] fixed ">
        <Tabs defaultValue="recipe" className="w-full z-0">
          <TabsList className="grid w-full grid-cols-2 mb-10">
            <TabsTrigger
              className="z-20"
              value="recipe"
              onClick={() => setTab('recipe')}
            >
              レシピ
            </TabsTrigger>
            <TabsTrigger
              className="z-20"
              onClick={() => setTab('nutrition')}
              value="nutrition"
            >
              栄養バランス(AI)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipe">
            <Recipe itemsState={itemsState} foodFilePath={foodFilePath} />
          </TabsContent>

          <TabsContent value="nutrition">
            <Nutorition nutritionState={nutritionState} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Modal;
