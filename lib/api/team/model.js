'use strict';

const Mongoose = require('mongoose');


const internals = {};


const TeamSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    city: String
});

TeamSchema.statics.checkNameAndSave = function (id, data = {}) {

    return this.findOne({
        name: data.name,
        _id: { $ne: id }
    })
        .then((t) => {

            if (t) {
                const error = new Error();
                error.name = 'Duplicated team name';
                error.message = `A team already exists with name of '${data.name}'`;

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


module.exports = Mongoose.model('Team', TeamSchema);
