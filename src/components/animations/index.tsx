import Lottie, { LottieComponentProps } from 'lottie-react';
import pencilhead from './resources/pencilhead.json';
import sleepyPencil from './resources/sleepy-pencil.json';
import strongPencil from './resources/strong-pencil.json';
import confusedPencil from './resources/confused-pencil.json';
import smartPencil from './resources/smart-pencil.json';
import whiteNoise from './resources/white-noise.json';

const animationNames = {
  'pencilhead': pencilhead,
  'white-noise': whiteNoise,
  'sleepy-pencil': sleepyPencil,
  'strong-pencil': strongPencil,
  'confused-pencil': confusedPencil,
  'smart-pencil': smartPencil,
} as const;

type AnimationName = keyof typeof animationNames;

type AnimationProps = Omit<LottieComponentProps, 'animationData'> & {
  name: AnimationName;
};

export const Animation = ({ name, ...props }: AnimationProps) => {
  return <Lottie animationData={animationNames[name]} {...props} />;
};
