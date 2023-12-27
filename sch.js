const csvtojson = require("csvtojson")
const fs = require("fs")


const main = async () => {
    const recipes = await csvtojson().fromFile('../datasets/RAW_recipes.csv')
    const r = []
    for(let i = 0; i < 2000; i++) {
        r.push(recipes[i])
    }
    const json = JSON.stringify(r)
    fs.writeFileSync("wq.json", json)
}   

main()