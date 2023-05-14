 interface Post {
      id: number;
      title: string;
      post: string;
      created_at: string;
      user_deleted: boolean;
      updated_at: string;
  }
  
  type Data = { data: Post[], error?: Error} 

export function merge_sort(arr: Post[]): Post[] {
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
  
        return merge(merge_sort(left), merge_sort(right));
    }
  }
  
 function merge(left: Post[], right: Post[]) {

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

  let unsorted = [
    {   id: 14,
        title: 'Saturday',
        post: 'I will be with the dogs.',
        created_at: '2023-04-30T01:45:19.000Z',
        user_deleted: false,
        updated_at: '2023-05-08T05:54:19.000Z'},
    {   id: 14,
        title: 'Wednesday',
        post: 'I will be with the dogs.',
        created_at: '2023-04-30T01:45:19.000Z',
        user_deleted: false,
        updated_at: '2023-05-08T05:54:19.000Z'},

    {   id: 14,
        title: 'Monday',
        post: 'I will be with the dogs.',
        created_at: '2023-04-30T01:45:19.000Z',
        user_deleted: false,
        updated_at: '2023-05-08T05:54:19.000Z'},
    {   id: 14,
            title: 'Saturday',
            post: 'I will be with the dogs.',
            created_at: '2023-04-30T01:45:19.000Z',
            user_deleted: false,
            updated_at: '2023-05-08T05:54:19.000Z'},

  ]

  let dataarray: Post[] = [
    {
      id: 4,
      title: 'Saturday',
      post: 'I will be with the dogs.',
      created_at: '2023-04-30T01:25:29.000Z',
      user_deleted: true,
      updated_at: '2023-05-08T05:54:19.000Z'
    },
    {
      id: 14,
      title: 'Saturday',
      post: 'I will be with the dogs.',
      created_at: '2023-04-30T01:45:19.000Z',
      user_deleted: false,
      updated_at: '2023-05-08T05:54:19.000Z'
    },
    {
      id: 24,
      title: 'test',
      post: 'testing',
      created_at: '2023-05-01T20:59:20.000Z',
      user_deleted: true,
      updated_at: '2023-05-08T05:54:19.000Z'
    },
    {
      id: 34,
      title: 'test',
      post: 'test',
      created_at: '2023-05-01T21:22:12.000Z',
      user_deleted: true,
      updated_at: '2023-05-08T05:54:19.000Z'
    },
    {
      id: 44,
      title: 'best',
      post: 'rest',
      created_at: '2023-05-01T21:23:55.000Z',
      user_deleted: false,
      updated_at: '2023-05-08T05:54:19.000Z'
    },
    {
      id: 54,
      title: 'must',
      post: 'have \n',
      created_at: '2023-05-01T21:28:30.000Z',
      user_deleted: true,
      updated_at: '2023-05-08T05:54:19.000Z'
    },
    {
      id: 64,
      title: 'asdf',
      post: 'sdf',
      created_at: '2023-05-01T21:33:00.000Z',
      user_deleted: true,
      updated_at: '2023-05-08T05:54:19.000Z'
    },
    {
      id: 74,
      title: 'sdf',
      post: 'fff',
      created_at: '2023-05-01T21:34:14.000Z',
      user_deleted: true,
      updated_at: '2023-05-08T05:54:19.000Z'
    },
    {
      id: 84,
      title: 'mustard',
      post: 'trails',
      created_at: '2023-05-01T21:36:30.000Z',
      user_deleted: false,
      updated_at: '2023-05-08T05:54:19.000Z'
    },
    {
      id: 94,
      title: 'best',
      post: 'quiche ever!',
      created_at: '2023-05-01T22:12:33.000Z',
      user_deleted: true,
      updated_at: '2023-05-08T05:54:19.000Z'
    },
    {
      id: 524,
      title: 'best',
      post: 'next',
      created_at: '2023-05-02T10:28:29.000Z',
      user_deleted: true,
      updated_at: '2023-05-08T05:54:19.000Z'
    },
    {
      id: 534,
      title: 'Till Tuesday',
      post: 'Another week of fun and games',
      created_at: '2023-05-02T21:55:39.000Z',
      user_deleted: true,
      updated_at: '2023-05-08T05:54:19.000Z'
    },
    {
      id: 544,
      title: 'Bitcoin node launched',
      post: 'on the Linux box',
      created_at: '2023-05-08T05:27:10.000Z',
      user_deleted: true,
      updated_at: '2023-05-08T05:54:19.000Z'
    },
    {
      id: 554,
      title: 'test',
      post: 'test',
      created_at: '2023-05-08T06:12:52.000Z',
      user_deleted: true,
      updated_at: '2023-05-08T06:12:52.000Z'
    },
    {
      id: 564,
      title: 'Imagine',
      post: 'All the people',
      created_at: '2023-05-08T21:55:34.000Z',
      user_deleted: true,
      updated_at: '2023-05-08T21:55:34.000Z'
    }
  ]
  

  let sorted = merge_sort(unsorted);


