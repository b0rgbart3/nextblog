
interface Post {
    id: number;
    title: string;
    post: string;
    created_at: string;
    user_deleted: boolean;
    updated_at: string;
}

type Data = { data: Post[], error?: Error} 

export function sortByColumn(arr: Post[], column: string, direction: string): Post[] {

    if (arr.length <= 1) {
  
        return arr;
    }
    else {
  
        // find the midpoint
        const midpoint = Math.floor(arr.length / 2);
        // split the array into 2 pieces
        const left: Post[] = arr.slice(0, midpoint) as Post[];
        const right: Post[] = arr.slice(midpoint, arr.length) as Post[];
  
        // send these two pieces to also be split (recursively)
        // and then get merged (recursively)
        // and return the final completed merged array
  
        return merger(sortByColumn(left, column, direction), sortByColumn(right, column, direction), column, direction);
    }
  }
  
  function isSmaller(left: Post, right: Post, sorter: string, direction: string) {
      //left[0].title.localeCompare(right[0].title
      switch(sorter) {
        case 'title':
          if (direction === 'asc') {
          return left.title.localeCompare(right.title) < 0
          } else {
            return left.title.localeCompare(right.title) > 0
          }
          break;
        case 'date':

          if (direction === 'asc') {
          let leftDate = new Date(left.updated_at);
          let rightDate = new Date(right.updated_at);
  
          return leftDate < rightDate
        } else {
          let leftDate = new Date(left.updated_at);
          let rightDate = new Date(right.updated_at);
      
          return rightDate < leftDate
        }
          break;
        default: break;
      }
  }
  function merger(left: Post[], right: Post[], column: string, direction: string) {
  
     let merged: Post[] = [];
   
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
          
              //left[0].title.localeCompare(right[0].title
                 if (isSmaller(left[0], right[0], column, direction)) {
     
                   const leftShifted = left.shift();
                   if (leftShifted) {
                     merged.push(leftShifted)
                   }
             
                 }
                 else {
                  // right[0].title.localeCompare(left[0].title) < 0
                     if (isSmaller(right[0], left[0], column, direction)) {
                
                       const rightShifted = right.shift()
                       if (rightShifted)
                       {
                         merged.push(rightShifted)
                       }
             
                     }
                     else {
                 
                         const leftShifted = left.shift()
                         if (leftShifted) {
                             merged.push(leftShifted)
                         }
                     }
                 } 
             }
         }
     }
  
     return merged;
   }