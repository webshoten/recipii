import { ItemsState, NutritionState } from '@/components/slideshow/modal/Modal';
import { Progress } from '@/components/ui/progress';
import { analyze5Nutrients } from '@/lib/generate5NutrientsByAI';
import { generateAdvice } from '@/lib/generateAdviceByAI';
import { Apple, Beef, Carrot, Fish, Wheat } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Nutorition: React.FC<{
  nutritionState: NutritionState;
  itemsState: ItemsState;
}> = ({ nutritionState, itemsState }) => {
  const [items] = itemsState;
  const [nutritions, setNutritions] = nutritionState;
  const [advice, setAdvice] = useState('');

  const generate5NutrientsByAI = async () => {
    const res = await analyze5Nutrients(
      items.map((a) => {
        return { name: a.name, quantity: a.quantity + 'g' };
      }),
    );
    const fiveNutritions = {
      carbohydrate: Number(res.find((a) => a.name === '炭水化物')?.percent),
      fat: Number(res.find((a) => a.name === '脂質')?.percent),
      mineral: Number(res.find((a) => a.name === 'ミネラル')?.percent),
      protein: Number(
        res.find((a) => a.name === 'タンパク質' || a.name === 'たんぱく質')
          ?.percent,
      ),
      vitamin: Number(res.find((a) => a.name === 'ビタミン')?.percent),
    };
    setNutritions(fiveNutritions);
    return res;
  };

  useEffect(() => {
    return () => {
      generate5NutrientsByAI().then((res) => {
        console.log('5n');
        generateAdvice(res).then((r) => {
          console.log('advice');
          setAdvice(r);
        });
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <Wheat className="w-5 h-5 text-yellow-500" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div>炭水化物</div>
                <div>{nutritions?.carbohydrate}%</div>
              </div>
              <Progress value={nutritions?.carbohydrate} className="h-2" />
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
          {advice && <p className="text-sm text-muted-foreground">{advice}</p>}
        </div>
      </div>
    </>
  );
};
