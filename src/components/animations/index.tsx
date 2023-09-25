import Lottie, { LottieComponentProps } from 'lottie-react';
import pencilhead from './resources/pencilhead.json';

const animationNames = {
  'pencilhead': pencilhead,
} as const;

type AnimationName = keyof typeof animationNames;

type AnimationProps = Omit<LottieComponentProps, 'animationData'> & {
  name: AnimationName;
};

export const Animation = ({ name }: AnimationProps) => {
  return <Lottie animationData={animationNames[name]} />;
};
