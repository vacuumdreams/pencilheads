import Lottie, { LottieComponentProps } from 'lottie-react';
import pencilhead from './resources/pencilhead.json';
import whiteNoise from './resources/white-noise.json';

const animationNames = {
  'pencilhead': pencilhead,
  'white-noise': whiteNoise,
} as const;

type AnimationName = keyof typeof animationNames;

type AnimationProps = Omit<LottieComponentProps, 'animationData'> & {
  name: AnimationName;
};

export const Animation = ({ name, ...props }: AnimationProps) => {
  return <Lottie animationData={animationNames[name]} {...props} />;
};
