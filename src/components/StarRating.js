import { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const x = e.clientX - rect.left;
    
    // Se o mouse estiver na primeira metade da estrela
    if (x < width / 2) {
      setHoverRating(index + 0.5);
    } else {
      setHoverRating(index + 1);
    }
  };

  const handleClick = (value) => {
    setRating(value);
    onRatingChange?.(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const getStarFill = (index) => {
    const currentRating = hoverRating || rating;
    const difference = currentRating - index;

    if (difference >= 1) return 100;
    if (difference > 0) return 50;
    return 0;
  };

  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="relative cursor-pointer w-8 h-8"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const width = rect.width;
            const x = e.clientX - rect.left;
            const value = x < width / 2 ? index + 0.5 : index + 1;
            handleClick(value);
          }}
          onMouseMove={(e) => handleMouseMove(e, index)}
          onMouseLeave={handleMouseLeave}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 transition-colors duration-150"
          >
            <defs>
              <linearGradient id={`star-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset={`${getStarFill(index)}%`}
                  className="text-yellow-400"
                  style={{ stopColor: 'currentColor' }}
                />
                <stop
                  offset={`${getStarFill(index)}%`}
                  className="text-gray-200"
                  style={{ stopColor: 'currentColor' }}
                />
              </linearGradient>
            </defs>
            <Star
              fill={`url(#star-gradient-${index})`}
              stroke="currentColor"
              strokeWidth={1}
              className="text-gray-200"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default StarRating;