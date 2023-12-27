"use client"; 
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { io, Socket } from 'socket.io-client'
import { useEffect, useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const SOCKET_URL = "http://localhost:3002"
const MIN_WAIT_TIME = 2000
let timeInterval: any, socket: ReturnType<typeof io>

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
});


const onSearch = (ingredients: string[], setRecipes: any) => {
  if(ingredients.length < 4) {
    window.alert("You need at least 4 ingredients")
    return
  }
  client.query({
    query: gql`
    query ExampleQuery($ingredients: [String]) {
      recipe(ingredients: $ingredients
      ) {
        name,
        minutes,
        steps, 
        description,
        ingredients, 
        contributor_id
      }
    }
    
    `, variables: {
      "ingredients": ingredients
    }
  }).then(e => { 
    if(e.data.recipe.length == 0) {
      window.alert("nothing found")
      return
    }
    let recipes = e.data.recipe
    if(recipes.length > 50) {
      let rc = []
      for(let i = 0; i < 50; i++) {
        const f = recipes[i]
        rc.push(f)
      }
      recipes = rc
    }
    setRecipes(recipes) })
}

export default function Home() {
  const [search, setSearch] = useState("")
  const [ingridients, setIngridients] = useState([])
  const [emptyCompText, setEmptyCompText] = useState("")
  const [selectedIngridients, setSelectedIngridients] = useState([""])
  const [recipes, setRecipes]: [recipes: Recipe[], setRecipes: any] = useState([])

  useEffect(() => {
    socket = io(SOCKET_URL)
    socket.on("ingridients", (ingridientsParam) => {
      if(ingridientsParam.length === 0) setEmptyCompText("No results found")
      setIngridients(ingridientsParam)
      setEmptyCompText("")
    })
  }, [])


  useEffect(() => {
    if(timeInterval) clearTimeout(timeInterval)
    if(search) timeInterval = setTimeout(() => {
      setEmptyCompText("loading")
      socket.emit("type", search)
    }, MIN_WAIT_TIME)
  }, [search])
  // socket.emit("type", "jej")
  return (
    <main className={`bg-white min-h-screen flex flex-col items-center m-3 ${emptyCompText == "loading" ? "cursor-wait" : ""}`}>
      <Command>
        <div className="flex min-w-screen bg-purple">
        <CommandInput placeholder="Type a ingridient" onValueChange={(e) => setSearch(e)} className=""/>
        <Button className=" w-1/4" onClick={() => onSearch(selectedIngridients, setRecipes)}>search</Button>
        </div>
        <CommandList>
          <CommandEmpty>{emptyCompText}</CommandEmpty>

            <CommandGroup heading="Selected">
            {
              selectedIngridients.map((ingridient) => (<CommandItem key={`${Date.now()}-${ingridient}-jsj`} 
              >{ingridient}</CommandItem>))
            }
          </CommandGroup>
          <CommandGroup heading="Ingridients">
            {
              ingridients.map((ingridient) => (<CommandItem key={`${Date.now()}-${ingridient}-jsj`} onClickCapture={(e) => {
                const ar: string[] = selectedIngridients
                ar.push(e.currentTarget.innerHTML)
                setSelectedIngridients(ar)
                setIngridients([])
              }}
              >{ingridient}</CommandItem>))
            }
          </CommandGroup>
        </CommandList>
      </Command>
      <div className='m-20 flex-col justify-center items-center space-y-4'>
      {
        recipes?.map(recipe => (
        <Drawer key={`${recipe.minutes}-sksk-${Date.now()}-${Math.round(5) * 25}-${recipe.contributor_id}`}>
          <DrawerTrigger className='border-solid border-2 border-black p-2 min-w-full' >
            <h2 className='font-bold'>{recipe.name}</h2>
            <p className='text-sm'>{recipe.description}</p>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{recipe.name}</DrawerTitle>
              <DrawerDescription>ingredients: {recipe.ingredients.toLocaleString()}</DrawerDescription>

              <DrawerDescription>steps: {recipe.steps}</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        )) 
      }
      </div>
    </main>
  )
}
