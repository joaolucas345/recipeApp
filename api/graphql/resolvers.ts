import csvtojson from 'csvtojson'
type Recipe = {
    name: string,
    id: string,
    minutes: string,
    contributor_id: string,
    submitted: string,
    tags: string,
    nutrition: string,
    n_steps: string,
    steps: string,
    description: string,
    ingredients: string,
    n_ingredients: string
}
const MINIMUM_INGRIDIENTS = 4


const resolvers = {
    Query: {
        recipe: async (_: any, params: any) => {
            const ingridients = params.ingredients
            if(!ingridients || !Array.isArray(ingridients)) return []
            if(ingridients.length < MINIMUM_INGRIDIENTS) return []
            const recipesList: Recipe[] = await csvtojson().fromFile(`${__dirname}/../datasets/RAW_recipes.csv`)
            // console.log(ingridients)
            const recipesFiltered: any[] = []
            let used: any[] = []
            for(let u = 0; u < recipesList.length; u++) {
                const recipe = recipesList[u]
                const ingridientParsed: string[] = recipe.ingredients.replace("[", '').replace("]", '').replace(/'/g, '').split(",").map(e => { return e.trim() })
                used = []
                let k = []
                for(let i = 0; i < ingridients.length; i++) {
                    // if(!recipe.ingredients.includes(ingridients[i])) {
                    //     notInc = true
                    //     continue;
                    // }
                    for(let ing of ingridientParsed) {
                        if(ing.includes(ingridients[i]) && !used.includes(ingridients[i])) {
                            // console.log(ing)
                            used.push(ingridients[i])
                            k.push(true)
                            
                            continue;
                        }
                    }
                }
                // console.log(k)
                if(k.length == ingridients.length) {
                    recipesFiltered.push({
                        name: recipe.name,
                        id: Number(recipe.id),
                        minutes: Number(recipe.minutes),
                        contributor_id: Number(recipe.contributor_id),
                        submitted: recipe.submitted,
                        tags: recipe.tags.replace("[", '').replace("]", '').replace(/'/g, '').split(",").map(e => { return e.trim() }),
                        nutrition: Number(recipe.nutrition.replace("[", '').replace("]", '').replace(/'/g, '').split(",").map(e => { return e.trim() })),
                        n_steps: Number(recipe.n_steps),
                        steps: recipe.steps.replace("[", '').replace("]", '').replace(/'/g, '').split(",").map(e => { return e.trim() }),
                        description: recipe.description,
                        ingredients: recipe.ingredients.replace("[", '').replace("]", '').replace(/'/g, '').split(",").map(e => { return e.trim() }),
                        n_ingredients: recipe.n_ingredients
                    })
                }
            }
            return recipesFiltered
        }
    }
}

export { resolvers }