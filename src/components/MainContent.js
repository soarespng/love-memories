import { useState, useRef } from "react";
import { ImagePlus } from 'lucide-react';

const MainContent = ({ activities, coupleData, userData, completedTasksCount, daysTogether }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  if (!coupleData || !userData.user1 || !userData.user2) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Carregando dados do casal...</p>
      </div>
    );
  }

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleTaskClick = (activity) => {
    setSelectedTask(activity);
    setIsModalOpen(true);
    setRating(0);
    setDescription('');
    setImages([]);
  };

  const handleFinishTask = () => {
    console.log('Tarefa finalizada:', {
      task: selectedTask,
      rating,
      description,
      images
    });
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <div className="flex items-center justify-center flex-col">
              <img src={coupleData.image_url} className="w-48 h-48 bg-blue-300 rounded-lg mb-4" />
              <h2 className="text-xl font-semibold">{`${userData.user1} & ${userData.user2}`}</h2>
              <p className="text-gray-600 text-sm">{daysTogether} dias juntos | {completedTasksCount} dates concluídos</p>
            </div>
          </div>

          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Dates pendentes</span>
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities
                .filter((activity) => activity.status === "pendente")
                .map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-4 justify-between border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleTaskClick(activity)}
                  >
                    <div>
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={activity.status === "completed"}
                      onChange={(e) => e.stopPropagation()}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                  </div>
                ))
            ) : (
              <p className="text-center text-gray-500">Nenhuma atividade encontrada</p>
            )}
          </div>
        </div >
      </div >
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-lg w-full max-w-md p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Finalizar Date</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="flex justify-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <ImagePlus className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Imagem</span>
                    </>
                  )}
                </button>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium">
                  Avaliação
                </label>
                <div className="flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-4xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Descrição
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Como foi o date?"
                  className="w-full p-3 border rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleFinishTask}
                className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
              >
                Finalizar
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default MainContent;