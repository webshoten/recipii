import { ItemsState, NutritionState } from '@/app/components/slideshow/Modal';
import { Generate5NutrientsByAI } from '@/app/components/slideshow/server/Generate5NutrientsByAI';
import { Progress } from '@/components/ui/progress';
import { Apple, Beef, Carrot, Fish, Wheat } from 'lucide-react';
import { useLayoutEffect } from 'react';

export const Nutorition: React.FC<{
  nutritionState: NutritionState;
  itemsState: ItemsState;
}> = ({ nutritionState, itemsState }) => {
  const [items] = itemsState;
  const [nutritions, setNutritions] = nutritionState;

  const generate5NutrientsByAI = async () => {
    const res = await Generate5NutrientsByAI(
      items.map((a) => {
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

  useLayoutEffect(() => {
    return () => {
      generate5NutrientsByAI().then(() => {
        console.log('success');
      });
    };
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
          <p className="text-sm text-muted-foreground">
            このお食事は全体的にバランスが良好です。特にタンパク質の摂取が理想的な範囲内にあります。
            ただし、脂質の摂取がやや少なめなので、オリーブオイルやアボカドなどの健康的な脂質を取り入れることをお勧めします。
          </p>
        </div>
      </div>
    </>
  );
};
