import React from 'react';
import { Star } from 'lucide-react';

const Gallery = ({ activities }) => {
    return (
        <div className="w-full min-h-screen flex justify-center bg-gray-50 p-4">
            <div className="w-full grid grid-rows-2 grid-cols-1 gap-7 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 mb-24 sm:mb-0">
                {activities.length > 0 ? (
                    activities
                        .filter((activity) => activity.date_finished === true)
                        .map((activity) => (
                            <div
                                key={activity.id}
                                className="overflow-hidden h-fit rounded-lg"
                            >
                                <img
                                    src={activity.date_img}
                                    alt={activity.title}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <div className="p-2 flex justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium mb-1">{activity.title}</h3>
                                        <p className="text-gray-600 text-lg">{activity.description}</p>
                                    </div>
                                    <div className="flex h-fit items-center justify-center text-gray-600 text-sm">
                                        <span className="mr-1 text-lg flex justify-center items-center">{activity.rating}</span>
                                        <Star size={22} />
                                    </div>
                                </div>
                            </div>
                        ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">Nenhum date finalizado</p>
                )}
            </div>
        </div>
    );
};

export default Gallery;