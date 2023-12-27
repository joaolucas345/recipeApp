import fs from 'fs'
const ingridientsPATH = fs.readFileSync(`${__dirname}/../datasets/ingridients.json`).toString()

const ingridientsJSON: string[] = JSON.parse(ingridientsPATH)

const LIMIT_VALUES = 5

const searchIngridients = (searchTerm: string): string[] => {
    let count = 0;
    const ingridients: string[] = []
    ingridientsJSON.forEach((ingridient) => {
        if(!(count >= LIMIT_VALUES) && ingridient.includes(searchTerm)) {
            ingridients.push(ingridient)
            count++;
        } else if( ingridient == searchTerm.trim()) {
            if(ingridients.length == LIMIT_VALUES) {
                ingridients.pop()
                ingridients.push(ingridient)
            } else {
                ingridients.push(ingridient)
                count++;
            }
        }
    })

    return ingridients
}
export { searchIngridients }