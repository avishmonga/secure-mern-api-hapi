module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PII', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Reference to the User model
        key: 'id', // Key in the User model that this refers to
      },
      onUpdate: 'CASCADE', // Define cascading behavior on updates
      onDelete: 'CASCADE', // Define cascading behavior on deletions
    },
    type: {
      type: DataTypes.ENUM('aadhar', 'pan', 'driving_licence', 'passport'),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
