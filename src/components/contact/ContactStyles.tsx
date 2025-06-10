'use client';

/**
 * Composant pour les styles CSS de la page contact
 */
const ContactStyles: React.FC = () => {
  return (
    <style jsx global>{`
      .bg-grid-pattern {
        background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
        background-size: 20px 20px;
      }
      
      @keyframes blob {
        0% { transform: scale(1) rotate(0deg); }
        33% { transform: scale(1.1) rotate(120deg); }
        66% { transform: scale(0.9) rotate(240deg); }
        100% { transform: scale(1) rotate(360deg); }
      }
      
      .animate-blob {
        animation: blob 8s infinite;
      }
      
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      
      .animation-delay-4000 {
        animation-delay: 4s;
      }
      
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }
    `}</style>
  );
};

export default ContactStyles; 