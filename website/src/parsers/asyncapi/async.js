import defaultParserInterface from '../utils/defaultParserInterface'
const errorHandler = require("../utils/errorHandler")
const builder = require("../utils/buildAst")
const ID = 'amf-async-parser'

export default {
    ...defaultParserInterface,

    id: ID,
    displayName: 'amf-parser',
    version: '5.0.1-0',
    homepage: 'https://www.npmjs.com/package/amf-client-js',

    loadParser(callback) {
        require(['amf-client-js', 'generic-js-model-adapter'], (parser, adapter) => {
            callback({ parser, adapter });
        });
    },

    async parse({ parser, adapter }, code) {
        let provider = errorHandler.getProvider(parser)
        let client = parser.AsyncAPIConfiguration.Async20().withErrorHandlerProvider(provider).baseUnitClient();
        let parsingResult = await client.parseContent(code,"application/asyncapi20+yaml")
        return builder.buildAst(parsingResult,adapter,code)
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