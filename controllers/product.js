const Product = require("../models/products");

const getAllStaticProducts = async (req, res) => {
    const products = await Product.find({}).sort('-price')
    res.send(products);
}

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, field, limit = 10, page = 1, price, rating, numericFilters } = req.query;

    const operatorMap = {
        '>': '$gt',
        '>=': '$gte',
        '=': '$eq',
        '<': '$lt',
        '<=': '$lte',
    }

    const multiRegEx = /\b(>|>=|=|<|<=)\b/g;
    const singleRegEx = /([^\d]+)(\d+)/;
    const options = ['price', 'rating'];

    const queryRequest = {};


    if (featured) {
        queryRequest.featured = featured === 'true' ? true : false;
    }
    if (company) {
        queryRequest.company = company;
    }
    if (name) {
        queryRequest.name = { $regex: name, $options: 'i' };
    }

    if (numericFilters) {


        let numericFiltersList = numericFilters.replace(multiRegEx, (match) => `-${operatorMap[match]}-`)

        numericFiltersList = numericFiltersList.split(',').forEach(item => {
            const [field, operator, value] = item.split("-");
            if (options.includes(field)) {
                queryRequest[field] = { [operator]: Number(value) };
            }

        });
    }

    if (price) {

        const matches = price.match(singleRegEx);
        if (matches) {
            const operator = operatorMap[matches[1]]; // Extract the operator or expression
            const value = Number(matches[2]); // Extract the number and convert it to an integer
            queryRequest.price = { [operator]: value }
        }
    }

    if (rating) {

        const matches = rating.match(singleRegEx);
        if (matches) {
            const operator = operatorMap[matches[1]]; // Extract the operator or expression
            const value = Number(matches[2]); // Extract the number and convert it to an integer
            queryRequest.rating = { [operator]: value }
        }
    }

    let result = Product.find(queryRequest);

    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }

    if (field) {
        const fieldList = field.split(',').join(' ')
        result = result.select(fieldList);
    }

    if (page) {
        const skip = (((Number(page)) - 1) * Number(limit))
        result = result.skip(skip).limit(Number(limit));
    }

    const products = await result;

    res.send(products);
}
module.exports = { getAllStaticProducts, getAllProducts };
