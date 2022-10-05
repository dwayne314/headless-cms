import { isFalsy } from "../index.js";

describe("utils", () => {
  describe("isFalsy", () => {
    it("returns true if an Array has no items", () => {
      const arrayWithoutItems = [];
      expect(isFalsy(arrayWithoutItems)).toBe(true);
    });

    it("returns false if an Array has 1 item", () => {
      const arrayWithOneItem = [1];
      expect(isFalsy(arrayWithOneItem)).toBe(false);
    });

    it("returns false if an Array has more than 1 item", () => {
      const arrayWithTwoItems = [1, 2];
      expect(isFalsy(arrayWithTwoItems)).toBe(false);
    });

    it("returns true if an Object has no keys", () => {
      const objectWithoutKeys = {};
      expect(isFalsy(objectWithoutKeys)).toBe(true);
    });

    it("returns false if an Object has 1 key", () => {
      const objectWithOneKey = { firstKey: 1 };
      expect(isFalsy(objectWithOneKey)).toBe(false);
    });

    it("returns false if an Object has more than 1 key", () => {
      const objectWithTwoKeys = { firstKey: 1, secondKey: 2 };
      expect(isFalsy(objectWithTwoKeys)).toBe(false);
    });

    it("throws an number error if the object is a falsy Number", () => {
      const invalidObject = 0;
      expect(() => {
        isFalsy(invalidObject);
      }).toThrow("isFalsy does not support Number objects");
    });

    it("throws an number error if the object is a positive Number", () => {
      const invalidObject = 3;
      expect(() => {
        isFalsy(invalidObject);
      }).toThrow("isFalsy does not support Number objects");
    });

    it("throws an null error if the object is null", () => {
      const nullObject = null;
      expect(() => {
        isFalsy(nullObject);
      }).toThrow("isFalsy does not support null objects");
    });

    it("throws an undefined error if the object is undefined", () => {
      const nullObject = undefined;
      expect(() => {
        isFalsy(nullObject);
      }).toThrow("isFalsy does not support undefined objects");
    });
  });
});
