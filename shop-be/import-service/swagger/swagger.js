// this file was generated by serverless-auto-swagger
            module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "shop-product-import-service",
    "version": "1"
  },
  "paths": {
    "/import": {
      "get": {
        "summary": "importProductsFromFile",
        "description": "",
        "operationId": "importProductsFromFile.get.import",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "query",
            "name": "name",
            "type": "string",
            "required": true
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    }
  },
  "definitions": {},
  "securityDefinitions": {}
};