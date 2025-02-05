import { LoadingSpinner } from '@/app/components/slideshow/LoadingSpinner';
import Image from 'next/image';
import { useLayoutEffect } from 'react';

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const Images = ({
  target,
  onClick,
}: {
  target: File | null;
  onClick: () => void;
}) => {
  useLayoutEffect(() => {
    sleep(1000);
  }, [target]);

  if (target == null) {
    return <LoadingSpinner className="w-44" />;
  }


  return (
    <Image
      src={URL.createObjectURL(target || '/placeholder.svg')}
      onClick={onClick}
      alt={target.name}
      className="w-full h-full object-contain rounded-lg shadow-lg"
      width={200}
      height={200}
    />
  );
};

export default Images;
