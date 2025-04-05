export const sendNotification = async (req, res, next) => {
  const { userId, message } = req.body;
  res.json({ message: `Notification sent to user ${userId}: ${message}` });
};
