'use strict'
const { query } = require('@adonisjs/lucid/src/Lucid/Model');
const { MongoClient } = require('mongodb');

// // local
const { ObjectID } = use('mongodb')
const Env = use('Env')
const url = Env.get('MONGO_URL')
const db_ = Env.get('MONGO_DATABASE')
const collection = 'RUP'
const client = new MongoClient(url);
const db = client.db(db_);
const collections = db.collection(collection);

class ExternalDataMongo {

    async getData(data){
        return await collections.find(data).toArray();
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
    async createData(data){
        return await collections.insertMany(data)
    }
    async updatedData(id,data){
        return  await collections.updateOne({_id : (id)},{ $set:{ updated_at : new Date()}, $push: { "query": {$each : data} } })
    }
    async deleteQueryData(id,data){
        return  await collections.updateOne({_id : (id)}, {$set:{ updated_at : new Date()},$pull: {"query": {id:data}}})
    }
    async deleteDataTable(id){
        return  await collections.deleteOne({idQuery : (id)})
    }
    async updateDataTable(id,data){
        return  await collections.updateOne({idQuery : (id)},{ $set:{ updated_at : new Date(),data:data}  })
    }
}

module.exports = new ExternalDataMongo()