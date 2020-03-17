const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
//const basename = path.basename(module.filename);

catalogSchema = new mongoose.Schema({
    filename: String,
    file_id: Number,
    updated: {type: Date, default: Date.now },
    version: Number,
    container: [String]
});
/*
mongoose.files = mongoDB
    .define('files', {
        file_id: {
            type: mongoDB.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: mongoDB.DataTypes.STRING,
        created_at: mongoDB.DataTypes.DATE
    },
    {
        freezeTableName: true
    }
);
db.versions = mongoDB
    .define('versions', {
        version_id: {
            type: mongoDB.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: mongoDB.DataTypes.STRING,
        created_at: mongoDB.DataTypes.DATE
    },
    {
        freezeTableName: true
    }
);

Object.keys(db).forEach(model_name => {
    db[model_name].find_one = db[model_name].findOne;
    db[model_name].find_all = db[model_name].findAll;
    db[model_name].find_or_create = db[model_name].findOrCreate;
    db[model_name].find_and_count_all = db[model_name].findAndCountAll;
    db[model_name].belongs_to = db[model_name].belongsTo;
    db[model_name].has_one = db[model_name].hasOne;
    db[model_name].has_many = db[model_name].hasMany;
    db[model_name].belongs_to_many = db[model_name].belongsToMany;
});

db.files.has_many(db.versions, { as: 'versions', foreignKey: 'file_id' });

db.versions.belongs_to(db.files, { as: 'file', foreignKey: 'file_id' });
*/

module.exports = mongoose.model('fileCatalog', catalogSchema);