export interface RandomGroupDefinition<T> {
  title: string;
  members: T[];
  responsible: T;
}

interface RandomGroupMember {
  id: number;
}

export function buildRandomGroupDefinitions<T extends RandomGroupMember>(
  activeMembers: readonly T[],
  studentCount: number,
  groupSize: number,
  existingTitles: readonly string[],
  random = Math.random,
): RandomGroupDefinition<T>[] {
  if (
    !Number.isSafeInteger(studentCount) ||
    studentCount <= 0 ||
    studentCount > activeMembers.length ||
    !Number.isSafeInteger(groupSize) ||
    groupSize <= 0 ||
    studentCount % groupSize !== 0
  ) {
    throw new RangeError('Random group inputs must form complete groups.');
  }

  const shuffledMembers = [...activeMembers];
  for (let index = shuffledMembers.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffledMembers[index], shuffledMembers[randomIndex]] = [shuffledMembers[randomIndex], shuffledMembers[index]];
  }

  const titles = getAvailableGroupTitles(studentCount / groupSize, existingTitles);
  const selectedMembers = shuffledMembers.slice(0, studentCount);

  return titles.map((title, groupIndex) => {
    const members = selectedMembers.slice(groupIndex * groupSize, (groupIndex + 1) * groupSize);
    const responsibleIndex = Math.floor(random() * members.length);

    return {
      title: `Grupo ${title}`,
      members,
      responsible: members[responsibleIndex],
    };
  });
}

function getAvailableGroupTitles(count: number, existingTitles: readonly string[]) {
  const usedTitles = new Set(
    existingTitles.map((title) =>
      title.trim().replace(/^grupo\s+/i, '').toUpperCase(),
    ),
  );
  const titles: string[] = [];
  let index = 0;

  while (titles.length < count) {
    const title = getAlphabeticGroupTitle(index);
    if (!usedTitles.has(title)) {
      titles.push(title);
      usedTitles.add(title);
    }
    index++;
  }

  return titles;
}

function getAlphabeticGroupTitle(index: number) {
  let remaining = index + 1;
  let title = '';

  while (remaining > 0) {
    remaining--;
    title = String.fromCharCode(65 + (remaining % 26)) + title;
    remaining = Math.floor(remaining / 26);
  }

  return title;
}
