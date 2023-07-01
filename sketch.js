function createGrid(){
    vis = [];
    $('#container').width(960);
    $('#container').height(640);

    for(var row = 0; row < rows; row++) {
        var temp = []
        for(var col = 0; col < cols; col++) temp.push(false);
        vis.push(temp);
    }
    for(var row = 0; row < rows; row++) for(var col = 0; col < cols; col++){
        $('#container').append("<div class ='grid'></div>");
    }
    $(".grid").width(960/cols -2);
    $(".grid").height(640/rows -2);
    maze();
}

function clearGrid(){
    $(".grid").remove()
}

function refreshGrid(){
    rows = prompt("How many rows?");
    cols = prompt("How many cols?");
    clearGrid();
    createGrid();
}

function getRGB(deg){
    // Normalize hue to the range [0, 360)
    h = Math.min(Math.round(deg), 359);
    s = 1;
    i = 0.5;
  
    const chroma = (1 - Math.abs(2 * i - 1)) * s;
    const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = i - chroma / 2;
    console.log(chroma, x, m);
    let rgb;
    if (h < 60) rgb = [chroma, x, 0];
    else if (h < 120) rgb = [x, chroma, 0];
    else if (h < 180) rgb = [0, chroma, x];
    else if (h < 240) rgb = [0, x, chroma];
    else if (h < 300) rgb = [x, 0, chroma];
    else rgb = [chroma, 0, x];

    return [
    Math.round((rgb[0] + m) * 255),
    Math.round((rgb[1] + m) * 255),
    Math.round((rgb[2] + m) * 255)
    ];
      
}

var dx = [0, 0, 1, -1];
var dy = [1, -1, 0, 0];
var vis = []
var tomaze = Math.round(5000/(rows*cols));
var toblank = 5;
var gray = "#ffffff"
var rows = 32, cols = 32;

function getRandomOrder(){
    var s = [0, 1, 2, 3];
    var t = [];
    for(var i = 0; i < 4; i++){
        var temp = Math.floor(Math.random()*s.length);
        temp = Math.min(temp, s.length-1);
        t.push(s[temp]);
        s = s.slice(0, temp).concat(s.slice(temp+1));
    }
    //console.log(t);
    return t;
}

function check(nx, ny){return nx > -1 && ny > -1 && nx < rows && ny < cols && !vis[nx][ny];}

function dfs(x, y, len){
    vis[x][y] = true;
    var order = getRandomOrder();
    for(var i = 0; i < 4; i++){
        var nx = x + dx[order[i]];
        var ny = y + dy[order[i]];
        if(!check(nx, ny)) continue;
        path.push([nx, ny, x, y, order[i], len]);
        dfs(nx, ny, len+1);
    }
}

path = []
function maze(){
    path = [];
    dfs(0, 0, 0);
    let i = 0;
    function loop(){
        //console.log(path[i]);
        let cell = $("#container").children()[cols*path[i][0] + path[i][1]];
        let source = $("#container").children()[cols*path[i][2] + path[i][3]];

        //update color
        deg = path[i][5]/(rows*cols)*360;
        colors = getRGB(deg);
        $(cell).css({
            "background-color": "rgb(" + colors[0] + ',' + colors[1] + ',' + colors[2] + ')',
            "border-radius": "5px",
            "box-shadow": "inset 1px 1px 1px rgba(255,255,255,0.5), inset -1px -1px 1px rgba(0,0,0,0.5)"
        });

        //update border
        var idx = path[i][4];
        if(idx == 0){
            $(source).css('border-right-color', gray);
            $(cell).css('border-left-color', gray);
        }else if(idx==1){
            $(source).css('border-left-color', gray);
            $(cell).css('border-right-color', gray);
        }else if(idx==2){
            $(source).css('border-bottom-color', gray);
            $(cell).css('border-top-color', gray);
        }else{
            $(source).css('border-top-color', gray);
            $(cell).css('border-bottom-color', gray);
        }

        i++;
        if(i<path.length) setTimeout(loop, tomaze);
        else blank();
    }
    loop();
}

function blank(){
    for(var i = 0; i < rows; i++) for(var j = 0; j < cols; j++) vis[i][j] = false;
    var cells = [[Math.round(rows/4), Math.round(cols/4)], [Math.round(3*rows/4), Math.round(3*cols/4)]];

    function bfs(){
        if(cells.length==0) return;
        var temp = cells.shift();
        if(vis[temp[0]][temp[1]]) {bfs(); return;}

        vis[temp[0]][temp[1]] = true;
        let cell = $("#container").children()[cols*temp[0] + temp[1]];
        $(cell).css({
            "background-color": gray,
            "box-shadow": "none",
            "border-radius": "0px"
        });
        
        for(let i = 0; i < 4; i++){
            var nx = temp[0]+dx[i];
            var ny = temp[1]+dy[i];
            if(!check(nx, ny)) continue;
            cells.push([nx, ny]);
        }
        setTimeout(bfs, toblank);
    }

    bfs();
}

///////////////////////////////////////
///// Starting execution here
//////////////////////////////////////

$(document).ready(function(){
    createGrid(rows, cols);
    $(".newGrid").click(function(){
        refreshGrid();
    });
});