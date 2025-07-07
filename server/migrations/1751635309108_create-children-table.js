exports.up = pgm => {
  pgm.createTable('children', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
    name: { type: 'varchar(255)', notNull: true },
    birthdate: { type: 'date', notNull: true },
    profile_image_url: { type: 'text' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createIndex('children', 'user_id');
};

exports.down = pgm => {
  pgm.dropTable('children');
};