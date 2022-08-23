
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios'
import { refs } from './refs';
import { markup } from './markup';



const API_KEY = '29226751-f0ce60e58b224fb7f016bc6a2';
const BASE_URL = 'https://pixabay.com/api/';
const perPage = 40;
let currentPage = 1;
let nextPage = '';
let query = refs.input.value;
let lightbox;
const totalPages = 500 / perPage;

refs.loadMore.classList.add("hide");

const fetchPictures = async () => {
    try {
        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true&q=${query}&page=${currentPage}&per_page=${perPage}`);
        const arrayImages = await response.data.hits;

        if (arrayImages.length === 0) {
            Notiflix.Notify.warning(
                "Sorry, there are no images matching your search query. Please try again.")
        }
        else if (arrayImages.length !== 0) {
            refs.loadMore.classList.remove('hide')
        }
        return {
            arrayImages,
            totalHits: response.data.totalHits,
        }
      
    } catch (error) {
        console.log(error)
    }
};


function createMurkup (  { arrayImages, totalHits }) {
    if (currentPage === 1) {
        Notiflix.Notify.success(`Hoooray! We found ${totalHits} images!`);
    }
    return arrayImages.reduce((acc, img) => acc + markup(img), "");
};

function renderMarkup(arrayImages) {
    const result = createMurkup(arrayImages);
    refs.gallery.insertAdjacentHTML('beforeend', result);

    lightbox.refresh();
};

function onFormSubmit(e) {
    e.preventDefault();
    refs.gallery.innerHTML = "";
    // query = refs.input.value;
    refs.loadMore.classList.add('hide');
    let inputSearch = refs.input.value.trim();
    nextPage = inputSearch;
    currentPage = 1;

    fetchPictures()
        .then(images => {
            renderMarkup(images);
            currentPage += 1;

        })
        .catch(error => (console.log(error)))

    lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
    });
}



    function loadMoreBtn(){
    if (currentPage > totalPages) {
        refs.buttonLoad.classList.add("hide");
        return toggleAlertPopup()
    }
        query = refs.input.value;

        fetchPictures()
            .then(images => {
                renderMarkup(images);
                currentPage += 1;
            })
            .catch(error => (console.log(error)));
        
          lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
    });
    }

    
function toggleAlertPopup() {
    if (isAlertVisible) {
        return;
    }
    isAlertVisible = true;
    refs.alert.classList.add("hide");
    setTimeout(() => {
        refs.alert.classList.remove("hide");
        isAlertVisible = false;
    }, 3000);
}


refs.form.addEventListener('submit', onFormSubmit);
refs.loadMore.addEventListener('click', loadMoreBtn)
