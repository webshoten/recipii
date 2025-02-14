import { Nutorition } from '@/components/slideshow/modal/Nutrition';
import { Recipe } from '@/components/slideshow/modal/Recipe';
import { Ingredient } from '@/components/slideshow/Slideshow';
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

  useLayoutEffect(() => {
    if (ingredient && ingredient?.ingredients.length > 0) {
      setInputs(ingredient?.ingredients);
    } else {
      setInputs(() => [{ name: '', quantity: '' }]);
    }
  }, [ingredient, setInputs]);

  if (!isOpen) return null;

  const onModalClose = () => {
    if (
      ingredient?.ingredients.map((x) => {
        return { name: x.name, quantity: x.quantity };
      }) !== inputs
    ) {
      submitIngredient(inputs);
    }
    onClose();
  };

  return (
    <div className="absolute flex items-center justify-center">
      <div
        onClick={() => onModalClose() /** モーダルが閉じたとき */}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-0 top-0 left-0"
      ></div>
      <div className="bg-white rounded-lg p-6 w-full max-w-md z-50 h-[530px] fixed ">
        <Tabs defaultValue="recipe" className="w-full z-0">
          <TabsList className="grid w-full grid-cols-2 mb-10">
            <TabsTrigger className="z-20" value="recipe">
              レシピ
            </TabsTrigger>
            <TabsTrigger className="z-20" value="nutrition">
              栄養バランス(AI)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipe">
            <Recipe itemsState={itemsState} foodFilePath={foodFilePath} />
          </TabsContent>

          <TabsContent value="nutrition">
            <Nutorition
              itemsState={itemsState}
              nutritionState={nutritionState}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Modal;
