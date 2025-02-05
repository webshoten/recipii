import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export const NextButton = ({ goTo }: { goTo: () => void }) => {
  return (
    <Button
      onClick={goTo}
      className="absolute top-1/2 right-4 transform -translate-y-1/2"
      aria-label="次の画像"
    >
      <ChevronRight className="h-12 w-12" />
    </Button>
  );
};
