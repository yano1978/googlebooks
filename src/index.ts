// const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
import 'bootstrap';

import { from, filter, map, tap } from 'rxjs';

from([1, 2, 3, 4, 5, 6, 7, 8, 9])
  .pipe(
    filter((number) => number % 2 === 0),
    tap((ele) => console.log('tap: ' + ele)),
    map((number) => number * number)
  )
  .subscribe((ele) => console.log(ele));

import { Observable } from 'rxjs';
var observable = Observable.create((observer: any) => {
  observer.next('Hello World!');
  observer.next('Hello Again!');
  observer.complete();
  observer.next('Bye');
});
observable.subscribe(
  (x: any) => logItem(x),
  (error: any) => logItem('Error: ' + error),
  () => logItem('Completed')
);
function logItem(val: any) {
  var node = document.createElement('li');
  var textnode = document.createTextNode(val);
  node.appendChild(textnode);
  document.getElementById('list').appendChild(node);
}
