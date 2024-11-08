import { useState, useRef } from "react";
import { ImageUpload, ModalActions, BaseModal, FormField } from "@/components/Modals";

const CoupleProfile = ({ coupleData, userData, revalidateCoupleData }) => {
    const coupleFileInputRef = useRef(null);
    const [coupleImagePreviewUrl, setCoupleImagePreviewUrl] = useState(coupleData?.couple_img || null);
    const [coupleImage, setCoupleImage] = useState(null);
    const [coupleName, setCoupleName] = useState(coupleData?.couple_name || `${userData.user1} & ${userData.user2}`);
    const [sinceDate, setSinceDate] = useState(coupleData?.since || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleImageClick = () => {
        coupleFileInputRef.current?.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCoupleImagePreviewUrl(url);
            setCoupleImage(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let imageUrl = coupleData.couple_img;
            if (coupleImage) {
                imageUrl = await uploadCoupleImage(coupleData.id, coupleImage);
            }

            const response = await fetch('/api/couple/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    couple_id: coupleData.id,
                    couple_img: imageUrl,
                    couple_name: coupleName,
                    since: sinceDate,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao salvar as configurações");
            }

            revalidateCoupleData();
            setIsConfirmModalOpen(false);
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const uploadCoupleImage = async (couple_id, file) => {
        const formData = new FormData();
        formData.append('couple_id', couple_id);
        formData.append('file', file);

        const response = await fetch('/api/couple/uploadImage', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Erro ao fazer upload da imagem");

        return data.public_url;
    };

    console.log(coupleData);
    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div className="max-w-3xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow p-6 mb-4">
                    <h2 className="text-xl mb-6 font-semibold text-center">Configurações do Perfil</h2>

                    <FormField label="Imagem do casal">
                        <div className="flex justify-center">
                            {coupleImagePreviewUrl ? (
                                <div className="relative w-52 h-52">
                                    <img
                                        src={coupleImagePreviewUrl}
                                        alt="Imagem do casal"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                        <button onClick={handleImageClick} className="text-white">Editar</button>
                                    </div>
                                </div>
                            ) : (
                                <ImageUpload
                                    previewUrl={coupleImagePreviewUrl}
                                    onImageClick={handleImageClick}
                                    fileInputRef={coupleFileInputRef}
                                />
                            )}
                            <input
                                required
                                accept="image/*"
                                type="file"
                                ref={coupleFileInputRef}
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                        </div>
                    </FormField>

                    <FormField label="Nome personalizado (Opcional)">
                        <input
                            placeholder={coupleName}
                            onChange={(e) => setCoupleName(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />
                    </FormField>

                    <FormField label="Data que se conheceram">
                        <input
                            type="datetime-local"
                            value={sinceDate}
                            onChange={(e) => setSinceDate(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />
                    </FormField>

                    <ModalActions
                        onClose={() => setIsConfirmModalOpen(false)}
                        onSubmit={() => setIsConfirmModalOpen(true)}
                        agreeMessage="Salvar"
                        desagreeMessage="Cancelar"
                        isLoading={isSaving}
                    />

                    <BaseModal
                        isOpen={isConfirmModalOpen}
                        onClose={() => setIsConfirmModalOpen(false)}
                        title="Salvar Alterações?"
                    >
                        <p className="text-center">Deseja salvar as alterações feitas no perfil?</p>
                        <ModalActions
                            onClose={() => setIsConfirmModalOpen(false)}
                            onSubmit={handleSave}
                            agreeMessage="Sim"
                            desagreeMessage="Não"
                            isLoading={isSaving}
                        />
                    </BaseModal>
                </div>
            </div>
        </div>
    );
};

export default CoupleProfile;
