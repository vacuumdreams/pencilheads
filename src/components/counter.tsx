import React from 'react'

type CounterProps = {
  from: number
  to: number
  timeout: number
  onStep?: (count: number) => number
}

function useInterval(callback: (id: NodeJS.Timeout) => void, delay: number) {
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current(id);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export const Counter = ({ from, to, timeout, onStep = (n) => n + 1 }: CounterProps) => {
  const [count, setCounter] = React.useState(from)

  useInterval((id) => {
    if (count === to) {
      clearInterval(id);
      return;
    }
    setCounter(onStep(count));
  }, timeout / Math.abs(to - from));

  return (
    <span>{count}</span>
  )
}
