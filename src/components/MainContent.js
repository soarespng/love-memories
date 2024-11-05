import { useState, useRef } from "react";
import { ImagePlus } from 'lucide-react';
import { BaseModal, FormField, ModalActions, ImageUpload } from '@/components/Modals';
import StarRating from '@/components/StarRating'; // Vamos criar este componente para a avaliação em estrelas

const MainContent = ({ activities, coupleData, userData, daysTogether }) => {
  const fileInputRef = useRef(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleTaskClick = (activity) => {
    setSelectedTask(activity);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
    setSelectedTask(null);
  };

  const handleConfirmYes = () => {
    setIsConfirmModalOpen(false);
    setIsDetailsModalOpen(true);
  };

  const handleDetailsClose = () => {
    setIsDetailsModalOpen(false);
  };

  const handleSaveDetails = async () => {
    try {
      const date_img = await UploadImage(selectedTask.id, selectedTask.collection_id, images[0]);

      const response = await fetch('/api/date/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date_id: selectedTask.id, rating, description, date_img: date_img }),
      });

      const data = await response.json();
    } catch {
      throw new Error(data.message || 'Erro ao finalizar date');
    }

    setIsDetailsModalOpen(false);
    setSelectedTask(null);
    setRating(0);
    setDescription('');
    setImages([]);
    setPreviewUrl(null);
  };

  const UploadImage = async (task_id, collection_id, file) => {
    try {
      const formData = new FormData();
      formData.append('task_id', task_id);
      formData.append('collection_id', collection_id);
      formData.append('file', file);


      const response = await fetch('/api/date/uploadImage', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer o upload da imagem');
      }

      return data.public_url;
    } catch (error) {
      console.error(error.message);
    }
  };

  const isLoading = !userData || userData.user1 == null || userData.user2 == null || !coupleData || !activities;

  return (
    <>
      {isLoading ? (
        <div className="text-center text-gray-500">Carregando dados...</div>
      ) : (
        <div className="min-h-screen w-full bg-gray-50">
          <div className="max-w-3xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow p-6 mb-4">
              <div className="flex items-center justify-center flex-col">
                {coupleData.couple_img ? (
                  <div className="relative w-52 h-52">
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

            <div className="space-y-4 mb-24 sm:mb-0">
              {activities.length > 0 ? (
                activities
                  .filter((activity) => activity.date_finished === false)
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 p-6 justify-between border rounded-lg bg-white cursor-pointer transition-colors"
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
                <p className="text-center text-gray-500">Nenhum date encontrado</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <BaseModal isOpen={isConfirmModalOpen} onClose={handleConfirmClose} title="Deseja concluir o date?">
        <ModalActions onClose={handleConfirmClose} onSubmit={handleConfirmYes} desagreeMessage={'Não'} agreeMessage={'Sim'} />
      </BaseModal>

      {/* Details Modal */}
      <BaseModal isOpen={isDetailsModalOpen} onClose={handleDetailsClose} title="Como foi o date?">
        <FormField label="Imagem">
          <ImageUpload
            previewUrl={previewUrl}
            onImageClick={handleImageClick}
            fileInputRef={fileInputRef}
          />
          <input
            required
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                setImages([file]);
              }
            }}
          />
        </FormField>
        <FormField label="Avaliação">
          <StarRating rating={rating} onRatingChange={setRating} />
        </FormField>
        <FormField label="Descrição">
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-2 resize-none"
            rows="4"
          />
        </FormField>
        <ModalActions onClose={handleDetailsClose} onSubmit={handleSaveDetails} agreeMessage={'Salvar'} desagreeMessage={'Cancelar'} />
      </BaseModal>
    </>
  );
};

export default MainContent;
