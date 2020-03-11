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
        },
	
	      deleteCanvas:function(blueprint,callback){
        	var promise = $.ajax({
        		type:"DELETE",
        		url:"/blueprints/"+blueprint.author+"/"+blueprint.name,
        		data:JSON.stringify(blueprint),
        		contentType:"application/json",
        	});
        	promise.then(
        			function(){
        				console.info("OK");
        				callback(blueprint.author);
        			},
        			function(){
        				 console.info("ERROR");
        			}
        	);

        },


        updatePoints:function(blueprint,calback){
        	var promise = $.ajax({
        		type:"PUT",
        		url:"/blueprints/"+blueprint.author+"/"+blueprint.name,
        		data:JSON.stringify(blueprint),
        		contentType:"application/json",
        	});
        	promise.then(
        			function(){
        				apiclient.getBlueprintsByAuthor(blueprint.author,calback);
        			},
        			function(){
        				alert("No fue posible realizar la actualizacion");
        			}
        	);

        },

	addBlueprint:function(blueprint,calback){
        	var promise = $.post({
        		url:"/blueprints",
        		data:JSON.stringify(blueprint),
        		contentType:"application/json"
        	});
        	promise.then(
        		function(){
        			calback(null);
        		},
        		function(){
        			calback("");
        		}
        	);
        }
    }
})();