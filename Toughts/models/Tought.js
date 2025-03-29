import { DataTypes } from "sequelize"

import db from "../db/conn.js"

import User from "../models/User.js"

const Tought = db.define("Tought", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Tought.belongsTo(User)
User.hasMany(Tought)

export default Tought