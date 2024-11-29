document.addEventListener("DOMContentLoaded", () => {
  
  function Estrellas(rating, count, ide) {
    const Total = 5;
    let enteras = parseInt(rating);
    let mitad;
    if (rating % 1 >= 0.5) { // estrellas a la mitad cuando sean >= 0.5
      mitad = 1;
    } else {
      mitad = 0;
    }
    let vacias = Total - enteras - mitad; // estrellas vacías
  
    let estrellasHTML = "";
  
    for (let i = 0; i < enteras; i++) {
      estrellasHTML += `<i class="fa fa-star" data-_id="${ide}" data-star="${i + 1}"></i>`; // id = id del producto y star = posicion de la estrella
    }
  
    if (mitad) {
      estrellasHTML += `<i class="fa fa-star-half-o" data-_id="${ide}" data-star="${enteras + 1}"></i>`; // id = id del producto y star = posicion de la estrella
    }
  
    for (let i = 0; i < vacias; i++) {
      estrellasHTML += `<i class="fa fa-star-o" data-_id="${ide}" data-star="${enteras + mitad + i + 1}"></i>`; // id = id del producto y star = posicion de la estrella
    }
  
    estrellasHTML += `<span class="text-body-secondary"> (${count} votos)</span>`;
  
    return estrellasHTML;
  }
  
  function Vota(evt) {
    const ide = evt.target.dataset._id; // id producto
    const pun = parseInt(evt.target.dataset.star); // posicion estrella
  
    if(ide && pun){
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ // posicion de la estrella para calcular el nuevo
          rate: pun
        }),
      };
      fetch(`/api/ratings/${ide}`, options)
        .then(res => res.json())
        .then(res => {
          console.log('Respuesta de la API:', res);
          evt.target.parentElement.innerHTML = Estrellas(res.rating.rate, res.rating.count, ide);
        })
        .catch(err => console.error('Error:', err));
    }
  }
  

  const ele_stars = document.querySelectorAll('.stars');

  for (const ele of ele_stars) {
    const ide = ele.dataset._id;

    fetch(`/api/ratings/${ide}`)
      .then(res => res.json())
      .then(data => {
        let rating = data.rating.rate;
        let count = data.rating.count;
        let html_nuevo_con_las_estrellas = Estrellas(rating, count, ide);
        ele.innerHTML = html_nuevo_con_las_estrellas;
      })
      .catch(err => console.error('Error:', err));
  };

  // un solo event listener para manejar en Vota todos los clics de estrellas
  document.addEventListener('click', Vota);
});