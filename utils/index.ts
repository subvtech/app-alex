// Gets the return of stringLiterals and convert this => ('goiaba' | 'maconha')[] to 'goiaba' | 'maconha'
import {
  compareDesc,
  isAfter,
  isBefore,
  isSameDay,
  isEqual,
  isWithinInterval,
} from 'date-fns';
export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementType> ? ElementType : never;

const extensions = literalArray('.jpeg', '.jpg', '.png', '.webp');

export async function createFileFromUrl(
  url: string,
  name: string,
  extension: ElementType<typeof extensions> | (string & {}) = '.jpg',
) {
  const response = await fetch(url);
  const data = await response.blob();
  const metadata = {
    type: `image/${extension.replace('.', '')}`,
  };
  const file = new File([data], name, metadata);

  return file;
}

export function withTimeout<T>(ms: number, promise: Promise<T>): Promise<T> {
  const timeout = new Promise<T>((_resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`Timed out in ${ms}ms.`));
    }, ms);
  });

  return Promise.race([promise, timeout]);
}

// Iinstead return of string[], gonna return a type of each element of array ex:
// ['goiaba' | 'maconha'] =>  type = ('goiaba' | 'maconha')[]
export function literalArray<T extends string>(...args: T[]): T[] {
  return args;
}

export const formRules = {
  requiredRule: (val: string) => !!val || 'Campo obrigatório',
  min5CharactersRule: (val: string) =>
    (val && val.length >= 5) || 'Mínimo de 5 caracteres',
};

export const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length >= 2 && names[1][0] !== '(') {
    return names[0][0] + names[1][0];
  }

  return names[0][0];
};

export const sortByDate = <T extends { date: string | Date }>(array: T[]) =>
  array.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const isMessage = (
  response?: Message | AttachedSubmission,
): response is Message => {
  if (!response) return false;
  return 'user' in response;
};

export const scrollAndHighlightElement = (
  querySelector: string,
  highlightClass: string,
) => {
  const element = document.querySelector(querySelector);
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  element.classList.add(highlightClass);
  setTimeout(() => {
    element.classList.remove(highlightClass);
  }, 1000);
};
interface EventProps {
  user?: string;
  action: string;
  time: string | Date;
}
export const orderEvents = (events: TaskEvent[]) => {
  const eventsGroups: { date: Date; events: EventProps[] }[] = [];

  events
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .forEach((current) => {
      const currentDate = new Date(current.updatedAt);
      const currentElement: EventProps = {
        action: current.event,
        time: current.updatedAt,
        user: current.learning_plan_member.user.fullname,
      };
      const group = eventsGroups.find((group) =>
        isSameDay(currentDate, new Date(group.date)),
      );
      if (group) {
        group.events.push(currentElement);
        return;
      }
      eventsGroups.push({
        date: currentDate,
        events: [currentElement],
      });
    });

  return eventsGroups;
};

export const checkIntervalOfDates = (
  initial: Date,
  first?: string,
  second?: string,
) => {
  if (!first && !second) {
    return true;
  }
  if (first && second) {
    return isWithinInterval(initial, {
      start: new Date(first),
      end: new Date(second).setHours(23, 59, 59),
    });
  }
  if (first) {
    const firstDate = new Date(first);
    return isAfter(initial, firstDate) || isEqual(initial, firstDate);
  }
  if (second) {
    const secondDate = new Date(second).setHours(23, 59, 59);
    return isBefore(initial, secondDate) || isEqual(initial, secondDate);
  }
};
