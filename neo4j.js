
var neo4j = require('neo4j-driver').v1
var basic = neo4j.auth.basic(process.env.GRAPHENE_USER, process.env.GRAPHENE_PASS)
var driver = neo4j.driver(process.env.GRAPHENE_BOLT, basic)

var session = driver.session()
session
    .run("CREATE (n:Person {name:'Bob'}) RETURN n.name")
    .then(function (result) {
      result.records.forEach(function (record) {
        console.log(record)
      })

      session.close()
    })
    .catch(function (error) {
      console.log(error)
    })
