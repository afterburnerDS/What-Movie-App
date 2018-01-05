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

const THE_MOVIE_DATABASE_URL = 'https://api.themoviedb.org/3/discover/movie?';

const SEARCH_PERSON_URL = 'https://api.themoviedb.org/3/search/person?';


let movie = [];

function getMovieById(string) {
    const query = {
        api_key: '6060f3f90ad0683aa47db5498f6ee552'

    }
    return $.getJSON(`https://api.themoviedb.org/3/movie/${string}?`, query);
}

function getMovieFromApi(actor, director, genre) {
    const query = {
        api_key: '6060f3f90ad0683aa47db5498f6ee552',
        page: '1',
        with_cast: `${actor}`,
        with_crew: `${director}`,
        with_genres: `${genre}`

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
    //randomize a value from the array given
    //console.log(data.results[0].poster_path);
    console.log(data.results);
    movie = data.results[Math.floor(Math.random() * data.results.length)];
    
    console.log(movie);
    setHomePage(movie);
}

function setHomePage(movie){
    console.log(movie);
    //set the poster of the movie given
    $('.mainMovie__poster').css({
        "background-image": `url(https://image.tmdb.org/t/p/w640${movie.poster_path})`
    });
    //set the title, ratings, genres and description
    $('.mainMovie__info--title').text(`${movie.original_title}`);
    $('.mainMovie__info--extra__add--rating').text(`TMDB Rating: ${movie.vote_average}/10`);
    $('.mainMovie__info--extra__add--rating').text(`TMDB: ${movie.vote_average}/10`);
    //limit the overview to 30 characters
    if (movie.overview.length > 60) {
        let truncated = movie.overview.substr(0, 200) + '...';
        $('.mainMovie__info--extra__desc').text(`${truncated}`)
    } else {
        $('.mainMovie__info--extra__desc').text(`${movie.overview}`)
    }

    //find the list of genres, map the names and  limit to 2 genres to display

    const genresMovies = movie.genre_ids.map(function (elem1, index1) {
        genres.map(function (elem2, index2) {
            if (elem2.id == elem1) {
                console.log(elem2.name);
                elem1 = elem2.name;
            }
        });

        return elem1;
    });
    if (genresMovies[1] != "" && genresMovies[1] != undefined) {
        $('.mainMovie__info--extra__add--genres').text(`${genresMovies[0]}, ${genresMovies[1]}`);
    } else {
        $('.mainMovie__info--extra__add--genres').text(`${genresMovies[0]}`);
    }
}

function handleSubmitInfo() {
    //Submit parameters from the input to the API to get an array that fits the parameters
    $(".submit").off('click');
    $(".submit").on('click', function (event) {
        event.preventDefault();
        // alert("submited");
        //find actor, director and genre
        let actor = $('.actor').val();
        let director = $('.director').val();
        let genre = $('.genre').val();

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
            console.log("idactor " +idActor + " " + "idDirector " + idDirector + " " + "id genre "+ genre);
            return getMovieFromApi(idActor, idDirector, genre);
        }).then(displayMovieSearchData);
        handleViewTrailer();
        // clear out the input
        // $('.actor').val("");
        // $('.director').val("");
        // $('.genre').val("");

    });
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
        //set the html elements with new movie info
        setHomePage(movie);
        // handleViewTrailer();
    });
}

function displayMoreInfo() {

    // display the titles
    $(".moreInfoPage__title").text(`${movie.original_title}`);
    //display the movie poster
    $(".moreInfoPage__poster").css({
        "background-image": `url(https://image.tmdb.org/t/p/w640${movie.poster_path})`
    });

    $(".moreInfoPage__details--rating").text(`TMDB Rating: ${movie.vote_average}/10`);
    //get the year from the date
    const year = new Date(movie.release_date).getFullYear();
    $(".moreInfoPage__details--year").text(`${year}`);
    $(".moreInfoPage__details--Country").text(`${movie.original_language.toUpperCase()}`);
    // get the genres again

    //find the list of genres, map the names and  limit to 2 genres to display

    Promise.all([

        getMovieById(movie.id)
    ]).then(function (data) {
        movie = data[0];
        console.log(movie.genres );
        if (movie.genres[1] != "" && movie.genres[1] != undefined) {
            $('.moreInfoPage__details--genres').text(`${movie.genres[0].name}, ${movie.genres[1].name}`);
        } else {
            $('.moreInfoPage__details--genres').text(`${movie.genres[0].name}`);
        }
        
    });

    
    //get Director and actors and recommendations
    Promise.all([
        getCreditsfromApi(movie.id),
        getRecommendations(movie.id)
    ]).then(function (data) {
        const creditsData = data[0];
        const recommendationsData = data[1];
        // console.log(data[0]);
        $('.moreInfoPage__team--Actors').text(`Stars: ${data[0].cast[0].name}, ${data[0].cast[1].name}, ${data[0].cast[2].name}`);

        //in the arry of crew, find the string directing and return the name

        let nameDirector = data[0].crew.map(function (elem, index) {

            if (elem.job == "Director") {
                return elem.name;
            }
        });

        //filter all the empty spaces
        nameDirector = $.grep(nameDirector, function (n) {
            return n == 0 || n
        });

        $('.moreInfoPage__team--Director').text(`Director: ${nameDirector.toString()}`);

        console.log(data[1].results);

        $('.similarMovie1').css({
            "background-image": `url(https://image.tmdb.org/t/p/w640${data[1].results[0].poster_path})`
        });

        $(".similarMovie1").off('click');
        $(".similarMovie1").on('click', function (event) {
            Promise.all([

                getMovieById(data[1].results[0].id)
            ]).then(function (data) {
                movie = data[0];
                displayMoreInfo();
            });
        });

        $('.similarMovie2').css({
            "background-image": `url(https://image.tmdb.org/t/p/w640${data[1].results[1].poster_path})`
        });

        $(".similarMovie2").off('click');
        $(".similarMovie2").on('click', function (event) {
            Promise.all([

                getMovieById(data[1].results[1].id)
            ]).then(function (data) {
                movie = data[0];
                displayMoreInfo();
            });
        });

        $('.similarMovie3').css({
            "background-image": `url(https://image.tmdb.org/t/p/w640${data[1].results[2].poster_path})`
        });

        $(".similarMovie3").off('click');
        $(".similarMovie3").on('click', function (event) {
            Promise.all([

                getMovieById(data[1].results[2].id)
            ]).then(function (data) {
                movie = data[0];
                displayMoreInfo();
            });
        });

        $('.similarMovie4').css({
            "background-image": `url(https://image.tmdb.org/t/p/w640${data[1].results[3].poster_path})`
        });

        $(".similarMovie4").off('click');
        $(".similarMovie4").on('click', function (event) {
            Promise.all([

                getMovieById(data[1].results[3].id)
            ]).then(function (data) {
                movie = data[0];
                displayMoreInfo();
            });
        });

        $('.similarMovie5').css({
            "background-image": `url(https://image.tmdb.org/t/p/w640${data[1].results[4].poster_path})`
        });
        $(".similarMovie5").off('click');
        $(".similarMovie5").on('click', function (event) {
            
            Promise.all([

                getMovieById(data[1].results[4].id)
            ]).then(function (data) {
                movie = data[0];
                displayMoreInfo();
            });
        });

    })

    //Complete overview
    $('.moreInfoPage__description').text(`${movie.overview}`);

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
        displayMoreInfo();
        // handleViewTrailer();
    });
}

function handleViewTrailer(){
    $(".mainMovie__buttons--trailer").off("click");
    $(".mainMovie__buttons--trailer").on("click", function(event){
        
        Promise.all([

            getTrailerfromApi(movie.id)
        ]).then(function (data) {
            const trailerList = data[0].results;
            let videoTag = data[0].results.map(function (elem, index) {

                if (elem.name.includes("Trailer")) {
                    return elem.key;
                }
            });

            //filter all the empty spaces
            videoTag = $.grep(videoTag, function (n) {
            return n == 0 || n
        });
    
            console.log(videoTag);

            $(".mainMovie__buttons--trailer").attr('video-url',`https://www.youtube.com/watch?v=${videoTag[0]}`);
            console.log("cheguei");
            $("#video1").videoPopup();
            $("#video2").videoPopup();
            console.log("cheguei popup");
        })
        
    });

}

function handleMovies() {
    handleSubmitInfo();
    handleMoreInfo();
    
}

$(handleMovies);