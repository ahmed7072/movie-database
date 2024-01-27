
const API_KEY = "api_key=1cf50e6248dc270629e802686245c2c8";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?&page=1&sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?" + API_KEY;

const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const main = document.getElementById("main");
const form = document.querySelector("#form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");
const overlayP =document.getElementById("overlay");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");
let pageNum = 1
let overlay 
var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = "";
var totalPages = 100;

getMovies(API_URL)

function getMovies(url){
    console.log(url)
    fetch(url).then(res => res.json()).then(data => {
        showMovies(data.results)
        if(data.results.length !=0){
          showMovies(data.results)
        }
        else{
          main.innerHTML = `
          <h1>No Results Found</h1>
          `
        }
        localStorage.setItem('data',JSON.stringify(data.results))
    })
}
next.addEventListener('click',()=>{
  pageNum+=1
  let url = BASE_URL + `/discover/movie?&page=${pageNum}&sort_by=popularity.desc&` + API_KEY;
  getMovies(url);
  prev.classList.add('disabled')
  current.innerHTML=`${pageNum}`
})

prevAction = ()=>{
  pageNum-=1
  let url = BASE_URL + `/discover/movie?&page=${pageNum}&sort_by=popularity.desc&` + API_KEY;
  getMovies(url);
  current.innerHTML=`${pageNum}`
}

prev.addEventListener('mouseover',()=>{
  if (pageNum>1){
    prev.classList.remove('disabled')
  }
  prev.addEventListener("click",()=>{
    if(pageNum=1){
      
    }
  })
})
var selectedGenre = [];
setGenre();
function setGenre() {
    tagsEl.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
                t.classList.add('highlight')
                clearBtn()
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                            t.classList.remove('highlight')
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                    t.classList.add('highlight')
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL +'&with_genres='+encodeURI(selectedGenre.join(',')))
            // highlightSelection()
        })
        tagsEl.append(t);
    })
}

function clearBtn(){
  let clearBtn = document.getElementById('clear');
  if(clearBtn){
      clearBtn.classList.add('highlight')
  }else{
          
      let clear = document.createElement('div');
      clear.classList.add('tag','highlight');
      clear.id = 'clear';
      clear.innerText = 'Clear x';
      clear.addEventListener('click', () => {
          selectedGenre = [];
          setGenre();            
          getMovies(API_URL);
      })
      tagsEl.append(clear);
  }
  
}

function showMovies(data){
    main.innerHTML = '';
    data.forEach(movie => {
        const {title , poster_path , vote_average , overview} = movie ;
        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')
        movieEl.innerHTML =`
            <img src="${poster_path ? IMG_URL+poster_path:"https://static.wikia.nocookie.net/bakemonogatari1645/images/c/c6/Bakemonogatari_Poster.jpg/revision/latest?cb=20190707075638" }" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
        </div>
        `
        main.appendChild(movieEl)
        overlay = document.querySelectorAll(".movie")
    });
}

function getColor(vote){
    if(vote>=8){
        return 'green'
    }
    else if(vote >= 5){
        return 'orange'
    }
    else{
        return 'red'
    }
}

form.addEventListener('submit' , (e) => {
  e.preventDefault();

  const searchTerm = search.value;
      selectedGenre = []  //first by resesting the selectedGenre 
      setGenre();   //call it here to select the genre to look in that now is shown in the main page
      if(searchTerm){
        getMovies(searchURL+"&query="+searchTerm)
      }
      else{
        getMovies(API_URL);
      }
})


  overlay.forEach(movie => {
    movie.addEventListener('click',()=>{
      let movieV = movie;
      overlayP.appendChild(movieV)
    })
  })


