var apiclient = (function(){
	var mockdata = [];
    return {
        getBlueprintsByAuthor: function(author, callback) {
        	$.get({
        		url:"http://localhost:8080/blueprints/"+author,
        		success:function(data){
        			callback(null, data);
        		}
        	});
        },
        getBlueprintsByNameAndAuthor: function(name, author, callback) {
            $.get({
            	url:"http://localhost:8080/blueprints/"+author+"/"+name,
            	success:function(data){
            		callback(null, data);
            	}
            });
        }
    }
})();