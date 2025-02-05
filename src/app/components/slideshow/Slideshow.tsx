'use client';

import Images from '@/app/components/slideshow/Images';
import { LoadingSpinner } from '@/app/components/slideshow/LoadingSpinner';
import Modal from '@/app/components/slideshow/Modal';
import { NextButton } from '@/app/components/slideshow/NextButton';
import { PreviousButton } from '@/app/components/slideshow/PreviousButton';
import { putFood } from '@/repository/food/putFood';
import { putIngredient } from '@/repository/ingredient/putIngredient';
import { getRecipe } from '@/repository/recipe/getRecipe';
import { useLayoutEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export type Ingredient = { foodId: number; items: string[] };
export type Food = {
  id: number;
  name: string;
  yyyymmdd: string | null;
  file: File | null;
};

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const Slideshow = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [ingredients, setIngredients] = useState<Array<Ingredient>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canRender, setCanRender] = useState(false);

  useLayoutEffect(() => {
    console.log('call');
    if (canRender) return;

    getRecipe().then(async (res) => {
      setFoods((prev) => [...prev, ...res.foods]);
      /** 材料を[""]でセットする */
      setIngredients((prev) => [
        ...prev,
        ...res.ingredients.map((f) => {
          return { foodId: f.foodId, items: f.ingreds.map((x) => x.name) };
        }),
      ]);
      setCanRender(true);
    });
  }, []);

  useLayoutEffect(() => {
    if (foods.length > 0) goIndex(foods.length - 1);
  }, [foods]);

  const onDrop = async (oneFile: File[]) => {
    const res = await putFood(oneFile[0]);
    await setFoods((prev) => [
      ...prev,
      { id: res.id, name: res.name, yyyymmdd: res.yyyymmdd, file: oneFile[0] },
    ]);
    setIngredients((prev) => [...prev, { foodId: res.id, items: [''] }]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
  });

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

  const submitIngredient = (items: string[]) => {
    setCanRender(false);
    putIngredient({
      food_id: foods[currentIndex].id,
      ingred_names: items,
    }).then(async () => {
      setIngredients((prev) => {
        return [
          ...prev.filter((p) => p.foodId != foods[currentIndex].id),
          { foodId: foods[currentIndex].id, items: items },
        ];
      });
      await sleep(150);
      setCanRender(true);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>画像をドロップしてください...</p>
        ) : (
          <p>ここをクリックするか、画像をドラッグ＆ドロップしてアップロード</p>
        )}
      </div>
      {canRender ? (
        <div className="relative w-full max-w-2xl aspect-video">
          <Images
            target={foods[currentIndex]?.file}
            onClick={() => setIsModalOpen(!isModalOpen)}
          />
          <PreviousButton goTo={goToPrevious} />
          <NextButton goTo={goToNext} />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            {currentIndex + 1} / {foods.length}
          </div>
        </div>
      ) : (
        <LoadingSpinner className="w-[200px] h-[200px]" />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(!isModalOpen)}
        items={
          ingredients.find((i) => i.foodId == foods[currentIndex].id)?.items
        }
        submitItems={submitIngredient}
        foodFilePath={
          foods[currentIndex]?.yyyymmdd + '/' + foods[currentIndex]?.name
        }
      />
    </div>
  );
};

export default Slideshow;
