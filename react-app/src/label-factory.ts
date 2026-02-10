import * as JSONParse from './json-parser.ts';

export default class LabelFactory{
    private data: { [key: string]: { [key: string]: { [key: string]: JSONParse.HistogramData } } };
    constructor(data: { [key: string]: { [key: string]: { [key: string]: JSONParse.HistogramData } } }) {
        this.data = data;
    }

}