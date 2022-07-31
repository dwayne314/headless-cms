const homeController = {
  get: (req, res, next) => {
    return res.status(200).json("get request from /");
  },
};

export default homeController;
