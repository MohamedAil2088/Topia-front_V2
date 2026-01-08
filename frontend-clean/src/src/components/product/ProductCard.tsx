import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import Button from '../common/Button';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  category?: string;
  isNew?: boolean;
  discount?: number;
}

const ProductCard = ({
  id,
  name,
  price,
  image,
  rating = 0,
  category,
  isNew = false,
  discount = 0,
}: ProductCardProps) => {
  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden group">
      <div className="relative">
        <Link to={`/product/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
          />
        </Link>

        {isNew && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            جديد
          </span>
        )}

        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            خصم {discount}%
          </span>
        )}

        <button className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition opacity-0 group-hover:opacity-100">
          <FiHeart className="text-gray-700 hover:text-red-500" />
        </button>
      </div>

      <div className="p-4">
        {category && (
          <p className="text-gray-500 text-sm mb-1">{category}</p>
        )}

        <Link to={`/product/${id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-primary transition line-clamp-2">
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={`text-sm ${
                i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-gray-600 text-sm mr-2">({rating})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xl font-bold text-primary">
              {discountedPrice.toFixed(2)} ج.م
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through mr-2">
                {price.toFixed(2)} ج.م
              </span>
            )}
          </div>
        </div>

        <Button variant="primary" fullWidth size="sm">
          <FiShoppingCart className="ml-2" />
          أضف للسلة
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
