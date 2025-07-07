exports.up = pgm => {
  pgm.addColumn('children', {
    gender: {
      type: 'varchar(10)',
      default: 'male'
    }
  });
};

exports.down = pgm => {
  pgm.dropColumn('children', 'gender');
};