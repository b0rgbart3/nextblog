
function merge_sort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    else {
        // find the midpoint
        const midpoint = Math.floor(arr.length / 2);
        // split the array into 2 pieces
        const left = arr.slice(0, midpoint);
        const right= arr.slice(midpoint, arr.length);
  
  
        console.log('LEFT: ', left);
        console.log('RIGHT: ', right);
        // send these two pieces to also be split (recursively)
        // and then get merged (recursively)
        // and return the final completed merged array
  
        return merge(merge_sort(left), merge_sort(right));
    }
  }
  
  function merge(left, right) {
    console.log('About to merge left: ', left,', and right: ', right);
    let merged= [];
  
    while ( left.length || right.length ) {
        // four possibilites:
        // left array is empty
        // right array is empty
        // left is smaller
        // right is smaller
  
        if (left.length == 0){
          const rightShifted = right.shift();
          if (rightShifted)
          {
            merged.push(rightShifted);
          }
        } 
        else {
            if (right.length == 0) {
              const leftShifted = left.shift();
              if (leftShifted) {
                merged.push(leftShifted);
              }
            }
            else {
                if (left[0].title.localeCompare(right[0].title) < 0) {
                  const leftShifted = left.shift();
                  if (leftShifted) {
                    merged.push(leftShifted)
                  }
                }
                else {
                    if (right[0].title.localeCompare(left[0].title) < 0) {
                      const rightShifted = right.shift()
                      if (rightShifted)
                      {
                        merged.push(rightShifted)
                      }
                    }
                }
            }
        }
    }
    console.log('About to return merged array: ', merged);
    return merged;
  }

  let unsorted = [
    { title: 'yellow', otherStuff: 'me'},
    {
        title: 'zukini', otherStuff: 'me'
    },

    {
        title: 'banana', otherStuff: 'me'
    },
    {
        title: 'pear'
    },
    {
        title: 'orange'
    },
    {
        title: 'apple'
    },
    {
        title: 'blueberry'
    },
    {
        title: 'kiki'
    },

  ]

  let sorted = merge_sort(unsorted);

  console.log('UNSORTED: ', unsorted);
  console.log('SORTED:', sorted);