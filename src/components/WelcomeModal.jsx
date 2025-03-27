import React, { useState } from 'react';

const WelcomeModal = ({ onClose }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const slides = [
    {
      title: 'Bem-vindo!',
      content: 'Seja bem-vindo ao nosso sistema. Estamos felizes por tê-lo conosco!'
    },
    {
      title: 'Conheça nossos recursos',
      content: 'Explore as funcionalidades incríveis que preparamos para melhorar sua experiência.'
    },
    {
      title: 'Vamos começar',
      content: 'Pronto para iniciar? Clique em Fechar para começar a usar o sistema.'
    }
  ];

  const nextSlide = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">{slides[slideIndex].title}</h2>
        <p className="mb-6 text-center">{slides[slideIndex].content}</p>
        <div className="flex justify-between items-center">
          {slideIndex > 0 ? (
            <button onClick={prevSlide} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">
              Voltar
            </button>
          ) : (
            <div className="w-24"></div>
          )}
          {slideIndex < slides.length - 1 ? (
            <button onClick={nextSlide} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Próximo
            </button>
          ) : (
            <button onClick={closeModal} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              Fechar
            </button>
          )}
        </div>
        <div className="flex justify-center mt-4">
          {slides.map((_, idx) => (
            <div key={idx} className={`h-2 w-2 rounded-full mx-1 ${slideIndex === idx ? 'bg-blue-600' : 'bg-gray-300'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
