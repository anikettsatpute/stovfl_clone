import { DataTypes } from "sequelize";
import db from "./database.js";

export const Tag = db.define('tags', {
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    excerpt_post_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    wiki_post_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    tag_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    sequelize,
    tableName: 'tags',
    schema: 'public',
    timestamps: false,
    indexes: [
        {
            name: "tags_pkey",
            unique: true,
            fields: [
                { name: "id" },
            ]
        },
    ]
});
