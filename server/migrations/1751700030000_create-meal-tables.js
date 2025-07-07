exports.up = pgm => {
  // Meal Records table
  pgm.createTable('meal_records', {
    id: 'id',
    child_id: {
      type: 'integer',
      notNull: true,
      references: 'children',
      onDelete: 'cascade',
    },
    record_date: { type: 'date', notNull: true },
    meal_type: { 
      type: 'varchar(20)', 
      notNull: true,
      check: "meal_type IN ('breakfast', 'lunch', 'dinner')"
    },
    description: { type: 'text', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes
  pgm.createIndex('meal_records', 'child_id');
  pgm.createIndex('meal_records', 'record_date');
  pgm.createIndex('meal_records', 'meal_type');
  
  // Unique constraint for meal records (one record per child per date per meal type)
  pgm.createIndex('meal_records', ['child_id', 'record_date', 'meal_type'], {unique: true});
};

exports.down = pgm => {
  pgm.dropTable('meal_records');
};