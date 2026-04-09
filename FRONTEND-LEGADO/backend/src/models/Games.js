
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define("Game", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  Game.associate = (models) => {
    Game.hasMany(models.GameHistory, {
      foreignKey: "gameId",
      as: "history",
      onDelete: "CASCADE",
    });
  };

  return Game;
};
