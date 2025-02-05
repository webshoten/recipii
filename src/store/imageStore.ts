import { create } from 'zustand';

type ImagesStore = {
  images: File[];
  addImage: (file: File) => void;
  removeImage: (file: File) => void;
};

export const useImageStore = create<ImagesStore>((set) => ({
  images: [],
  addImage: (image) => set((state) => ({ images: [...state.images, image] })),
  removeImage: (image) =>
    set((state) => ({ images: state.images.filter((t) => t !== image) })),
}));
