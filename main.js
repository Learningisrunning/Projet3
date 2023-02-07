var xhr = new XMLHttpRequest;
var xhrDeux = new XMLHttpRequest;
var xhrTrois = new XMLHttpRequest;



nextUrl = ""


function getTheID(URL, nomDeLaListe) {

    let nouvelUrl = ""
   
    
    /*Récupération de la liste des URL des livres correspondant à la catégorie recherchée */
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 ) {
            /*console.log(this)*/
            
                for (i = 0; i < 5 ; i++) {
                        nouvelUrl = "http://localhost:8000/api/v1/titles/" + JSON.parse(this.responseText).results[i].id;
                        
                        if (nomDeLaListe.length<8){
                            nomDeLaListe.push(nouvelUrl)
                        };  
                }; 

            nextUrl = JSON.parse(this.responseText).next  
        };
       
    };

    xhr.open("GET", URL, false);
    xhr.send();
    
};

 

/* Récuperation des films les mieux notés */
let listeDUrlFilmsLesMieuxNotes = []
getTheID("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score", listeDUrlFilmsLesMieuxNotes);
getTheID(nextUrl, listeDUrlFilmsLesMieuxNotes)



/* Récuperation des films d'aventure */
let listeUrlDesFilmsDAdventure = []
getTheID("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Adventure", listeUrlDesFilmsDAdventure);
getTheID(nextUrl, listeUrlDesFilmsDAdventure)



/* Récuperation des films d'action */
let listeUrlDesFilmsDAction = []
getTheID("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Action", listeUrlDesFilmsDAction);
getTheID(nextUrl, listeUrlDesFilmsDAction)

// Récuperation des films de drama
    let listeUrlDesFilmsDeDrama = []
    getTheID("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Drama", listeUrlDesFilmsDeDrama);
    getTheID(nextUrl, listeUrlDesFilmsDeDrama)
/*console.log(listeDUrlFilmsLesMieuxNotes)
console.log(listeUrlDesFilmsDAdventure)
console.log(listeUrlDesFilmsDAction) */



function recuperationDesInfosDunFilm(urlDunFilm) {

    dictionnaireDuFilm ={}
    xhrDeux.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            /*console.log(JSON.parse(this.responseText))*/

            var imageDuFilm = JSON.parse(this.responseText).image_url;
            var titreDuFilm = JSON.parse(this.responseText).title;
            var resumeDuFilm =  JSON.parse(this.responseText).long_description;
            var id =  JSON.parse(this.responseText).id;


        dictionnaireDuFilm["image_du_film"] = imageDuFilm;
        dictionnaireDuFilm["titre_du_film"] = titreDuFilm;
        dictionnaireDuFilm["resume_du_film"] = resumeDuFilm;
        dictionnaireDuFilm["id"] = id;

        


        };

       
    };

    xhrDeux.open("GET", urlDunFilm, false);
    xhrDeux.send();

    return dictionnaireDuFilm
}

/* Première section (meilleur film) */

var data_top_film = recuperationDesInfosDunFilm(listeDUrlFilmsLesMieuxNotes[0])

var pictureBestMovie = document.getElementById("picture_best_movie");
var titleBestMovie = document.getElementById("title_best_movie");
var descriptionBestMovie = document.getElementById("description_best_movie");
var id = document.getElementById("primary_movies_first_page")

pictureBestMovie.src = data_top_film.image_du_film;
titleBestMovie.innerHTML = data_top_film.titre_du_film;
descriptionBestMovie.innerHTML = data_top_film.resume_du_film;
id.insertAdjacentHTML("beforeend",`<button href="#modal" class="open-modal" id="${data_top_film.id}" class ="btn">En savoir plus</button>`) 




function recuperationDesInfosDuneListeDeFilms(listeDesFilms) {

    listedictionnaireDesFilmsDeLaListe = []
    

    if (listeDesFilms == listeDUrlFilmsLesMieuxNotes){
        for (films = 1; films < listeDesFilms.length; films++) {
        listedictionnaireDesFilmsDeLaListe.push(recuperationDesInfosDunFilm(listeDesFilms[films]));

    };
    }else{

        for (films = 0; films < listeDesFilms.length-1; films++) {
            listedictionnaireDesFilmsDeLaListe.push(recuperationDesInfosDunFilm(listeDesFilms[films]));
    
        };
    }

    
    return listedictionnaireDesFilmsDeLaListe
  
}

/* liste des 7 films de la catégorie action */
listeDesFIlmsDeLaCategorieAction = recuperationDesInfosDuneListeDeFilms(listeUrlDesFilmsDAction)

console.log(listeDesFIlmsDeLaCategorieAction)

/* liste des 7 films de la catégorie top film  */
var listeDesFIlmsDeLaCategorieLesMieuxNotes = []
listeDesFIlmsDeLaCategorieLesMieuxNotes = recuperationDesInfosDuneListeDeFilms(listeDUrlFilmsLesMieuxNotes)

console.log(listeDesFIlmsDeLaCategorieLesMieuxNotes)

/* liste des 7 films de la catégorie aventure */
listeDesFIlmsDeLaCategorieAventure = recuperationDesInfosDuneListeDeFilms(listeUrlDesFilmsDAdventure)

console.log(listeDesFIlmsDeLaCategorieAventure)

// liste des 7 films de la catégorie drame 
listeDesFIlmsDeLaCategorieDrama = recuperationDesInfosDuneListeDeFilms(listeUrlDesFilmsDeDrama)

console.log(listeDesFIlmsDeLaCategorieDrama)

/* Ajouter des données récupérées dans la page html */



// function d'ajout des films de chaque categorie souhaitée

function ajoutDesFilmsALaPageWeb(listeDesFilmsDeLaCategorieAAjouter, ancre){
        var ul = document.getElementById(ancre)
        console.log(ul)
        for (i=0; i<listeDesFilmsDeLaCategorieAAjouter.length; i++){

            const li = `<li> 
                <div class ="info_et_photo">
                    <a href="#modal" class="open-modal" id="${listeDesFilmsDeLaCategorieAAjouter[i].id}"><img src="${listeDesFilmsDeLaCategorieAAjouter[i].image_du_film}">
                    <p class="p_infos">En savoir plus</p></a>
                </div>
            </li>`
            
            ul.insertAdjacentHTML("beforeend", li)

        }
}

//Première catégorie (film les mieux notés)
ajoutDesFilmsALaPageWeb(listeDesFIlmsDeLaCategorieLesMieuxNotes, "premiere_categorie" )

//Deuxième catégorie (film d'action)
ajoutDesFilmsALaPageWeb(listeDesFIlmsDeLaCategorieAction, "deuxieme_categorie" )

// Troisième catégorie (film d'aventure)
ajoutDesFilmsALaPageWeb(listeDesFIlmsDeLaCategorieAventure, "troisieme_categorie" )

// Quatrième catégorie (film de drama)
ajoutDesFilmsALaPageWeb(listeDesFIlmsDeLaCategorieDrama, "quatrieme_categorie" )


const modal = document.querySelector(".modal");

const openmodal = document.querySelectorAll(".open-modal");


openmodal.forEach(open => open.addEventListener("click", openModal))


function openModal(){
    modal.classList.toggle("active")
    var id = this.id
    console.log(id)
    

    
    xhrTrois.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            var ancre = document.getElementById("infos_modal");

            const infoModal = `
                <div class="infos_modal_placement">
                    <img src ="${JSON.parse(this.responseText).image_url}"/>
                    <div class = "modal-titre-infos">
                    <h2>${JSON.parse(this.responseText).title}</h2>

                    <ul>
                        <li>Genre: <strong>${JSON.parse(this.responseText).genres}</strong></li>
                        <li>Date de publication: <strong>${JSON.parse(this.responseText).date_published}</strong></li>
                        <li>Note: <strong>${JSON.parse(this.responseText).avg_vote}/10</strong></li>
                        <li>Score imdb: <strong>${JSON.parse(this.responseText).imdb_score}/10</strong></li>
                        <li>Producteur(s): <strong>${JSON.parse(this.responseText).directors}</strong></li>
                        <li>Acteur(s): <strong>${JSON.parse(this.responseText).actors}</strong></li>
                        <li>Durée: <strong>${JSON.parse(this.responseText).duration}min</strong></li>
                        <li>Pays: <strong>${JSON.parse(this.responseText).countries}</strong></li>
                        <li>Box-office: <strong>${JSON.parse(this.responseText).worldwide_gross_income}$</strong></li>
                        
                    </ul>
                    </div>
                </div>
                    <p>${JSON.parse(this.responseText).long_description}</p>
                    
                    `;
       
        ancre.innerHTML =infoModal
    }
    
    }

    xhrTrois.open("GET", "http://localhost:8000/api/v1/titles/" + id, false);
    xhrTrois.send();
}
