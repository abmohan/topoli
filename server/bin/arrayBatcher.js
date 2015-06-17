const R = require('ramda');

var arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ];

function batcher(remaining, batched, batchSize) {
  console.log(remaining, batched, batchSize);

  if (!remaining) {
    return batched;
  }

  else {
    var new_remaining = remaining.slice(batchSize);
    var new_batched = R.flatten(R.append(remaining.slice(0, batchSize), batched));

    // console.log("**", new_remaining, new_batched);

    return batch(
      new_remaining,
      new_batched,
      batchSize
    );
  }

}


function batch(arr, batchSize) {

  batchSize = batchSize || 2;

  return batcher(arr, [], batchSize);

}


console.log(batch(arr, 2));
console.log(batch(arr, 5));
console.log(batch(arr, 10));
