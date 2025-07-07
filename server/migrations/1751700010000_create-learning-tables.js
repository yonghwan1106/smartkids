exports.up = pgm => {
  // Learning Records table
  pgm.createTable('learning_records', {
    id: 'id',
    child_id: {
      type: 'integer',
      notNull: true,
      references: 'children',
      onDelete: 'cascade',
    },
    record_date: { type: 'date', notNull: true },
    subject: { type: 'varchar(100)', notNull: true },
    duration_minutes: { type: 'integer', notNull: true },
    notes: { type: 'text' },
    is_homework: { type: 'boolean', default: false },
    is_exam_prep: { type: 'boolean', default: false },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Assignments table
  pgm.createTable('assignments', {
    id: 'id',
    child_id: {
      type: 'integer',
      notNull: true,
      references: 'children',
      onDelete: 'cascade',
    },
    type: { 
      type: 'varchar(10)', 
      notNull: true,
      check: "type IN ('숙제', '시험')"
    },
    subject: { type: 'varchar(100)', notNull: true },
    description: { type: 'text', notNull: true },
    due_date: { type: 'date', notNull: true },
    is_completed: { type: 'boolean', default: false },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes
  pgm.createIndex('learning_records', 'child_id');
  pgm.createIndex('learning_records', 'record_date');
  pgm.createIndex('assignments', 'child_id');
  pgm.createIndex('assignments', 'due_date');
  pgm.createIndex('assignments', 'is_completed');
};

exports.down = pgm => {
  pgm.dropTable('assignments');
  pgm.dropTable('learning_records');
};