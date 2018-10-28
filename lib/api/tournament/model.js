'use strict';

const Mongoose = require('mongoose');


const ObjectId = Mongoose.Schema.Types.ObjectId;
const internals = {};
internals.game = {
    winner: ObjectId,
    visitor_team: ObjectId,
    home_team: ObjectId,
    home_score: Number,
    visitor_score: Number,
    date: Date
};
internals.conference = {
    winner: ObjectId,
    games: {
        g0116: Object.create(internals.game),
        g0215: Object.create(internals.game),
        g0314: Object.create(internals.game),
        g0413: Object.create(internals.game),
        g0512: Object.create(internals.game),
        g0611: Object.create(internals.game),
        g0710: Object.create(internals.game),
        g0809: Object.create(internals.game),
        g0108: Object.create(internals.game),
        g0207: Object.create(internals.game),
        g0306: Object.create(internals.game),
        g0405: Object.create(internals.game),
        g0104: Object.create(internals.game),
        g0203: Object.create(internals.game),
        g0102: Object.create(internals.game)
    },
    seeds: {
        s1: ObjectId,
        s2: ObjectId,
        s3: ObjectId,
        s4: ObjectId,
        s5: ObjectId,
        s6: ObjectId,
        s7: ObjectId,
        s8: ObjectId,
        s9: ObjectId,
        s10: ObjectId,
        s11: ObjectId,
        s12: ObjectId
    }
};


const TournamentSchema = new Mongoose.Schema({
    year: {
        type: Number,
        required: true,
        unique: true
    },
    winner: ObjectId,
    midwest: Object.create(internals.conference),
    south: Object.create(internals.conference),
    west: Object.create(internals.conference),
    east: Object.create(internals.conference),
    final_four: {
        winner: ObjectId,
        games: {
            gSouthMidwest: Object.create(internals.game),
            gEastWest: Object.create(internals.game),
            gfinal: Object.create(internals.game)
        }
    }
});

TournamentSchema.statics.checkYearAndSave = function (id, data = {}) {

    return this.findOne({
        year: data.year,
        _id: { $ne: id }
    })
        .then((t) => {

            if (t) {
                const error = new Error();
                error.name = 'Duplicated year value';
                error.message = `A tournament already exists for '${data.year}'`;

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


module.exports = Mongoose.model('Tournament', TournamentSchema);
