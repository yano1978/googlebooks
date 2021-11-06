import 'bootstrap';
import { from, map, switchMap, tap } from 'rxjs';

// declare const rxjs: any; // I can use this in production

interface GoogleBook {
  totalItems: number;
  kind: string;
  items: [];
}

interface BookThumbnails {
  smallThumbnail: string;
  thumbnail: string;
}

interface VolumeInfo {
  authors: [];
  description: string;
  imageLinks: BookThumbnails;
  infoLink: string;
  language: string;
  previewLink: string;
  title: string;
  categories: [];
}

interface Book {
  title: string;
  description: string;
  authors: [];
  categories: [];
  thumbnail: string;
}

interface BookItem {
  volumeInfo: VolumeInfo;
  id: string;
}

const getBooks = (booktitle: string) => {
  // const { from } = rxjs; // I can use this in production
  const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
  const p = fetch(apiUrl + booktitle).then((res) => res.json());
  // .then((books) => console.log(books));
  let count = 0;
  from(p)
    .pipe(
      switchMap((data: GoogleBook) => from(data.items)),
      map((ele: BookItem) => {
        const book: Book = {
          title: ele.volumeInfo.title,
          categories: ele.volumeInfo.categories,
          authors: ele.volumeInfo.authors,
          description: ele.volumeInfo.description,
          thumbnail: ele.volumeInfo.imageLinks.thumbnail,
        };
        return book;
      }),
      // tap((book: Book) => console.log(book))
      tap(() => {
        return count++;
      })
    )
    .subscribe((book: Book) => displayBook(book, count));
};

const bookPrice = () => {
  let price = Math.floor(Math.random() * 25);
  // price = 0;
  if (price > 0) {
    return `<strong>Price ${price} &#xa3;</strong><br>Sign in to apply a first buy coupon discount of 20%`;
  } else {
    return `<span class="not-available">We are sorry, this book is not currently available</span>`;
  }
};

const displayBook = (book: Book, count: number) => {
  const bookTpl = `<div class="card shadow-sm">
                      <img src="${book.thumbnail}" 
                      title="${book.title}" alt="${book.title}" />
                      <div class="card-body d-flex flex-column">
                          <h6 class="card-book">${book.title}</h6>
                          <p class="card-text collapse" id="more-${count}">
                            ${book.description || ''}
                          </p>
                          <div class="card-footer-wrapper d-flex justify-content-between align-items-center">
                              <div class="btn-group">
                                  <a class="btn btn-sm btn-outline-secondary mt-auto" data-bs-toggle="collapse" href="#more-${count}" role="button" aria-expanded="false" aria-controls="#more-${count}">
                                    Read
                                  </a>
                                  <button type="button" class="btn btn-sm btn-outline-secondary mt-auto buy" data-bs-toggle="modal" data-bs-target="#buy-book-${count}">
                                    Buy
                                  </button>
                                  <button data-bs-toggle="button" type="button" class="btn btn-sm btn-outline-secondary mt-auto like">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                                    </svg>
                                  </button>
                              </div>
                          </div>
                      </div>
                    </div>
                    <div class="modal fade" id="buy-book-${count}" tabindex="-1" aria-labelledby="buy-book-${count}" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="buy-book-${count}">
                                    ${book.title}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                ${bookPrice()}
                                <div class="container shipping">
                                      <div class="row">
                                              <div class="col">
                                                  <form>
                                                      <legend>Select shipping options<small>Choose how you want us to deliver you purchase:</small>
                                                      </legend>
                                                      <div class="checkbox-main">
                                                          <input type="button" id="checkall-${count}" class="checkall btn btn-sm btn-outline-secondary mt-auto" value="Check All">
                                                      </div>
                                                      <div class="checkbox">
                                                          <label>
                                                              <input type="checkbox" class="check"> USPS First Class - <strong>5.70 &#xa3;</strong>
                                                          </label>
                                                      </div>
                                                      <div class="checkbox">
                                                          <label>
                                                              <input type="checkbox" class="check"> Package protection- <strong>2.30 &#xa3;</strong>
                                                          </label>
                                                      </div>
                                                      <div class="checkbox">
                                                          <label>
                                                              <input type="checkbox" class="check"> Next Day Delivery - <strong>10 &#xa3;</strong>
                                                          </label>
                                                      </div>
                                                  </form>
                                              </div>
                                          </div>
                                      </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-sm btn-outline-secondary mt-auto" data-bs-dismiss="modal">Go back</button>
                                    <button type="button" class="btn btn-sm btn-outline-secondary mt-auto buy">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-basket" viewBox="0 0 16 16">
                                        <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z"/>
                                      </svg>
                                      Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                  `;
  const div = document.createElement('div');
  div.setAttribute('class', 'col col-lg-3');
  div.innerHTML = bookTpl;
  document.querySelector('#books').appendChild(div);
};

getBooks('game of thrones');

const checkboxesClicker = () => {
  [document.querySelectorAll('*[id^="checkall-"]')].forEach(function (inputs) {
    // console.log(inputs);
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (input.closest('.modal-body').querySelector('.not-available')) {
        // console.log('no book');
        input
          .closest('.modal-body')
          .querySelector('.container.shipping')
          .classList.add('hidden');
      }
      input.addEventListener('click', function () {
        // console.log(this, 'click');
        if (this.checked === false) {
          this.value = 'Uncheck All';
          this.checked = true;
        } else {
          this.value = 'Check All';
          this.checked = false;
        }
        const checkboxesList =
          this.parentNode.parentNode.querySelectorAll('.check');
        // console.log(checks);
        for (let x = 0; x < checkboxesList.length; x++) {
          const singleCheck = checkboxesList[x];
          // console.log(this);
          if (this.checked === true) {
            singleCheck.checked = true;
          } else {
            singleCheck.checked = false;
          }
        }
      });
    }
  });
};

const checkboxesActivator = () => {
  checkElement('.checkall').then(() => {
    // console.log(ele);
    // checkboxes();
    checkboxesClicker();
  });
};
const checkElement = async (ele: any) => {
  while (document.querySelector(ele) === null) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return document.querySelector(ele);
};

checkboxesActivator();
