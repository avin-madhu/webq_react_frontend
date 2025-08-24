import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BlurText from '../reactbits/TextAnimations/BlurText/BlurText';

const HeroPage = () => {
  const navigate = useNavigate();

  const handleAnimationComplete = () => {
  console.log('Animation completed!');
  };


  return (
    <main className="flex h-[100px] flex-col items-center justify-center min-h-screen bg-gradient-[#000000] from-slate-50 via-white to-slate-100">
        <BlurText
        text="Learning made simplified"
        delay={150}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="text-5xl font-sans text-sky-600 font-bold mb-8"
        />
      <p className="mt-4 text-lg text-slate-600">Your personalized learning journey starts here.</p>

      <button
        onClick={() => navigate('/Dashboard')}
        className="mt-8 flex items-center gap-2 bg-sky-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all transform hover:scale-105"
      >
        Go to Dashboard
        <ArrowRight size={20} />
      </button>
    </main>
  );
};

export default HeroPage;