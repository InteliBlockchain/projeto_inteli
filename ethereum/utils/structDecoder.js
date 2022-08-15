const compiledAccessCampus = require('../artifacts/ethereum/contracts/AccessCampus.sol/AccessCampus.json')
const compiledInteliFactory = require('../artifacts/ethereum/contracts/InteliFactory.sol/InteliFactory.json')
const compiledLecture = require('../artifacts/ethereum/contracts/Lecture.sol/Lecture.json')
const compiledLectureFactory = require('../artifacts/ethereum/contracts/LectureFactory.sol/LectureFactory.json')
const compiledPerson = require('../artifacts/ethereum/contracts/Person.sol/Person.json')

const createObject = (contractName, functionName, values) => {
    let contract
    contract = (contractName === 'accessCampus') ? compiledAccessCampus : contract
    contract = (contractName === 'inteliFactory') ? compiledInteliFactory : contract
    contract = (contractName === 'lecture') ? compiledLecture : contract
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
