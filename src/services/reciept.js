const receiptline = require('receiptline');

const doc = '{code:2012345678903;option:ean,hri}';

// printer example
const printer = {
    cpl: 42,
    encoding: 'multilingual',
    upsideDown: false,
    gamma: 1.8,
    command: 'escpos'
};
const command = receiptline.transform(doc, printer);

// display example
const display = {
    cpl: 42,
    encoding: 'multilingual'
};
const svg = receiptline.transform(doc, display)