var redux = require('redux');
var thunk = require('redux-thunk');
var Util = require('redux-util');

var createStore = redux.applyMiddleware(thunk)(redux.createStore);

var reducers = Util.createReducer({
	getInitialState: function(){
		return {items: [], status: ''};
	},
	addTodo: function(state, action){
		var items = state.items.concat(action.payload);
		return Object.assign({}, state, {
			items: items
		});
	},
	removeTodo: function(state, action){
		var items = state.items.slice();
		items.splice(action.payload, 1);

		return Object.assign({}, state, {
			items: items
		});
	},
	addTodoAsync: function(state, action){
		return Object.assign({}, state, {
			status: 'pending'
		});
	},
	addTodoAsyncSuccess: function(state, action){
		var items = state.items.concat(action.payload);
		return Object.assign({}, state, {
			items: items,
			status: 'success'
		});
	},
	addTodoAsyncError: function(state, action){
		return Object.assign({}, state, {
			status: 'error'
		});
	}
});


var store = createStore(reducers);
store.subscribe(function(){
	console.log(store.getState());
});

// 测试createAction
// var addTodo = Util.createAction({
// 	type: 'addTodo'	
// });
// 
// store.dispatch(addTodo('get up'));
// store.dispatch(addTodo('have breakfast'));

// 测试createActions
// var actions = Util.createActions({
// 	addTodo: {},
// 	removeTodo: {}
// });
// store.dispatch(actions.addTodo('get up'));
// store.dispatch(actions.addTodo('have breakfast'));
// store.dispatch(actions.removeTodo(0));

// var addTodoAsync = Util.createAction({
// 	type: 'addTodoAsync',
// 	asyncResult: true
// });

// addTodoAsync.listen(function(text){
// 	console.log('addTodoAsync is called, text is : ' + text);

// 	setTimeout(function(){
// 		addTodoAsync.success(text);
// 		addTodoAsync.error(text);
// 	}, 1000);
// });

// store.dispatch(addTodoAsync('get up'));

var actions = Util.createActions({
	addTodoAsync: {
		asyncResult: true
	}
});

actions.addTodoAsync.listen(function(text){
	console.log('addTodoAsync is called, text is : ' + text);

	setTimeout(function(){
		actions.addTodoAsync.success(text);
		actions.addTodoAsync.error(text);
	}, 1000);
});

store.dispatch(actions.addTodoAsync('get up'));