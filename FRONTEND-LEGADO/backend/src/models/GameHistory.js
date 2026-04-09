
module.exports = (sequelize, DataTypes) => {
  const GameHistory = sequelize.define("GameHistory", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    childId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Children",
        key: "id",
      }
    },

    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Games",
        key: "id",
      }
    },

    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    correctAnswers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    wrongAnswers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    timeSpent: {
      type: DataTypes.INTEGER, // segundos
      allowNull: true,
    }
  });

  GameHistory.associate = (models) => {
    GameHistory.belongsTo(models.Child, {
      foreignKey: "childId",
      as: "child",
    });

    GameHistory.belongsTo(models.Game, {
      foreignKey: "gameId",
      as: "game",
    });
  };

  return GameHistory;
};
