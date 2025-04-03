// controllers/notificationController.js
exports.sendNotification = async (req, res, next) => {
    const { userId, message } = req.body;
    // Here you would integrate with a notification service (e.g., FCM or OneSignal)
    res.json({ message: `Notification sent to user ${userId}: ${message}` });
  };
  