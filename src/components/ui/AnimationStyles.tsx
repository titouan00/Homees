'use client';

/**
 * Composant contenant tous les styles d'animation CSS
 * Inclut les animations pour blobs, float, fade-in, slide-up, etc.
 */
export default function AnimationStyles() {
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
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes float-delayed {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
      }
      
      .animate-blob {
        animation: blob 8s infinite;
      }
      
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      
      .animate-float-delayed {
        animation: float-delayed 3s ease-in-out infinite;
        animation-delay: 1s;
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
      
      @keyframes slideUp {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      .animate-fade-in {
        animation: fadeIn 1s ease-out forwards;
      }
      
      .animate-fade-in-delayed {
        animation: fadeIn 1s ease-out 0.3s forwards;
        opacity: 0;
      }
      
      .animate-fade-in-delayed-2 {
        animation: fadeIn 1s ease-out 0.6s forwards;
        opacity: 0;
      }
      
      .animate-fade-in-delayed-3 {
        animation: fadeIn 1s ease-out 0.9s forwards;
        opacity: 0;
      }
      
      .animate-slide-up {
        animation: slideUp 0.8s ease-out forwards;
      }
      
      [data-animate] {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;
      }
      
      [data-animate].animate-slide-up {
        opacity: 1;
        transform: translateY(0);
      }
    `}</style>
  );
} 