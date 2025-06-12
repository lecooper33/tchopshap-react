import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const MESSAGES = {
    start: "Préparation des ingrédients...",
    middle: "Mise en place des plats...",
    almostDone: "Dernières touches...",
    done: "C'est prêt !"
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 0.5;
        if (newProgress === 100) {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 800);
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  const getMessage = () => {
    if (progress < 30) return MESSAGES.start;
    if (progress < 60) return MESSAGES.middle;
    if (progress < 90) return MESSAGES.almostDone;
    return MESSAGES.done;
  };

  // Calculer la visibilité progressive du texte
  const textWidth = Math.min(progress * 2, 100); // Le texte apparaît deux fois plus vite que le chargement

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F97316',
        zIndex: 9999,
        gap: { xs: 3, sm: 4 },
        padding: { xs: '1rem', sm: '2rem' },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: { xs: '150px', sm: '200px' },
          height: { xs: '150px', sm: '200px' },
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid rgba(255, 255, 255, 0.15)',
          animation: 'bubbleBounce 3s ease-in-out infinite',
          '@keyframes bubbleBounce': {
            '0%, 100%': {
              transform: 'scale(1) translateY(0)',
            },
            '50%': {
              transform: 'scale(1.03) translateY(-5px)',
            }
          },
          '&::before, &::after, & .wave1, & .wave2, & .wave3': {
            content: '""',
            position: 'absolute',
            width: '250%',
            height: '250%',
            background: 'rgba(255,255,255,0.9)',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            top: `${100 - progress}%`,
            left: '-75%',
          },
          '&::before': {
            animation: 'waveRotate 8s linear infinite',
            opacity: 0.4,
            borderRadius: '45%',
          },
          '&::after': {
            animation: 'waveRotate 10s linear infinite',
            opacity: 0.3,
            borderRadius: '40%',
          },
          '& .wave1, & .wave2, & .wave3': {
            borderRadius: '42%',
          },
          '& .wave1': {
            animation: 'waveRotate 12s linear infinite',
            opacity: 0.4,
          },
          '& .wave2': {
            animation: 'waveRotate 14s linear infinite',
            opacity: 0.2,
          },
          '& .wave3': {
            animation: 'waveRotate 16s linear infinite',
            opacity: 0.3,
          },
          '@keyframes waveRotate': {
            '0%': {
              transform: 'rotate(0deg)',
            },
            '100%': {
              transform: 'rotate(360deg)',
            }
          }
        }}
      >
        <Box className="wave1" />
        <Box className="wave2" />
        <Box className="wave3" />
        <Typography
          variant="h2"
          sx={{
            position: 'relative',
            zIndex: 2,
            fontWeight: '700',
            fontSize: { xs: '2rem', sm: '3rem' },
            textAlign: 'center',
            userSelect: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: progress > 50 
              ? '#F97316' 
              : 'white',
            transition: 'color 0.5s ease',
          }}
        >
          {Math.round(progress)}%
        </Typography>
      </Box>      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: { xs: '150px', sm: '200px' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontFamily: 'system-ui',
            textAlign: 'center',
            letterSpacing: '-0.5px',
            fontSize: { xs: '1.8rem', sm: '2.5rem' },
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            userSelect: 'none',
            marginTop: { xs: 2, sm: 3 },
            position: 'relative',
            width: '100%',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: `${100 - textWidth}%`,
              height: '100%',
              backgroundColor: '#F97316',
              transition: 'width 0.3s ease-out',
            }
          }}
        >
          TchopShap
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'relative',
          textAlign: 'center',
          minHeight: '2em',
          px: 2,
          maxWidth: { xs: '300px', sm: '400px' },
          margin: '0 auto',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontWeight: '500',
            fontSize: { xs: '1rem', sm: '1.1rem' },
            opacity: 0.9,
            animation: 'fadeInOut 0.5s ease',
            '@keyframes fadeInOut': {
              '0%': { opacity: 0, transform: 'translateY(10px)' },
              '100%': { opacity: 0.9, transform: 'translateY(0)' },
            },
            userSelect: 'none',
          }}
        >
          {getMessage()}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
