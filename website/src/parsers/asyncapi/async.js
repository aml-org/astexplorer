import defaultParserInterface from '../utils/defaultParserInterface'
const errorHandling = require("../utils/errorHandling")

const ID = 'amf-async-parser'

export default {
    ...defaultParserInterface,

    id: ID,
    displayName: 'amf-parser',
    version: '5.0.0-beta.2',
    homepage: 'https://www.npmjs.com/package/amf-client-js',

    loadParser(callback) {
        require(['amf-client-js', 'generic-js-model-adapter'], (parser, adapter) => {
            callback({ parser, adapter });
        });
    },

    async parse({ parser, adapter }, code) {
        let client = parser.AsyncAPIConfiguration.Async20().baseUnitClient();
        let parsingResult = await client.parseContent(code,"application/asyncapi20+yaml")

        if(parsingResult.conforms){
            let model = parsingResult.baseUnit
            let transformers = adapter.TransformerSet.createTransformerSet()
            transformers.addPositionTransformer(code)
            transformers.addNameTransformer()
            let builder = adapter.AstBuilder.createBuilder(model,false,transformers)
            return builder.buildObject()
        }else{
            let errors = parsingResult.results
            throw new SyntaxError(errorHandling.firstViolationMessage(errors))
        }
    },

    getNodeName(node) {
        return node.nodeName
    },

    nodeToRange(node) {
        if (node.hasOwnProperty('position')) {
            return [node.position.start.offset,node.position.end.offset]
        }
    }
}