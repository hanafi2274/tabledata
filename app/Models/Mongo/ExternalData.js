'use strict'
const { MongoClient } = require('mongodb');
// const url = 'mongodb://userSiwalusi:!Welkom123@54.254.27.64:27017/admin?authSource=admin&readPreference=primary&ssl=false&directConnection=true'
// const db_ = 'siwalusiDataExternal?authSource=admin'
// // local
const url = 'mongodb://127.0.0.1:27017'
const db_ = 'enygma'

const collection = 'RUP'
const client = new MongoClient(url);
const db = client.db(db_);
const collections = db.collection(collection);

class ExternalDataMongo {

    async getData(){
        return await collections.find().toArray();
    }

    async getSize(id){
        const variabledata = [{
            $match: {
                userId: parseInt(id),
                deleted_at: null,
            }
            }, {
            $group: {
                _id: null,
                total: {  $sum: 1 },
                size: {
                    $sum: { $bsonSize: '$$ROOT'}
                }
            }
        }]
        const data = await mongoCollection.aggregate(variabledata).toArray();
        return data.length == 0 ? 0 : data[0].size
    }
}

module.exports = new ExternalDataMongo()