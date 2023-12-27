const csvtojson = require("csvtojson");
const fs = require("fs")

const csvPath = `${__dirname}/../datasets/RAW_recipes.csv`



const main = async () => {
    const recipesCSV: Recipe[]  =  await csvtojson().fromFile(csvPath)
    const ingridients: string[] = []
    for(let recipe of recipesCSV) {
        const ingridientParsed: string[] = recipe.ingredients.replace("[", '').replace("]", '').replace(/'/g, '').split(",").map(e => { return e.trim() })
        ingridientParsed.forEach(ingridient => {
            if(!(ingridients.includes(ingridient))) ingridients.push(ingridient)
        })
    }
    // console.log(ingridients[0])
    fs.writeFileSync("ingridients.txt", JSON.stringify(ingridients))
}

main()