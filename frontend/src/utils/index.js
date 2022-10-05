export function isFalsy(obj) {
  let objectType;

  try {
    objectType = obj.constructor.name;
  } catch (err) {
    objectType = obj;
  }

  if (objectType === "Array") {
    return obj.length === 0;
  } else if (objectType === "Object") {
    return Object.keys(obj).length === 0;
  } else {
    throw new Error(`isFalsy does not support ${objectType} objects.`);
  }
}
