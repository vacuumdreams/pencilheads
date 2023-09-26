import { differenceInDays, intlFormatDistance } from 'date-fns';

type DateLabelProps = {
  prevDate?: Date;
  date: Date;
};

export function EventDateLabel({ prevDate, date }: DateLabelProps) {
  const now = new Date()
  const diff = prevDate ? differenceInDays(prevDate, date) : null;

  if (diff === 0) {
    return null;
  }

  return (
    <p className="flex items-center relative my-4 font-mono uppercase text-xl">
      <span className="absolute w-4 h-4 -ml-10 border border-4 border-background bg-gray-200 dark:bg-gray-700"></span>
      {intlFormatDistance(date, now)}
    </p>
  );
}
