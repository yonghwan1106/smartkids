exports.up = pgm => {
  // School Attendance table
  pgm.createTable('school_attendance', {
    id: 'id',
    child_id: {
      type: 'integer',
      notNull: true,
      references: 'children',
      onDelete: 'cascade',
    },
    attendance_date: { type: 'date', notNull: true },
    status: { 
      type: 'varchar(10)', 
      notNull: true,
      check: "status IN ('출석', '지각', '결석', '조퇴')"
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // School Events table
  pgm.createTable('school_events', {
    id: 'id',
    child_id: {
      type: 'integer',
      references: 'children',
      onDelete: 'cascade',
    }, // nullable for general events
    event_name: { type: 'varchar(255)', notNull: true },
    event_date: { type: 'date', notNull: true },
    description: { type: 'text' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes
  pgm.createIndex('school_attendance', 'child_id');
  pgm.createIndex('school_attendance', 'attendance_date');
  pgm.createIndex('school_events', 'child_id');
  pgm.createIndex('school_events', 'event_date');
  
  // Unique constraint for attendance (one record per child per date)
  pgm.createIndex('school_attendance', ['child_id', 'attendance_date'], {unique: true});
};

exports.down = pgm => {
  pgm.dropTable('school_events');
  pgm.dropTable('school_attendance');
};