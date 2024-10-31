import { useState, useRef } from "react";
import { ImagePlus } from 'lucide-react';

const MainContent = ({ activities, coupleData, userData, daysTogether }) => {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleTaskClick = (activity) => {
    setSelectedTask(activity);
    setIsModalOpen(true);
    setRating(0);
    setDescription('');
    setImages([]);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50"> {/* Adicionado padding-top para evitar sobreposição */}
        <div className="max-w-3xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <div className="flex items-center justify-center flex-col">
              {coupleData && coupleData.couple_img ? (
                <div className="relative w-52 h-52"> {/* Tamanho fixo para imagem */}
                  <img
                    src={coupleData.couple_img}
                    alt="Imagem do casal"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                    <button onClick={handleImageClick}>
                      <ImagePlus className="w-8 h-8 text-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={handleImageClick}
                  className="flex flex-col items-center justify-center h-64 w-full border-2 border-dashed border-gray-300 cursor-pointer rounded-lg"
                >
                  <ImagePlus className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500 font-medium">Adicionar imagem do casal</span>
                </div>
              )}
              <h2 className="text-xl font-semibold mt-4">{`${userData.user1} & ${userData.user2}`}</h2>
              <p className="text-gray-600 text-sm">{daysTogether} dias juntos | dates concluídos</p>
            </div>
          </div>

          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Dates pendentes</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {activities && activities.length > 0 ? (
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
    </>
  );
}

export default MainContent;