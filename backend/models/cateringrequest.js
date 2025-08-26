module.exports = (sequelize, DataTypes) => {
  const CateringRequest = sequelize.define("CateringRequest", {
    eventDate: DataTypes.DATE,
    time: DataTypes.STRING,
    guests: DataTypes.INTEGER,
    location: DataTypes.TEXT,
    details: DataTypes.TEXT,
    status: { type: DataTypes.STRING, defaultValue: "pending" }
  });

  CateringRequest.associate = (models) => {
    CateringRequest.belongsTo(models.User);
  };

  return CateringRequest;
};
