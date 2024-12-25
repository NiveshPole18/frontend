import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Traditional', image: 'https://banner2.cleanpng.com/20240305/ect/transparent-cambodian-woman-cartoon-traditional-chinese-dress-woman-in-green-chinese-dress-with-1710850618511.webp' },
  { name: 'Western', image: 'https://img.lovepik.com/original_origin_pic/18/12/07/2aa70c4bd896c6af975fc17cb6a2b60d.png_wh860.png' },
  { name: 'Trendy', image: 'https://freedesignfile.com/upload/2015/08/Cartoon-evening-dress-fashion-vector-illustration-01.jpg' },
];

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-8">
        Welcome to Mytalorzone By Sahiba
      </h1>
      <p className="text-xl text-center mb-12 text-gray-700 max-w-2xl">
        Discover creative, unique, and diverse clothing for girls, including traditional, western, and trendy styles.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {categories.map((category) => (
          <div key={category.name} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
            <img src={category.image} alt={category.name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{category.name}</h2>
              <Link
                to={`/products?category=${category.name.toLowerCase()}`}
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-600 transition duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

