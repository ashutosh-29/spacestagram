let body=document.querySelector('body');
let pageContent=document.querySelector('.pageContent');

function parseDate(date){
    var dd = parseInt(String(date.getDate()).padStart(2, '0'));
    var mm = parseInt(String(date.getMonth() + 1).padStart(2, '0')); 
    var yyyy = date.getFullYear();
    date = yyyy + '-' + mm + '-' + dd ;
    return date;
}

var endDate = new Date();
var endDateText=endDate.toString().substring(3,15);

var startDate = new Date(Date.now() - 5*(864e5))
var startDateText=startDate.toString().substring(3,15);

endDate=parseDate(endDate);
startDate=parseDate(startDate);

var fromTodate = document.createElement("h1");
var headingText = document.createTextNode("From "+startDateText+" to "+endDateText);
fromTodate.style.color="#8946A6";
fromTodate.appendChild(headingText);
pageContent.appendChild(fromTodate);

const url='https://api.nasa.gov/planetary/apod?start_date='+startDate+'&end_date='+endDate+'&thumbs=true&api_key=Q8jm3cdCpZun92OPaOdWn4fxeGRhK4L4Imwv5Yt2';

fetch(url).then((res)=>{
    return res.json();
}).then((datas)=>{
    console.log(datas);
    datas.slice().reverse().forEach(setContent);
});

function setContent(data){
    let myTemplate=document.querySelector('#myTemplate');
    let divContainerTempalte=myTemplate.content.querySelector('.container');

    let divContainer=document.importNode(divContainerTempalte,true);

    let imgContainer=divContainer.querySelector(".img-Container");
    let infoContainer=divContainer.querySelector(".info-Container");

    let likeBtn=infoContainer.querySelector('#likeBtn');
    let copyBtn=infoContainer.querySelector('#copyBtn');

    let liked=false;
    
    if(data.media_type=='video'){
        imgContainer.querySelector('#podImg').src = data.thumbnail_url;
    }
    else{
        imgContainer.querySelector('#podImg').src = data.url;
    }
    
    infoContainer.querySelector('#podTitle').innerText=data.title;

    infoContainer.querySelector('#podDate').innerText = data.date;

    infoContainer.querySelector('#podExplanation').innerText = data.explanation.substring(0,100);

    var lastText = document.createElement("span");
    var text = document.createTextNode(data.explanation.substring(100,120));
    lastText.className = "textToBeBlurred";
    lastText.appendChild(text);
    lastText.innerText+=" ... ";
    infoContainer.querySelector('#podExplanation').appendChild(lastText);
    
    var anchor = document.createElement("a");
    anchor.className="loadMoreBtn";
    anchor.href="#";

    var link = document.createTextNode("Load more");
    anchor.appendChild(link); 

    infoContainer.querySelector('#podExplanation').appendChild(anchor);

    anchor.addEventListener('click',()=>{
        infoContainer.querySelector('#podExplanation').innerText = data.explanation;
    });
    
    
    likeBtn.addEventListener('click',()=>{
        liked=!liked;
        localStorage.setItem(data.date,liked);
        if(liked){
            likeBtn.innerText='Liked';
            likeBtn.style.backgroundColor="#F05454";
            likeBtn.style.color="white";
        }
        else{
            likeBtn.style.backgroundColor="";
            likeBtn.style.color="";
            likeBtn.innerText='Like';
        }
    });
    
    copyBtn.onclick=()=>{
        navigator.clipboard.writeText(data.url);
        var tooltip = infoContainer.querySelector("#myTooltip");
        tooltip.innerHTML = "Copied";
    };
    copyBtn.onmouseout=()=>{
        var tooltip = infoContainer.querySelector("#myTooltip");
        tooltip.innerHTML = "Copy to clipboard";
    };
    pageContent.append(divContainer);
}