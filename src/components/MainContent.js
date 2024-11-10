import { useState, useRef } from "react";
import { ImagePlus } from 'lucide-react';
import { BaseModal, FormField, ModalActions, ImageUpload } from '@/components/Modals';
import StarRating from '@/components/StarRating';

const MainContent = ({ setActiveSection, activities, coupleData, userData, daysTogether, finishedActivities, revalidateData, revalidateCoupleData }) => {
  const fileInputRef = useRef(null);
  const coupleFileInputRef = useRef(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCoupleImageModalOpen, setIsCoupleImageModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [coupleImages, setCoupleImages] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [couplePreviewUrl, setCouplePreviewUrl] = useState(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  }

  const handleCoupleImageClick = () => {
    coupleFileInputRef.current?.click();
  };

  const handleCoupleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCouplePreviewUrl(url);
      setCoupleImages([file]);
      setIsCoupleImageModalOpen(true);
    }
  };

  const handleSaveCoupleImage = async () => {
    try {
      const imageUrl = await UploadCoupleImage(coupleData.id, coupleImages[0]);
      revalidateCoupleData();
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsCoupleImageModalOpen(false);
      setCouplePreviewUrl(null);
      setCoupleImages([]);
    }
  };

  const handleEditTaskClick = (activity) => {
    setSelectedTask(activity);
    setIsEditModalOpen(true);
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
    setPreviewUrl(null);
  };

  const handleCoupleImageClose = () => {
    setIsCoupleImageModalOpen(false);
    setCouplePreviewUrl(null);
  };

  const handleSaveDetails = async () => {
    try {
      const date_img = await UploadImage(selectedTask.id, selectedTask.collection_id, images[0]);

      const response = await fetch('/api/date/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date_id: selectedTask.id, rating, description, date_img }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao finalizar date');
    } catch (error) {
      console.error(error.message);
    }

    setIsDetailsModalOpen(false);
    setSelectedTask(null);
    setRating(0);
    setDescription('');
    setImages([]);
    setPreviewUrl(null);
    revalidateData();
  };

  const saveDateChanges = async (task) => {
    try {
      const response = await fetch('/api/date/updateDate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, destiny: task.destiny, dateEvent: task.date_event, calendar: task.calendar }),
      });
      if (!response.ok) throw new Error('Erro ao salvar alterações do date');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDate = async (dateId) => {
    try {
      const response = await fetch(`/api/date/delete/${dateId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao excluir date');
    } catch (error) {
      console.error(error);
    }
    revalidateData();
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
      if (!response.ok) throw new Error(data.message || 'Erro ao fazer o upload da imagem');

      return data.public_url;
    } catch (error) {
      console.error(error.message);
    }
  };

  const UploadCoupleImage = async (couple_id, file) => {
    try {
      const formData = new FormData();
      formData.append('couple_id', couple_id);
      formData.append('file', file);

      const response = await fetch('/api/couple/uploadImage', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao fazer o upload da imagem');

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
                      <button onClick={handleCoupleImageClick}>
                        <ImagePlus className="w-8 h-8 text-white" />
                        <input
                          accept="image/*"
                          type="file"
                          ref={coupleFileInputRef}
                          style={{ display: "none" }}
                          onChange={handleCoupleImageChange}
                        />
                      </button>
                    </div>
                  </div>
                ) : (
                  <FormField>
                    <ImageUpload
                      previewUrl={couplePreviewUrl}
                      onImageClick={handleCoupleImageClick}
                      fileInputRef={coupleFileInputRef}
                    />
                    <input
                      type="file"
                      ref={coupleFileInputRef}
                      style={{ display: "none" }}
                      onChange={handleCoupleImageChange}
                    />
                  </FormField>
                )}
                <div className="flex justify-center items-center flex-col mt-4">
                  <h2 className="text-xl font-semibold">{coupleData?.couple_name || `${userData.user1} & ${userData.user2}`}</h2>
                  <p className="text-gray-600 text-sm">{daysTogether} dias juntos | {finishedActivities} dates concluídos</p>
                  <div className="w-full mt-2">
                    <button onClick={() => setActiveSection("coupleProfile")} className="bg-red-300 w-full rounded-md text-white p-2">Editar perfil</button>
                  </div>
                </div>
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
              {activities.length > 0 && activities.filter((activity) => activity.date_finished === false).length > 0 ? (
                activities
                  .filter((activity) => !activity.date_finished)
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 p-6 justify-between border rounded-lg bg-white cursor-pointer transition-colors"
                      onClick={() => handleEditTaskClick(activity)}
                    >
                      <div>
                        <h3 className="font-semibold">{activity.destiny}</h3>
                        <p className="text-sm text-gray-600">{activity.date_event}</p>
                        <p className="text-sm text-gray-600">
                          {activity?.calendar ? new Date(activity.calendar).toLocaleDateString('pt-BR') : null}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={activity.date_finished}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick(activity);
                        }}
                        onChange={(e) => e.stopPropagation()}
                        className="w-7 h-7 rounded border-gray-300"
                      />
                    </div>
                  ))
              ) : (
                <div className="flex justify-center">
                  <p className="text-gray-500">Nenhum date pendente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BaseModal isOpen={isConfirmModalOpen} onClose={handleConfirmClose} title="Finalizar?">
        <p className="flex justify-center">Tem certeza que deseja finalizar o date?</p>
        <ModalActions agreeMessage="Sim" desagreeMessage="Não" onClose={handleConfirmClose} onSubmit={handleConfirmYes} />
      </BaseModal>

      <BaseModal isOpen={isDetailsModalOpen} onClose={handleDetailsClose} title="Detalhes do date">
        <FormField label="Imagem">
          <ImageUpload previewUrl={previewUrl} onImageClick={() => fileInputRef.current?.click()} fileInputRef={fileInputRef} onImageChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const url = URL.createObjectURL(file);
              setPreviewUrl(url);
              setImages([file]);
            }
          }} />
          <input
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
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-lg p-2 resize-none" rows="4" />
        </FormField>
        <ModalActions onClose={handleDetailsClose} onSubmit={handleSaveDetails} agreeMessage="Salvar" desagreeMessage="Cancelar" />
      </BaseModal>

      <BaseModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Date">
        <FormField label="Destino">
          <input 
            type="text" 
            value={selectedTask?.destiny || ''} 
            onChange={(e) => setSelectedTask({ ...selectedTask, destiny: e.target.value })} 
            className="w-full border rounded-lg p-2" />
        </FormField>
        <FormField label="Evento">
          <input 
          type="text" 
          value={selectedTask?.date_event || ''} 
          onChange={(e) => setSelectedTask({ ...selectedTask, date_event: e.target.value })} 
          className="w-full border rounded-lg p-2" />
        </FormField>
        <FormField label="Data">
          <input type="datetime-local" 
          value={selectedTask?.calendar ? new Date(selectedTask.calendar).toISOString().slice(0,16)  : ''} 
          onChange={(e) => setSelectedTask({ ...selectedTask, calendar: e.target.value })} 
          className="w-full border rounded-lg p-2" />
        </FormField>
        <ModalActions onClose={() => setIsEditModalOpen(false)} onSubmit={async () => {
          await saveDateChanges(selectedTask);
          setIsEditModalOpen(false);
          revalidateData();
        }} agreeMessage="Salvar" desagreeMessage="Cancelar" />
        <button onClick={async () => {
          await deleteDate(selectedTask.id);
          setIsEditModalOpen(false);
        }} className="bg-red-500 text-white w-full py-3 px-4 rounded-xl mt-4">Excluir Date</button>
      </BaseModal>

      <BaseModal isOpen={isCoupleImageModalOpen} onClose={handleCoupleImageClose} title="Imagem do casal">
        <div className="flex justify-center mb-2">
          <ImageUpload previewUrl={couplePreviewUrl} fileInputRef={coupleFileInputRef} onImageClick={handleCoupleImageClick} />
        </div>
        <ModalActions onClose={handleCoupleImageClose} onSubmit={handleSaveCoupleImage} agreeMessage="Salvar" desagreeMessage="Cancelar" />
      </BaseModal>
    </>
  );
};

export default MainContent;
