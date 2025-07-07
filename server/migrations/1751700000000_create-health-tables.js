exports.up = pgm => {
  // Health Records table
  pgm.createTable('health_records', {
    id: 'id',
    child_id: {
      type: 'integer',
      notNull: true,
      references: 'children',
      onDelete: 'cascade',
    },
    record_date: { type: 'date', notNull: true },
    height_cm: { type: 'decimal(5,2)' }, // 999.99cm
    weight_kg: { type: 'decimal(5,2)' }, // 999.99kg
    notes: { type: 'text' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Vaccinations table
  pgm.createTable('vaccinations', {
    id: 'id',
    child_id: {
      type: 'integer',
      notNull: true,
      references: 'children',
      onDelete: 'cascade',
    },
    vaccine_name: { type: 'varchar(255)', notNull: true },
    vaccination_date: { type: 'date', notNull: true },
    next_due_date: { type: 'date' },
    notes: { type: 'text' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Medical Visits table
  pgm.createTable('medical_visits', {
    id: 'id',
    child_id: {
      type: 'integer',
      notNull: true,
      references: 'children',
      onDelete: 'cascade',
    },
    visit_date: { type: 'date', notNull: true },
    hospital_name: { type: 'varchar(255)', notNull: true },
    diagnosis: { type: 'varchar(255)', notNull: true },
    notes: { type: 'text' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes
  pgm.createIndex('health_records', 'child_id');
  pgm.createIndex('health_records', 'record_date');
  pgm.createIndex('vaccinations', 'child_id');
  pgm.createIndex('vaccinations', 'vaccination_date');
  pgm.createIndex('medical_visits', 'child_id');
  pgm.createIndex('medical_visits', 'visit_date');
};

exports.down = pgm => {
  pgm.dropTable('medical_visits');
  pgm.dropTable('vaccinations');
  pgm.dropTable('health_records');
};