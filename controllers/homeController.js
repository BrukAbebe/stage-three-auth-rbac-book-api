exports.getHome = (req, res) => {
  res.status(200).json({
    success: true,
    message: {
      welcome: "Welcome to the Advanced Book Collection API!",
      description:
        "This API supports Authentication and Role-Based Access Control (RBAC) to ensure secure access.",
    },
  });
};
