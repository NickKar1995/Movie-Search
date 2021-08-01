let apiKey = 'f3a23ecc';
let apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}`;
let pagination = {
  page:1,
  totalResults:0,
  pages:0
}
//totalResults is for referrence only




let search = (query,page) => {
  if (!query && page){
    pagination.page=parseInt(page);
    query=document.querySelector('#search-input').value;
  }
  fetch(`${apiUrl}&s=${query}&page=${pagination.page}`).then(response =>response.json()).then(response=>{
    // console.log(response);
    // let totalResults = (response.totalResults)/10;
    if (response.Error) {
      alert(response.Error)
      return;
    }
    
    let movies = response.Search;
    pagination.totalResults=parseInt(response.totalResults)
    pagination.pages=Math.ceil(pagination.totalResults/10)
    document.querySelector('#results').innerHTML=`Sum of all movies ${pagination.totalResults}`
    // console.log(pagination.totalResults)
    // console.log(pagination.pages)
    
    createPagination(pagination.pages,pagination.page)
    createMovies(movies);
  })
}

let createMovies = (movies) => {
  document.querySelector('#movies').innerHTML=''
//here i changed movies in for each for m and movies for movie in let
  movies.forEach(m => {
    
    let movie = `<div class = "col>"<div class="card" style="width: 18rem;">
  <img class="card-img-top" src="${m.Poster}" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">${m.Title}</h5>
    <a href="javascript:;" data-imdb = "${m.imdbID}" onclick = "extraData('${m.imdbID}')" class="btn btn-primary">Show More</a>
    <ul class="list-group list-group-flush">
    <li class="list-group-item">${m.Year}</li>
  </ul>
  </div>
</div>
</div>`
    document.querySelector('#movies').innerHTML += movie;
  })

}

let extraData = (id) =>{
  // console.log(id);
  document.querySelector('#staticBackdrop .modal-body ul').innerHTML+='';

  fetch(`${apiUrl}&i=${id}&plot=full`).then(res=>res.json().then(response=>{
    console.log(response);

    for(key in response){
      console.log(key)
      document.querySelector('#staticBackdrop .modal-body ul').innerHTML+=
      `<li class = 'list-group-item'>${key}:${response[key]}</li>`
    }

    extraModal.show();
  }))
}



document.querySelector('#search-input').addEventListener('keyup', function(event) {

  if (event.key == 'Enter') {
    if (this.value.length < 4) {
      console.log('reached')
      alert("Need more characters")
    }
    
      pagination.page=1;
      search(this.value);
  }

})

document.querySelector('#search-button').addEventListener('click', function(event) {
  let query = document.querySelector("#search-input").value;
  console.log(query)
  if (query.length < 4) {
    console.log('reached cool')
    alert('Need more characters')
  }
  pagination.page=1;
  search(query);
})


let extraModal = new bootstrap.Modal(document.querySelector('#staticBackdrop'))


let createPagination = (pages,currentPage)=>{
  // console.log(typeof(pages))
  currentPage=parseInt(currentPage)
 


  let html = `<nav aria-label="Page navigation example"><ul class="pagination">`;
  if (currentPage>1){
    html+=`<li class="page-item"><a class="page-link" href="#">Previous</a></li>`;
  }
for (let i=1;i<=pages;i++){
  if(i>currentPage-4&&i<currentPage+4){
    html +=`<li class="page-item ${currentPage===i?'active':''}"><a class="page-link" href="javascript:;">${i}</a></li>`  

  }
  
}
if (currentPage<pages){
  html += `<li class="page-item"><a class="page-link" href="#">Next</a></li>`
}
html+=`</ul></nav>`
document.querySelector('#pagination').innerHTML=html
createEvents()
}

let createEvents=()=>{
  document.querySelectorAll('ul.pagination a').forEach(a=>{
    a.addEventListener('click',function(e){
      if(this.innerHTML==='Previous'){
        search(false,pagination.page-1)
        return
      }else if(this.innerHTML==='Next'){
        search(false,pagination.page+1)
        return
      }
      search(false,this.innerHTML);
    })
  })
}

