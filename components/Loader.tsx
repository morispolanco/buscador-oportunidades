
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
      <h2 className="text-2xl font-semibold text-gray-200">Generando Oportunidades...</h2>
      <p className="text-gray-400 max-w-md">Nuestra IA está analizando mercados y formulando soluciones. Esto podría tardar un momento.</p>
    </div>
  );
};

export default Loader;
