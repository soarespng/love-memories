import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import NewCollectionModal from '@/components/NewCollectionModal';

const NewDateModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [description, setDescription] = useState('');
  const [collections, setCollections] = useState([]);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (collections.length === 0 && isOpen) {
      setShowNewCollectionModal(false);
    }
  }, [isOpen, collections.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você implementa a lógica para salvar o date
    console.log({ title, selectedCollection, description });
    onClose();
  };

  const handleAddCollection = (newCollection) => {
    setCollections([...collections, newCollection]);
    setSelectedCollection(newCollection.title);
    setShowNewCollectionModal(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Novo Date</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full p-3 rounded-lg border border-gray-200"
                  required
                />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Coleção</label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="mt-1 w-full p-3 rounded-lg border border-gray-200 text-left flex justify-between items-center"
                    >
                      {selectedCollection || 'Selecione uma coleção'}
                      <span className="text-gray-400">▼</span>
                    </button>
                    
                    {isDropdownOpen && collections.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                        {collections.map((collection) => (
                          <button
                            key={collection.title}
                            type="button"
                            onClick={() => {
                              setSelectedCollection(collection.title);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100"
                          >
                            {collection.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewCollectionModal(true)}
                    className="mt-1 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full p-3 rounded-lg border border-gray-200"
                  rows={4}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>

        <NewCollectionModal 
          isOpen={showNewCollectionModal}
          onClose={() => setShowNewCollectionModal(false)}
          onAdd={handleAddCollection}
        />
      </div>
    </div>
  );
};

export default NewDateModal;