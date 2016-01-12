function toFirstLetterUpperCase(str){
	var letter = str.charAt(0);
	return str.replace(letter, letter.toUpperCase());
}

function createAction(conf){
	var type = conf.type;
	var asyncChildren = [];
	var fn;

	if(conf.children){
		asyncChildren = conf.children;
	}else if(conf.asyncResult){
		asyncChildren = ['success', 'error'];
	}

	if(!conf.sync){  // 异步操作
		var cbk;
		fn = function (param) {
			// var that = this;			
			return function (dispatch, getState) {
				asyncChildren.forEach(function(child){
					fn[child] = function(data){
						dispatch({
							type: type + toFirstLetterUpperCase(child),
							payload: data
						});
					};
				});

				if(cbk){
					cbk(param);
				}
				dispatch({type: type, payload: param});
			};
		};
		fn.listen = function(callback){
			cbk = callback;
		};

	}else{ // 同步操作
		fn = function (param) {
			return {type: type, payload: param};
		};
	}

	return fn;
};

function createActions(options){
	return Object.keys(options).reduce(function(pre, next){
		var conf = Object.assign({}, options[next], {type: next});
		pre[next] = createAction(conf);
		return pre;
	}, {});
};

function createReducer(options){
	var initialState = undefined;

	if(options.getInitialState){
		initialState = options.getInitialState();
	}

	return function (state, action) {
		if(typeof state === 'undefined') state = initialState;

		var type = action.type;
		var fn = options[type];

		if(fn && typeof fn === 'function' ){
			return fn(state, action);
		}else{
			return state;
		}
	};
};

exports.createAction = createAction;
exports.createActions = createActions;
exports.createReducer = createReducer;

//var getReviews = exports.createAction({
//	type: 'getReviews',
//	asyncResult: true
//});
//
//getReviews.listen(function(options){
//
//	Request({
//		type: 'GET',
//		url: '/test',
//		success: getReviews.success,
//		error: this.error
//	});
//});
//
//var reducers = exports.createReducer({
//
//	getInitialState: function(){
//		return {
//			status: '',
//			payload: {}
//		};
//	},
//
//	getReviews: function(){
//
//	},
//
//	getReviewsSuccess: function(){
//
//	},
//
//	getReviewError: function(){
//
//	}
//});


