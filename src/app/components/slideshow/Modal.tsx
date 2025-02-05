import { GenerateIngredientByAI } from '@/app/components/slideshow/server/GenerateIngredientByAI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getFoodImage } from '@/repository/food/getFoodImage';
import { Minus, Plus, X } from 'lucide-react';
import type React from 'react';
import { useLayoutEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: string[] | undefined;
  submitItems: (items: string[]) => void;
  foodFilePath: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  submitItems,
  items,
  foodFilePath,
}) => {
  const [inputs, setInputs] = useState<string[]>(items || ['']);

  // useLayoutEffect(() => {
  //   if (items) setInputs(items);
  // }, [items]);

  if (!isOpen) return null;

  const addInput = () => {
    setInputs([...inputs, '']);
  };

  const removeInput = (index: number) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const submit = () => {
    onClose();
    submitItems(inputs);
  };

  const generateIngredientByAI = async () => {
    const url = await getFoodImage(foodFilePath);
    const res = await GenerateIngredientByAI(url);
    setInputs(res);
  };

  return (
    <div className="absolute flex items-center justify-center opacity-85">
      <div
        onClick={() => submit() /** モーダルが閉じたとき */}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-0 top-0 left-0"
      ></div>
      <div className="bg-white rounded-lg p-6 w-full max-w-md z-50 fixed ">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold mb-4">レシピ</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {inputs.map((input, index) => (
          <div key={index} className="flex items-center mb-2">
            <Input
              className="flex-grow"
              placeholder={`入力欄 ${index + 1}`}
              value={input}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
            {inputs.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeInput(index)}
                className="ml-2"
              >
                <Minus className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <Button onClick={addInput}>
            <Plus className="h-4 w-4" />
          </Button>
          <div>
            <Button className="ml-1" onClick={() => generateIngredientByAI()}>
              AI食材生成
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
