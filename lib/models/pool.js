'use strict';

const Mongoose = require('mongoose');


const internals = {};


const ObjectId = Mongoose.Schema.Types.ObjectId;
const PoolSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    tournaments: [{
        tournament: ObjectId,
        scoring_method: String,
        participants: [{
            user: ObjectId,
            picksheets: [{ label: String, Picksheet: ObjectId }]
        }]
    }]
});

PoolSchema.statics.checkNameAndSave = function (id, data = {}) {

    return this.findOne({
        name: data.name,
        _id: { $ne: id }
    })
        .then((t) => {

            if (t) {
                const error = new Error();
                error.name = 'Duplicated pool name';
                error.message = `A pool already exists with the name of '${data.name}'`;

                throw error;
            }

            const query = (!id) ? this.create(data) : this.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true
            });

            return query
                .then((nt) => nt)
                .catch((err) => {

                    throw err;
                });
        });
};


module.exports = Mongoose.model('Pool', PoolSchema);
