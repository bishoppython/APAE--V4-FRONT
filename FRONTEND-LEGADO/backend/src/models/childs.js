
module.exports = (sequelize, DataTypes) => {
  const Child = sequelize.define("Child", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    diagnosis: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  Child.associate = (models) => {
    Child.hasMany(models.GameHistory, {
      foreignKey: "childId",
      as: "history",
      onDelete: "CASCADE",
    });
  };

  return Child;
};
