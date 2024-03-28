export const useArrays = () => {
  function arraysAreEqualIgnoreOrder(
    arr1: any[],
    arr2: any[],
    propName: string,
  ): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    const sortedArr1 = arr1.sort((a, b) =>
      a[propName].localeCompare(b[propName]),
    );
    const sortedArr2 = arr2.sort((a, b) =>
      a[propName].localeCompare(b[propName]),
    );
    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i][propName] !== sortedArr2[i][propName]) {
        return false;
      }
    }
    return true;
  }

  function arraysAreEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
        return false;
      }
    }
    return true;
  }

  return { arraysAreEqualIgnoreOrder, arraysAreEqual };
};
