'use client';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { NextButton } from '@/components/common/NextButton';
import { PreviousButton } from '@/components/common/PreviousButton';
import { Drop } from '@/components/slideshow/Drop';
import Images from '@/components/slideshow/Images';
import Modal, { Items } from '@/components/slideshow/modal/Modal';
import { putFood } from '@/repository/server/food/putFood';
import {
  putIngredient,
  PutIngredientResponse,
} from '@/repository/server/ingredient/putIngredient';
import { getRecipe } from '@/repository/server/recipe/getRecipe';
import { useCallback, useLayoutEffect, useState } from 'react';

export type Item = {
  name: string;
  quantity: string;
};

export type Ingredient = {
  foodId: number;
  ingredients: {
    id: number;
    name: string;
    quantity: string | null;
  }[];
};

export type Food = {
  id: number;
  name: string;
  yyyymmdd: string | null;
  file: File | null;
};

const Slideshow = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canRender, setCanRender] = useState(false);

  useLayoutEffect(() => {
    if (canRender) return;

    getRecipe().then(async (res) => {
      setFoods((prev) => [...prev, ...res.foods]);
      setIngredients((prev) => [...prev, ...res.ingredients]);
      setCanRender(true);
    });
  }, [canRender]);

  useLayoutEffect(() => {
    if (foods.length > 0) goIndex(foods.length - 1);
  }, [foods]);

  const onDrop = async (oneFile: File[]) => {
    const res = await putFood(oneFile[0]);
    await setFoods((prev) => [
      ...prev,
      { id: res.id, name: res.name, yyyymmdd: res.yyyymmdd, file: oneFile[0] },
    ]);

    await setIngredients((prev) => [
      ...prev,
      { foodId: res.id, ingredients: [] },
    ]);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? foods.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === foods.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goIndex = (i: number) => {
    setCurrentIndex(() => i);
  };

  const submitIngredient = (items: Items) => {
    putIngredient({
      food_id: foods[currentIndex].id,
      ingreds: items,
    }).then(async (res: PutIngredientResponse) => {
      setIngredients((prev) => {
        return [
          ...prev,
          {
            foodId: foods[currentIndex].id,
            ingredients: res.map((x) => {
              return {
                id: x.ingredientId,
                name: x.ingredientName || '',
                quantity: x.quantity,
              };
            }),
          },
        ];
      });
    });
  };

  const toggleModal = useCallback((param: boolean) => {
    setIsModalOpen(param);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Drop onDrop={onDrop} />

      <div className="relative w-full max-w-2xl aspect-video">
        {canRender ? (
          <>
            {foods.length !== 0 && (
              <>
                <Images
                  target={foods[currentIndex]?.file as File}
                  onClick={() => toggleModal(true)}
                />
                <PreviousButton goTo={goToPrevious} />
                <NextButton goTo={goToNext} />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                  {currentIndex + 1} / {foods.length}
                </div>
              </>
            )}
          </>
        ) : (
          <LoadingSpinner className="absolute top-0 left-0 right-0 bottom-0 m-auto rounded w-[200px] h-[200px]" />
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => toggleModal(false)}
        ingredient={ingredients.find((i) => i.foodId == foods[currentIndex].id)}
        submitIngredient={submitIngredient}
        foodFilePath={
          foods[currentIndex]?.yyyymmdd + '/' + foods[currentIndex]?.name
        }
      />
    </div>
  );
};

export default Slideshow;
