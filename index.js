'use strict'

const genres = [{
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
];

const languages = [
    {
        "code":"en",
        "language":"English"
    },
    {
        "code":"es",
        "language":"Spanish"
    },
    {
        "code":"it",
        "language":"Italilan"
    },
    {
        "code":"fr",
        "language":"French"
    },
    {
        "code":"de",
        "language":"German"
    },
    {
        "code":"ja",
        "language":"Japanese"
    },
    {
        "code":"ru",
        "language":"Russian"
    },
    {
        "code":"zh-cn",
        "language":"Chinese"
    },
    {
        "code":"pt",
        "language":"Portuguese"
    },
];


const THE_MOVIE_DATABASE_URL = 'https://api.themoviedb.org/3/discover/movie?';

const SEARCH_PERSON_URL = 'https://api.themoviedb.org/3/search/person?';

let movie = [];
let movieMoreInfo = [];
let movies = [];
let newMovies = []; 
let moviePreviousSelected = 0;
let movieIndexSelected = 0;

function getMovieById(string) {
    const query = {
        api_key: '6060f3f90ad0683aa47db5498f6ee552'

    }
    return $.getJSON(`https://api.themoviedb.org/3/movie/${string}?`, query);
}

function getMoviesFromApi(actor, director, genre, rating, decadeLow, decadeHigh, language) {
    const query = {
        api_key: '6060f3f90ad0683aa47db5498f6ee552',
        page: '1',
        with_cast: `${actor}`,
        with_crew: `${director}`,
        with_genres: `${genre}`,
        "vote_average.gte": `${rating}`,
        "primary_release_date.gte":  `${decadeLow}`,
        "primary_release_date.lte": `${decadeHigh}`,
        with_original_language: `${language}`,
        "vote_count.gte": '50'
    }
    return $.getJSON(THE_MOVIE_DATABASE_URL, query);
}

function getCreditsfromApi(string) {
    const query = {
        api_key: '6060f3f90ad0683aa47db5498f6ee552'
    }

    return $.getJSON(`https://api.themoviedb.org/3/movie/${string}/credits?`, query)
}

function getTrailerfromApi(string) {

    const query = {
        api_key: '6060f3f90ad0683aa47db5498f6ee552',
        language: 'en-US'
    }

    return $.getJSON(`https://api.themoviedb.org/3/movie/${string}/videos?`, query);
}

function getRecommendations(string) {
    const query = {
        api_key: '6060f3f90ad0683aa47db5498f6ee552',
        language: 'en-US',
        page: 1
    }

    return $.getJSON(`https://api.themoviedb.org/3/movie/${string}/recommendations?`, query);
}

function getIdFromApi(string) {
    if (string != "") {
        const data = {

            api_key: '6060f3f90ad0683aa47db5498f6ee552',
            query: `${string}`,
            page: '1',
            include_adult: 'false'

        };

        return $.getJSON(SEARCH_PERSON_URL, data);
    } else {
        return "";
    }

}

function displayMovieSearchData(data) {

     if(data!= 0){
        movies = data;
        
        // reset global vairables
        newMovies = [];
        movieMoreInfo = [];
        moviePreviousSelected = 0;
        movieIndexSelected = 0;
        

        for(let i = 0; i<movies.length; i++){
            //choosing one movie from the list of movies
            movie = movies[i];
            //include in the new list movies
            newMovies.push(movie);
        }

        renderMainMovies(newMovies);

     }else{
         // no movie with these criteria
         //determine if mainMovie is displaying
       
         if(!$('*').hasClass("mainMovie")){
            
            let noMovie = `<div class="mainMovie__main">
            <p class="mainMovie__noMovie ">No Movie was found. Please try again !</p></div>`;
            
            $('.mainMovies').html(noMovie);

         }else{
            $('.mainMovie__poster').addClass("nodisplay");
            $('.mainMovie__info').addClass("nodisplay");
            $('.mainMovie__buttons').addClass("nodisplay");
            $('.pagination').addClass("nodisplay");
            $('.mainMovie__noMovie').removeClass('nodisplay');

            
         }
      
     }
}


function generateMainMovie(item, index, template){
    return `<div class="mainMovie mainMovie_${index}">
    <div class="mainMovie__main">
    <p class="mainMovie__noMovie nodisplay">No Movie was found. Please try again !</p>
        <div class="mainMovie__poster mainMovie__poster_${index} "></div>
        <div class="mainMovie__info">
            
            <p class="mainMovie__info--title mainMovie__info--title_${index}">Lorem ipsum dolor sit amet.</p>
            <div class="mainMovie__info--extra">
                <div class="mainMovie__info--extra__add">
                    <p class="mainMovie__info--extra__add--rating mainMovie__info--extra__add--rating_${index}">rating</p>
                    <p class="mainMovie__info--extra__add--genres mainMovie__info--extra__add--genres_${index}">genres</p>
                </div>
                <p class="mainMovie__info--extra__desc mainMovie__info--extra__desc_${index}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi quod ipsam deleniti
                    at dolores harum eveniet. Quis, nulla similique! Aliquam!</p>
            </div>
        </div>
    </div>
    <div class="mainMovie__buttons">

        <a href="#" class="mainMovie__buttons--trailer" video-url="https://www.youtube.com/watch?v=0wCC3aLXdOw">
            VIEW TRAILER
        </a>

        <a href="#" class="mainMovie__buttons--info">MORE INFO</a>
    </div>

        <div class="pagination">

        </div>
    </div>`;
    
}

function generateMainMoviesString(newMovies){
    //for every movie retrieved generate div with all the information
    let items = newMovies.map(function(elem,index){
        return generateMainMovie(elem, index);
        
    });

    return items.join("");
}

function renderMainMovies(newMovies){

    const mainMoviesString = generateMainMoviesString(newMovies);
  // insert that HTML into the DOM
  $('.mainMovies').html(mainMoviesString);
  //pagination logic
        $(function() {
            $(".pagination").pagination({ 
                items: `${newMovies.length}`,
                itemsOnPage: 1,
                cssStyle: 'dark-theme',
    
                onPageClick: function(pageNumber, event){
                    //selec the element selected
                    if($(event.currentTarget).text() === "Prev"){
                         movieIndexSelected = moviePreviousSelected -1;
                         movie = newMovies[movieIndexSelected];

                    }else if($(event.currentTarget).text() === "Next"){
                         movieIndexSelected = moviePreviousSelected +1;
                         movie = newMovies[movieIndexSelected];

                    }else{
                         movieIndexSelected = $(event.currentTarget).text() - 1;
                         movie = newMovies[movieIndexSelected];
                    }
                    // show the element selected and hide all the others
                    $(`.mainMovie_${moviePreviousSelected}`).addClass("nodisplay");
                    $(`.mainMovie_${movieIndexSelected}`).removeClass("nodisplay");
                    moviePreviousSelected =  movieIndexSelected
                    //handles for view trailer e moreinfo
                    movieMoreInfo = movie;
                    handleViewTrailer();
                    handleMoreInfo();

                }
            });
        })

  for(let i = 0; i< newMovies.length; i++){
      //set the movie info in all movies
      setHomePage(newMovies[i],i);
      //hide all elements but the first  element
      if(i != 0){
        $(`.mainMovie_${i}`).addClass("nodisplay");
      }
  }

  movie = newMovies[0];
  handleMoreInfo();
  handleViewTrailer();
  
}

function setHomePage(movie,index) {
    
    //set the poster of the movie given
    $(`.mainMovie__poster_${index}`).html(
        `<img src="https://image.tmdb.org/t/p/w640${movie.poster_path}" alt="poster movie"></img>`
    );
    //set the title, ratings, year and description
    const yearMain = new Date(movie.release_date).getFullYear();
    $(`.mainMovie__info--title_${index}`).text(`${movie.original_title} (${yearMain})`);
    $(`.mainMovie__info--extra__add--rating_${index}`).text(`${movie.vote_average}/10`);
    //limit the overview to 150 characters
    if (movie.overview.length > 60) {
        let truncated = movie.overview.substr(0, 150) + '...';
        $(`.mainMovie__info--extra__desc_${index}`).text(`${truncated}`)
    } else {
        $(`.mainMovie__info--extra__desc_${index}`).text(`${movie.overview}`)
    }

    //find the list of genres, map the names
    

    const genresMovies = movie.genre_ids.map(function (elem1, index1) {
        genres.map(function (elem2, index2) {
            if (elem2.id == elem1) {
                
                elem1 = elem2.name;
            }
        });

        return elem1;
    });


    $(`.mainMovie__info--extra__add--genres_${index}`).text(`${genresMovies.toString().replace(/,/g, " ")}`);
}

function handleSubmitInfo() {
    //Submit parameters from the input to the API to get an array that fits the parameters
    $(".submit").off('click');
    $(".submit").on('click', function (event) {
        event.preventDefault();

        //find actor, director, genre, rating, decades, languages
        let actor = $('.actor').val();
        let director = $('.director').val();
        let genres = $('.genre').val();
        let rating = $('.rating').val();
        let decades = $('.decade').val();
        let languages = $('.language').val();

        //find the id's of actor and director in the API
        Promise.all([
            getIdFromApi(actor),
            getIdFromApi(director)
        ]).then(function (data) {

            const actorData = data[0];
            const directorData = data[1];
            let idActor = 0;
            let idDirector = 0;
            if (data[0] != 0) {
                idActor = actorData.results[0].id;
            } else {
                idActor = "";
            }

            if (data[1] != 0) {
                idDirector = directorData.results[0].id;
            } else {
                idDirector = "";
            }


            let promiseArrayDecades = [];
          
            let promiseArrayMovies = [];
            
            //find movies with the actor, director, genre(s), rating, decade(s) and language(s)
            if(genres.length != 0){
              
                genres.forEach(function(genre){
                    if(decades != 0){
                        decades.forEach(function(decade){
                            let newDecade = decade.split(" ");
                            if(languages !=0){
                                
                                languages.forEach(function(language){

                                    promiseArrayMovies.push(getMoviesFromApi(idActor,idDirector,genre,rating, newDecade[0], newDecade[1], language));
                                });
                                
                            }else{
                                
                                promiseArrayMovies.push(getMoviesFromApi(idActor, idDirector, genre,rating,newDecade[0],newDecade[1],""));
                            }
                        })
                    }else if(languages !=0){

                        languages.forEach(function(language){

                            promiseArrayMovies.push(getMoviesFromApi(idActor,idDirector,genre,rating, "", "", language));
                        });
                        
                        
                    }else {
                        
                        promiseArrayMovies.push(getMoviesFromApi(idActor,idDirector,genre,rating, "", "", ""));
                    }

                });

                return Promise.all(promiseArrayMovies);
            }
            else if(decades.length != 0){
    
                decades.forEach(function(decade){
                    let newDecade = decade.split(" ");
                    
                    if(languages.length != 0){
                        languages.forEach(function(language){
                            
                             promiseArrayMovies.push(getMoviesFromApi(idActor,idDirector,genres.toString(),rating,newDecade[0], newDecade[1], language));
                        });
                    }else{
                        
                        promiseArrayMovies.push(getMoviesFromApi(idActor,idDirector,genres.toString(),rating,newDecade[0], newDecade[1], ""));
                        
                    }
                });
               
               
                 return Promise.all(promiseArrayMovies);

            }else if(languages.length != 0){
                
                promiseArrayMovies = languages.map(function(elem,index){

                    return getMoviesFromApi(idActor,idDirector,genres.toString(),rating,"","", elem);
                });
               
                return Promise.all(promiseArrayMovies);
                    
            }else{
 
                    return getMoviesFromApi(idActor, idDirector, genres.toString(),rating,"","","");
                

               
            }

        })
        
        .then(function(data){
            // concatenate all array of movies retrieved
            let oldMovies = [];
            let newMovies =[]
            let actualMovies = [];
            if(data.constructor == Array){
                for(let i = 0; i< data.length; i++){
                    newMovies = oldMovies.concat(data[i].results);
                    oldMovies = newMovies;
                }

                 //randomize positions of newMovies and filter to only 20 movies
    
                if(newMovies.length > 20){
                    actualMovies = shuffle(newMovies).filter(function(elem,index){
                        return index < 20;
                    });
                } else{
    
                    //only randomize newMovies
                    actualMovies = shuffle(newMovies);
                }
    
                return actualMovies;
            }else{

                //randomize
                actualMovies = shuffle(data.results);
                return actualMovies;
            }

        }).then(displayMovieSearchData);
       
    });
}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  

function handleBack() {
    $(".back__link").off('click');
    $(".back__link").on('click', function (event) {
        //toggle More Info Page
        $(".moreInfoPage").toggleClass("nodisplay");
        //toggle back button
        $(".back").toggleClass("visibility");
        //toggle Main Page
        $(".mainPage").toggleClass("nodisplay");
        movieMoreInfo = [];
        // movieMoreInfo = movie;
        handleViewTrailer();
    });
}

function displayMoreInfo() {
    
    //set movieMoreInfo to movie if its empty
    if(movieMoreInfo.length === 0){
        
        movieMoreInfo = movie;
    }

    // display the titles
    const year = new Date(movieMoreInfo.release_date).getFullYear();
    $(".moreInfoPage__title").text(`${movieMoreInfo.original_title} (${year})`);
    //display the movie poster

    $(".moreInfoPage__poster").html(
        `<img src="https://image.tmdb.org/t/p/w640${movieMoreInfo.poster_path}"></img>`
    );

    $(".moreInfoPage__details--rating").text(`TMDB: ${movieMoreInfo.vote_average}/10`);
    //get the year from the date

    const language = function(){
        for(let i = 0; i< languages.length; i++){
            if(movieMoreInfo.original_language === languages[i].code){
               return languages[i].language;
            }
        }
    }

    $(".moreInfoPage__details--Country").text(`${language()}`);
    // get info from the movie clicked 

        getMovieById(movieMoreInfo.id)

       .then(function (data) {
        
         movieMoreInfo = data;

         //map the genres
         
         const genresMoviesMoreInfo = movieMoreInfo.genres.map(function (elem1, index1) {
            return elem1.name;
  
        });
        
            $('.moreInfoPage__details--genres').text(`${genresMoviesMoreInfo.toString().replace(/,/g, " ")}`);

    });


    //get Director, Actors and Recommendations
    Promise.all([
        getCreditsfromApi(movieMoreInfo.id),
        getRecommendations(movieMoreInfo.id)
    ]).then(function (data) {
        const creditsData = data[0];
        const recommendationsData = data[1];

        //Get the 3 main actors
        let star1 = "";
        let star2 = "";
        let star3 = "";
        
        if(data[0].cast.length !== 0){
            if(data[0].cast[0].length != 0 || data[0].cast[0] != undefined){
                if( data[0].cast[0].name != undefined ){
                    star1 = data[0].cast[0].name;                                     
                }
            }
        
            if(data[0].cast.length >= 2){
                if(data[0].cast[1].length != 0 || data[0].cast[1] != undefined){
                    if( data[0].cast[1].name !== undefined ){
                        star2 = data[0].cast[1].name;                                     
                    }
                }
            }

            if(data[0].cast.length >= 3){
                if(data[0].cast[2].length != 0 || data[0].cast[2] != undefined){
                    if( data[0].cast[2].name !== undefined ){
                        star3 = data[0].cast[2].name;                                     
                    }
                }
            }
        }   

        $('.moreInfoPage__team--Actors').text(`${star1}, ${star2}, ${star3}`);

        //in the arry of crew, find the string directing and return the name

        let nameDirector = data[0].crew.filter(function (elem, index) {

            if (elem.job == "Director") {
                return true;
            }
        }).map(function(elem, index){
            return elem.name
        })


        $('.moreInfoPage__team--Director').text(`${nameDirector.toString().replace(/,/g, ", ")}`);

        //set the posters in the similar movies

        $('.similarMovie1').css({
            "background-image": `url(https://image.tmdb.org/t/p/w640${data[1].results[0].poster_path})`
        });
        
        //clicking on each movie set moreInfoPage

        $(".similarMovie1").off('click');
        $(".similarMovie1").on('click', function (event) {
            

                getMovieById(data[1].results[0].id)
            .then(function (data) {
                movieMoreInfo = data;
                displayMoreInfo();
            });
        });

        $('.similarMovie2').css({
            "background-image": `url(https://image.tmdb.org/t/p/w640${data[1].results[1].poster_path})`
        });

        $(".similarMovie2").off('click');
        $(".similarMovie2").on('click', function (event) {
            
                getMovieById(data[1].results[1].id)
            .then(function (data) {
                movieMoreInfo = data;
                displayMoreInfo();
            });
        });

        $('.similarMovie3').css({
            "background-image": `url(https://image.tmdb.org/t/p/w640${data[1].results[2].poster_path})`
        });

        $(".similarMovie3").off('click');
        $(".similarMovie3").on('click', function (event) {
           
                getMovieById(data[1].results[2].id)
            .then(function (data) {
                movieMoreInfo = data;
                displayMoreInfo();
            });
        });

        $('.similarMovie4').css({
            "background-image": `url(https://image.tmdb.org/t/p/w640${data[1].results[3].poster_path})`
        });

        $(".similarMovie4").off('click');
        $(".similarMovie4").on('click', function (event) {
         
                getMovieById(data[1].results[3].id)
            .then(function (data) {
                movieMoreInfo = data;
                displayMoreInfo();
            });
        });

        $('.similarMovie5').css({
            "background-image": `url(https://image.tmdb.org/t/p/w640${data[1].results[4].poster_path})`
        });
        $(".similarMovie5").off('click');
        $(".similarMovie5").on('click', function (event) {

                getMovieById(data[1].results[4].id)
            .then(function (data) {
                movieMoreInfo = data;
                displayMoreInfo();
            });
        });

    })

    //Complete overview
    $('.moreInfoPage__description').text(`${movieMoreInfo.overview}`);

    handleBack();
    handleViewTrailer();
}



function handleMoreInfo() {
    $(".mainMovie__buttons--info").off('click');
    $(".mainMovie__buttons--info").on('click', function (event) {
        //toggle back button
        $(".back").toggleClass("visibility");
        //toggle main page
        $(".mainPage").toggleClass("nodisplay");
        //toggle more info page
        $(".moreInfoPage").toggleClass("nodisplay");
        movieMoreInfo = movie;
        displayMoreInfo();
       
        // handleViewTrailer();
    });
}

function handleViewTrailer() {
    
    //if not similar Movie was selected, the trailer it is from the original Movie
        if (movieMoreInfo.length === 0){
            movieMoreInfo = movie;
        }
    
       
        //retrieve trailer youtube key from Api

            getTrailerfromApi(movieMoreInfo.id)
        .then(function (data) {

            let videoTag = data.results.map(function (elem, index) {

                if (elem.name.includes("Trailer")) {
                    return elem.key;
                }
            });

            //filter all the empty spaces
            videoTag = $.grep(videoTag, function (n) {
                return n == 0 || n
            });

            //set the video-url on the button the youtube link

            $(".mainMovie__buttons--trailer").attr('video-url', `https://www.youtube.com/watch?v=${videoTag[0]}`).videoPopup();

        })
}

function handleDropdown(){
     
	let $html = $('html');
  
    $html.on('click.ui.dropdown', '.js-dropdown', function(e) {
      e.preventDefault();
      $(this).toggleClass('is-open');
    });
    
    $html.on('click.ui.dropdown', '.js-dropdown [data-dropdown-value]', function(e) {
      e.preventDefault();
      var $item = $(this);
      var $dropdown = $item.parents('.js-dropdown');
      $dropdown.find('.js-dropdown__input').val($item.data('dropdown-value'));
      $dropdown.find('.js-dropdown__current').text($item.text());
    });
    
    $html.on('click.ui.dropdown', function(e) {
      var $target = $(e.target);
      if (!$target.parents().hasClass('js-dropdown')) {
        $('.js-dropdown').removeClass('is-open');
      }
    });
}

function handleMovies() {
    handleSubmitInfo();
    handleMoreInfo();
    handleDropdown();

    //set dropdowns
    $('.js-example-basic-multiple').select2({
        theme: "classic",
        maximumSelectionLength: 3
    });
    $('.js-example-basic-single').select2();
 
 
    
}

$(handleMovies);