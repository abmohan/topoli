#!/usr/bin/node
const fs = require('fs');
const path = require('path');
const url = require('url');

const shapefiles = path.resolve(__dirname, '../data/shapefiles.json');
const tempDownloadPath = path.resolve(__dirname, '../data/temp');
