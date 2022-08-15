const compiledAccessCampus = require('../ethereum/artifacts/ethereum/contracts/AccessCampus.sol/AccessCampus.json')

const createObject = (abi, functionName, values) => {
    let returnObject = {}
    abi.map((object) => {
        if (object.name === functionName) {
            for (i in object.outputs[0].components) {
                let name = object.outputs[0].components[i].name
                returnObject = { ...returnObject, [name]: values[i] }
            }
        }
    })
    return returnObject
}

console.log(createObject(compiledAccessCampus.abi, 'getCheckIns', ['meu endereco', 1]))

module.exports = { createObject }
