/**
 * dialog runner using javascript console
 */
var DialogTreeRunnerConsole	= function(){
	this._dialogTree	= null;
	this._nodesHistory	= [];
}

/**
 * load synchronoulsy the dialogtree from the url
 * @param  {String} url the url for the dialogtree in json
 * @return {DialogTreeRunnerConsole}     for chained API
 */
DialogTreeRunnerConsole.prototype.loadSync = function(url) {
	var request	= new XMLHttpRequest();
	request.open('GET', url, false);
	request.send(); 
	console.assert( request.status === 200 );
	var jsonData	= eval(request.responseText);
	this._dialogTree= DialogTree.fromJSON(jsonData);
	return this;
};

/**
 * Getter for the dialogtree.js
 * @return {DialogTree} current dialog tree
 */
DialogTreeRunnerConsole.prototype.dialogTree = function() {
	return this._dialogTree;
};

/**
 * Display current node
 */
DialogTreeRunnerConsole.prototype.displayNode = function() {
	var node	= this._dialogTree.node();
	var res = '';
	if (node == null){$(".ui-dialog").hide(); return null;}
	res += '</b>"' + node.botText +'"</b><br/><br/>';
	node.answers.forEach(function(answer, answerIdx){
		res += '<u><a href="#" onclick="answer('+answerIdx+')" >- '+ answer.playerText +'</a></u><br/>';
	});
	return res;
};

/**
 * Answer a question
 * @param  {Number} answerIdx the index of the answer in this node
 */
DialogTreeRunnerConsole.prototype.answer = function(answerIdx) {
	var dialogTree	= this._dialogTree;
	this._nodesHistory.push( dialogTree.nodeId() );
	dialogTree.answer(answerIdx);
};
