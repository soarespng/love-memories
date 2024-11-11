import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Share2, Star, StarHalf, X } from 'lucide-react';

const Gallery = ({ activities }) => {
    const [selectedActivity, setSelectedActivity] = useState(null);
    const shareContentRef = useRef(null);

    const handleCardClick = (activity) => {
        setSelectedActivity(activity);
    };

    const closeModal = () => {
        setSelectedActivity(null);
    };

    const downloadImage = () => {
        if (shareContentRef.current === null) return;

        toPng(shareContentRef.current, {
            cacheBust: true,
            backgroundColor: '#ffffff',
            quality: 1,
            pixelRatio: 2
        })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `love-memories-${selectedActivity.destiny}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Error generating the image:', err);
            });
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} size={24} className={i < rating ? "fill-yellow-400 stroke-yellow-400" : "fill-gray-200"} />);
        }
        if (halfStar) {
            stars.push(<StarHalf key="half" size={24} className={"fill-yellow-400 stroke-yellow-400"} />);
        }
        return stars;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    return (
        <div className="w-full min-h-screen flex justify-center bg-gray-50 p-4">
            <div className="w-full grid grid-cols-1 gap-7 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 mb-24 sm:mb-0">
                {activities.length > 0 && activities.filter((activity) => activity.date_finished === true).length > 0 ? (
                    activities
                        .filter((activity) => activity.date_finished === true)
                        .map((activity) => (
                            <div
                                key={activity.id}
                                className="bg-white overflow-hidden h-fit rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                onClick={() => handleCardClick(activity)}
                            >
                                <img
                                    src={activity.date_img}
                                    alt={activity.destiny}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold">{activity.destiny}</h3>
                                        <Share2 className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">{activity.date_event}</p>
                                    <div className="flex items-center space-x-1">
                                        {renderStars(activity.rating)}
                                    </div>
                                </div>
                            </div>
                        ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">Nenhuma memória registrada ainda</p>
                )}
            </div>

            {selectedActivity && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-xl w-full p-4 relative">
                        <button
                            onClick={closeModal}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div ref={shareContentRef} className="bg-white rounded-lg">
                            {/* Header */}
                            <div className="text-sm border-b mb-4  text-gray-500 tracking-wider">
                                <div className='mb-4 flex justify-center items-center'>
                                    <img className='h-10 mr-3' src='/icons/icon.png' />
                                    <h1 className='font-semibold text-2xl text-red-300'>Love Memories</h1>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-2">
                                    <img
                                        src={selectedActivity.date_img}
                                        alt={selectedActivity.destiny}
                                        className="col-span-3 w-full h-40 object-cover rounded-lg"
                                    />
                                </div>

                                <div>
                                    <div className="border-b pb-4 mb-4">
                                        <div className="text-sm flex justify-between text-gray-500 uppercase tracking-wider mb-1">
                                            <span>{selectedActivity.category}</span>
                                            {selectedActivity?.calendar ? formatDate(selectedActivity.calendar) : null}
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">{selectedActivity.destiny}</h2>
                                    <p className="text-gray-600 text-base mb-4">{selectedActivity.description}</p>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div className="flex items-center space-x-1">
                                        {renderStars(selectedActivity.rating)}
                                    </div>
                                    <div className="text-lg text-gray-500">
                                        {selectedActivity.date_event}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={downloadImage}
                                className="flex-1 py-3 px-4 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none transition-colors"
                                >
                                Baixar
                            </button>
                            
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;