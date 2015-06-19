'use strict';

const bluebird        = require('bluebird');
const mongoose        = bluebird.promisifyAll(require('mongoose'));
const extend          = bluebird.promisifyAll(require('mongoose-schema-extend'));

const ShapefileSchema = require('./ShapefileSchema');
const MicroEntity     = require('./MicroEntity');


const MacroEntitySchema = ShapefileSchema.extend({ });
const MacroEntity = mongoose.model('MacroEntity', MacroEntitySchema);

module.exports = MacroEntity;
