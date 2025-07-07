exports.up = pgm => {
  // Notification Settings table
  pgm.createTable('notification_settings', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
      unique: true, // One setting record per user
    },
    homework_reminders: { type: 'boolean', default: true },
    vaccination_reminders: { type: 'boolean', default: true },
    monthly_reports: { type: 'boolean', default: false },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create index
  pgm.createIndex('notification_settings', 'user_id');
};

exports.down = pgm => {
  pgm.dropTable('notification_settings');
};