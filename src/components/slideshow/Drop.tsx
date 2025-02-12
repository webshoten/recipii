import { useDropzone } from 'react-dropzone';

export const Drop: React.FC<{
  onDrop: (oneFile: File[]) => Promise<void>;
}> = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
  });

  return (
    <>
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
    </>
  );
};
