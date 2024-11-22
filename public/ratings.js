document.addEventListener("DOMContentLoaded", () => {
  console.log("Iniciando fetch ...");
  const ele_stars = document.getElementsByClassName("stars"); // todos los elementos de la clase 'stars' que haya en la página

  for (const ele of ele_stars) {
    const ide = ele.dataset._id; // _id esta en los atributos del dataset

    // hacer el fetch, y con lo que devuelva formar el html y ponerlo
    fetch(`/api/ratings/${ide}`)
      .then((response) => {
        if (!response.ok) { // response html
          throw new Error("Error del response html");
        }
        return response.json();
      })
      .then((data) => { // estrellas
        let rating = data.rating.rate;
        html_nuevo_con_las_estrellas = Estrellas(rating);
        ele.innerHTML = html_nuevo_con_las_estrellas;
      })
      .catch(() => (ele.innerHTML = "Error al cargar el rating"));
  }
});

function Estrellas(rating) {
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

  // estrellas enteras
  for (let i = 0; i < enteras; i++) {
    estrellasHTML += '<i class="fa fa-star"></i>';
  }

  // estrella media
  if (mitad) {
    estrellasHTML += '<i class="fa fa-star-half-o"></i>';
  }

  // Agregar estrellas vacías
  for (let i = 0; i < vacias; i++) {
    estrellasHTML += '<i class="fa fa-star-o"></i>';
  }


  return estrellasHTML;
}
