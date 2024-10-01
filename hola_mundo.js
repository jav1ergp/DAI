console.log('Hola mundo')

res = await fetch('https://fakestoreapi.com/users')
    .then((res) => res.json()) .then((datos) => console.log(datos)) //falta poner la funcion

    .catch(function(error) {console.log('--->', error)})

console.log('sigue por aqui')