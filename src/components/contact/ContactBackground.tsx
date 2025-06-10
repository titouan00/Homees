'use client';

/**
 * Composant Background animé de la page contact - Design préservé exactement
 */
const ContactBackground: React.FC = () => {
  return (
    <>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 py-1">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
    </>
  );
};

export default ContactBackground; 