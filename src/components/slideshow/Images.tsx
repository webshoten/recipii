import Image from 'next/image';

const Images = ({ target, onClick }: { target: File; onClick: () => void }) => {
  return (
    <>
      <Image
        src={URL.createObjectURL(target || '/placeholder.svg')}
        onClick={onClick}
        alt={target.name}
        className="w-full h-full object-contain rounded-lg shadow-lg"
        width={200}
        height={200}
      />
    </>
  );
};

export default Images;
