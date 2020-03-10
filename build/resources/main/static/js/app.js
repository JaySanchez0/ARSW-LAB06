var app = (function(){
	var author = null;
	var li = []
	var api=apiclient;
	var selectedBlueprint = null;
	var getSum = function(total,i){
		return total+i.numberpoints;
	};
	var getBlueprintsByAuthor = function(error,data){
		var li = data.map(function(x){
			return {nombre:x.name,numberpoints:x.points.length};
		});
		if(error!=null){
			Console.log("unvalid");
			return;
		}
		$("#new").css("display","block");
		$("#AuthorName").text(author+"'s blueprints");
		var total = li.reduce(getSum,0);
		$("#result").html("");
		$("#result").append(loadTable(li));
		
	};
	var loadTable=function(data){
		var tab = $("<table class='table'/>");
		tab.append($("<tr class='row'><td>Name</td><td>points</td><td></td></tr>"));
		var totalPoints = 0;
		data.forEach(function(obj){
			var tr = $("<tr class='row' name='"+obj.nombre+"'></tr>");
			tr.append("<tr class='row'><td>"+obj.nombre+"</td>");
			tr.append("<td>"+obj.numberpoints+"</td>");
			totalPoints+=+obj.numberpoints;
			var td = $("<td class='row' />");
			var but = $("<button class='btn btn-primary' name='"+obj.nombre+"'>Open</button>")
			but.click(function(e){
				var dat = $(this).attr("name");
				$("#buttons").html("");
				app.getBlueprintsByNameAndAuthor(author,dat);
			});
			td.append(but);
			tr.append(td);
			tab.append(tr);
			$("#total").text("Total user points: "+totalPoints);
		});
		return tab;
	}
	var drawCanvas = function(error,blueprint){
		if(error!=null) return;
		selectedBlueprint = blueprint;
		$("#blueprint").text("current blueprint: "+blueprint.name);
		var canvas = document.getElementById("drawer");
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.restore();
		var points =  blueprint.points;
		ctx.moveTo(points[0].x,points[0].y);
		for(var i=1;i<points.length;i++){
			ctx.lineTo(points[i].x,points[i].y);
			ctx.moveTo(points[i].x,points[i].y);
		}
		ctx.stroke();
		var cont = $("#buttons")
		var update = $("<button class='btn btn-success'><i class='material-icons' style='color:white;'>save</i>Update/Save</button>");
		var dele = $("<button class='btn btn-danger'><i class='material-icons' style='color:white;'>delete</i>Delete</button>");
		cont.append(update);
		cont.append(dele);
		update.click(function(){
			app.updatePoints(selectedBlueprint);
		});
		dele.click(function(){
			app.deleteCanvas(selectedBlueprint);
		});
	};
	var create = function(error){
		if(error!=null){
			alert("Error");
			return;
		}
		app.updatePlane(author);
		$("#blueprint").text("current blueprint: "+blueprint.name);
		var cont = $("#buttons")
		var update = $("<button class='btn btn-success'><i class='material-icons' style='color:white;'>save</i>Update/Save</button>");
		var dele = $("<button class='btn btn-danger'><i class='material-icons' style='color:white;'>delete</i>Delete</button>");
		cont.append(update);
		cont.append(dele);
		update.click(function(){
			app.updatePoints(selectedBlueprint);

		});
		dele.click(function(){
			app.deleteCanvas(selectedBlueprint);

		});
	};
    return {
    	updatePlane:function(authorName){
    		app.setName(authorName);
    		//var blueprint = apimock.getBlueprintsByAuthor(authorName,getBlueprintsByAuthor);
    		var blueprint = api.getBlueprintsByAuthor(authorName,getBlueprintsByAuthor);
    	},
		getBlueprintsByNameAndAuthor:function(author,name){
			//apimock.getBlueprintsByNameAndAuthor(name,author,drawCanvas);
			api.getBlueprintsByNameAndAuthor(name,author,drawCanvas);
		},
    	setName:function(name){
    		author=name;
		},
		loadPoints:function(){
			$("#drawer").click(function(e){
				var canvas = document.getElementById("drawer");
				var ctx = canvas.getContext("2d");
        		var x = e.pageX - $(this).offset().left; 
        		var y = e.pageY - $(this).offset().top;
				if(selectedBlueprint.points.length>0){
					ctx.beginPath();
					var xi = selectedBlueprint.points[selectedBlueprint.points.length-1].x
					var yi = selectedBlueprint.points[selectedBlueprint.points.length-1].y
					ctx.moveTo(xi,yi);
					ctx.lineTo(x,y);
					ctx.stroke();
				}
				selectedBlueprint.points.push({"x":x,"y":y});
				//ctx.arc(x, y, 5, 0, 2 * Math.PI);
			});
		},
		updatePoints:function(blueprint){
			api.updatePoints(blueprint,getBlueprintsByAuthor);
		},createBlueprint:function(name){
			selectedBlueprint = {"name":name,"author":author,"points":[]};
			api.addBlueprint(selectedBlueprint,create);
		},
		deleteCanvas:function(blueprint){
			api.deleteCanvas(blueprint,getBlueprintsByAuthor);
			api.updatePoints(blueprint,getBlueprintsByAuthor);

		}
		
    };
 })();