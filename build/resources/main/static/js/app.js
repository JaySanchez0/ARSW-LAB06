var app = (function(){
	var author = null;
	var li = []
	var api=apiclient;
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
		$("#AuthorName").text(author+"'s blueprints");
		var total = li.reduce(getSum,0);
		$("#result").html("");
		$("#result").append(loadTable(li));
	};
	var loadTable=function(data){
		var tab = $("<table class='table'/>");
		tab.append($("<tr class='row'><td>Name</td><td>points</td><td></td></tr>"));
		data.forEach(function(obj){
			var tr = $("<tr class='row' name='"+obj.nombre+"'></tr>");
			tr.append("<tr class='row'><td>"+obj.nombre+"</td>");
			tr.append("<td>"+obj.numberpoints+"</td>");
			var td = $("<td class='row' />");
			var but = $("<button class='btn btn-primary' name='"+obj.nombre+"'>Open</button>")
			but.click(function(e){
				var dat = $(this).attr("name");
				//console.log(dat+" AUTHOR "+author);
				app.getBlueprintsByNameAndAuthor(author,dat);
			});
			td.append(but);
			tr.append(td);
			tab.append(tr);
		});
		return tab;
	}
	var drawCanvas = function(error,blueprint){
		if(error!=null) return;
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
				console.log(parent);
				console.log(e);
				console.log(">>>>> pos <<<<<<<");
				console.log(e.pageX+" "+e.pageY);
				console.log($(this).offset().left+ " "+ $(this).offset().top);
				console.log(x+" "+y);
				ctx.beginPath();
				ctx.arc(x, y, 5, 0, 2 * Math.PI);
				ctx.fill();
			});
		}
    };
 })();