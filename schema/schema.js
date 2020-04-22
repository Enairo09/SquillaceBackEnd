const graphql = require('graphql');
const _ = require("lodash");
const myJson = require("../product.json");
let bdd = require('../models/bdd');
const productModel = require('../models/product');

const { GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLList,
    GraphQLFloat } = graphql;

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        price: { type: GraphQLFloat },
        type: { type: GraphQLString },
        enabled: { type: GraphQLBoolean }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        product: {
            type: ProductType,
            args: { _id: { type: GraphQLID } },
            resolve(parent, args) {
                return productModel.findOne({ _id: args._id })
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args) {
                return productModel.find({});
            }
        }

    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addProduct: {
            type: ProductType,
            args: {
                _id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLFloat) },
                type: { type: new GraphQLNonNull(GraphQLString) },
                enabled: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                let newproduct = new productModel({
                    name: args.name,
                    price: args.price,
                    type: args.type,
                    enabled: args.enabled
                });
                return newproduct.save();
            }
        },
        deleteProduct: {
            type: ProductType,
            args: {
                _id: { type: GraphQLID },
                name: { type: GraphQLString },
                price: { type: GraphQLFloat },
                type: { type: GraphQLString },
                enabled: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                console.log('je supprime cette entrée', args)
                return productModel.deleteOne({ _id: args._id })
            }
        },
        changeProduct: {
            type: ProductType,
            args: {
                _id: { type: GraphQLID },
                name: { type: GraphQLString },
                price: { type: GraphQLFloat },
                type: { type: GraphQLString },
                enabled: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                productModel.updateOne(
                    { _id: args._id },
                    { name: args.name, price: args.price, type: args.type, enabled: args.enabled }, function (error, raw) {
                    });
                console.log('je mets a jour cette entrée', args)
                return productModel.findOne({ _id: args._id })
            }
        }


    }
})
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});