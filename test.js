
var data = [{title: 'test1', user_deleted: false}, 
{title: 'test2', user_deleted: false},
{title: 'test3', user_deleted: true},
{title: 'test4', user_deleted: true},
{title: 'test5', user_deleted: false}]

const mainListData = data.filter((post) => post.user_deleted === false);

console.log('Main: ', mainListData);
