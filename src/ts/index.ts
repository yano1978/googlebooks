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
  if (price > 0) {
    return `<strong>Price ${price} &#xa3;</strong><br>Sign in to apply a first buy coupon discount of 20%`;
  } else {
    return `We are sorry, this book is not currently available`;
  }
};

const displayBook = (book: Book, count: number) => {
  const bookTpl = `<div class="card shadow-sm">
                      <img src="${book.thumbnail}" 
                      title="${book.title}" alt="${book.title}" />
                      <div class="card-body d-flex flex-column">
                          <h6 class="card-book">${book.title}</h6>
                          <p class="card-text collapse" id="more-${count}">
                            ${book.description}
                          </p>
                          <div class="card-footer-wrapper d-flex justify-content-between align-items-center">
                              <div class="btn-group">
                                  <a class="btn btn-sm btn-outline-secondary mt-auto" data-bs-toggle="collapse" href="#more-${count}" role="button" aria-expanded="false" aria-controls="#more-${count}">
                                    Read
                                  </a>
                                  <button type="button" class="btn btn-sm btn-outline-secondary mt-auto" data-bs-toggle="modal" data-bs-target="#buy-book-${count}">
                                    Buy
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
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-sm btn-outline-secondary mt-auto" data-bs-dismiss="modal">Go back</button>
                                    <button type="button" class="btn btn-sm btn-outline-secondary mt-auto">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-basket" viewBox="0 0 16 16">
                                        <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z"/>
                                      </svg>
                                      Add to cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                  `;
  const div = document.createElement('div');
  div.setAttribute('class', 'col');
  div.innerHTML = bookTpl;
  document.querySelector('#books').appendChild(div);
};

getBooks('game of thrones');
