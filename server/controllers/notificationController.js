const { Notification } = require('../models');

exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    const unreadCount = await Notification.count({
      where: { user_id: userId, is_read: false }
    });

    return res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error('Get notifications error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (id === 'all') {
      await Notification.update({ is_read: true }, { where: { user_id: userId } });
      return res.status(200).json({ message: 'All notifications marked as read' });
    }

    const notif = await Notification.findOne({ where: { id, user_id: userId } });
    if (notif) {
      notif.is_read = true;
      await notif.save();
    }

    return res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark read error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
