const compiledAccessCampus = require('../build/contracts/AccessCampus.json')
const compiledInteliFactory = require('../build/contracts/InteliFactory.json')
const compiledLectureFactory = require('../build/contracts/LectureFactory.json')
const compiledPerson = require('../build/contracts/Person.json')

const createObject = (contractName, functionName, values) => {
    let contract
    contract = (contractName === 'accessCampus') ? compiledAccessCampus : contract
    contract = (contractName === 'inteliFactory') ? compiledInteliFactory : contract
    contract = (contractName === 'lectureFactory') ? compiledLectureFactory : contract
    contract = (contractName === 'person') ? compiledPerson : contract
    
    let returnObject = {}
    if (contract != '') {
        contract.abi.map((object) => {
            if (object.name === functionName) {
                for (i in object.outputs[0].components) {
                    let name = object.outputs[0].components[i].name
                    returnObject = { ...returnObject, [name]: values[i] }
                }
            }
        })
        return returnObject
    }
    else {
        throw new Error("Contract does not exist")
    }
}

// console.log(createObject(compiledAccessCampus.abi, 'getCheckIns', ['meu endereco', 1]))

module.exports = { createObject }
