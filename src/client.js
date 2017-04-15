import {Builder, Processor, Store} from './core';

let store = new Store();
let processor = new Processor(store);
let builder = new Builder(processor, store);
builder.init();