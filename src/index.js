// Import from assets
import '../assets/js/plugin';
// import '../assets/js/favicons';

// Import with webpack config
import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.min.css';

// Import dependencies
import 'bootstrap';

import { from, filter, map, tap } from 'rxjs';

from([1, 2, 3, 4, 5, 6, 7, 8, 9])
  .pipe(
    filter((number) => number % 2 === 0),
    tap((ele) => console.log('tap: ' + ele)),
    map((number) => number * number)
  )
  .subscribe((ele) => console.log(ele));
