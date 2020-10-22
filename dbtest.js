const a = {
  s: [
    {
      "name": "Sanju"
    },
    {
      "name": "Sanju 2"
    },
    
  ]
}

console.log(a)

for(let s of a.s){
  s.name = "Preet"
}

console.log(a)