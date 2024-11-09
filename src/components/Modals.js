import { ImagePlus } from 'lucide-react';

const BaseModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex justify-center">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-lg font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="flex justify-center">
      {children}
    </div>
  </div>
);

const ModalActions = ({ onClose, onSubmit, agreeMessage, desagreeMessage }) => (
  <div className="flex gap-3 pt-2">
    <button
      type="button"
      onClick={onClose}
      className="flex-1 py-3 px-4 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:outline-none transition-colors"
    >
      {desagreeMessage}
    </button>
    <button
      type="submit"
      onClick={onSubmit}
      className="flex-1 py-3 px-4 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none transition-colors"
    >
      {agreeMessage}
    </button>
  </div>
);

const ImageUpload = ({ previewUrl, onImageClick, fileInputRef }) => (
  <button
    type="button"
    onClick={onImageClick}
    className="w-40 h-40 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
  >
    {previewUrl ? (
      <div className="relative w-full h-full">
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
          <ImagePlus className="w-8 h-8 text-white" />
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-full">
        <ImagePlus className="w-8 h-8 text-gray-400" />
      </div>
    )}
  </button>
);

export { BaseModal, FormField, ModalActions, ImageUpload };