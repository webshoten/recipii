import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export const PreviousButton = ({ goTo }: { goTo: () => void }) => {
  return (
    <Button
      onClick={goTo}
      className="absolute top-1/2 left-4 transform -translate-y-1/2"
      aria-label="前の画像"
    >
      <ChevronLeft className="h-12 w-12" />
    </Button>
  );
};
