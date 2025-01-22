'use client';

import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

export function UploadPreview() {
  const [images, setImages] = useState<Blob[]>([]);

  const handleOnAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages([...e.target.files]);
  };

  return (
    <>
      <label htmlFor="image">Image</label>
      <input
        type="file"
        id="image"
        name="image"
        required
        onChange={handleOnAddImage}
      />
      <button>Upload</button>
      {images.map((image, i) => (
        <Image
          key={i}
          src={URL.createObjectURL(image)}
          alt="Image"
          width={200}
          height={200}
          objectFit="cover"
        />
      ))}
    </>
  );
}
