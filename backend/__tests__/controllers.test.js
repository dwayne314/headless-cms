import homeController from "../api/controllers/home.js";

describe("Controllers", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockRequest = (sessionData) => {
    return {
      session: { data: sessionData },
    };
  };

  describe("Index Controller", () => {
    const getIndexMock = jest.spyOn(homeController, "get");

    it("Get /", () => {
      const req = mockRequest();
      const res = mockResponse();
      const getIndex = homeController.get(req, res);
      expect(getIndexMock).toHaveBeenCalledTimes(1);
      expect(getIndex.status).toHaveBeenCalledWith(200);
      expect(getIndex.json).toHaveBeenCalledWith("get request from /");
    });
  });
});
