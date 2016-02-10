"use strict";angular.module("planckApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","duScroll","ui.bootstrap"]),angular.module("planckApp").controller("MainCtrl",["$scope","$document","Data","$uibModal",function(a,b,c,d){function e(){var b,c=Math.floor(window.scrollY/i),d=new Date(1970,0,1).addDays(c>364?364:c),e=Math.floor(window.scrollY/(i/360)),f=0,g=3649930;if(e=e>360?e-360:e,f=Math.round(e/15*60*60*1e3+72e5),window.scrollY>=g){var h=Math.floor(window.scrollY-g);f=h/250*1e3,b=new Date(1970,0,1,23,50,0,f).toString("h:mm"),e=359}else b=new Date(f).toString("h:mm");a.dayNightRotation="rotate("+e+"deg)",a.$apply(function(){a.scrollDate=d.toString("MMMM d ")+b})}a.currentIndex=1,a.scrollDate="January 1 12:00:00",a.scrolling=!1,a.animationDuration=0,a.animationIterationCount=0;var f=6e4,g=60*f,h=24*g,i=1e4;new Date(1970,0,365,23,50).getTime();!function(){c.get(4).then(function(b){a.data=b.data.feed.entry,angular.forEach(a.data,function(b,c){var d=Date.parse(b.gsx$datetime.$t),e=Date.parse(a.data[c-1>=0?c-1:0].gsx$datetime.$t),f=Math.ceil((d-e)/h*i);1===Date.compare(d,Date.parse("December 31 1970 23:50:00"))&&(f=Math.ceil((d-e)/4)),b.gsx$height.$t.length>0&&(f=parseInt(b.gsx$height.$t,10)),b.height=f>0?f+"px":"200px"})})}(),a.date=function(a){var b=Date.parse(a).toString("h:mm:ss");return"12:00:00"!==b?Date.parse(a).toString("MMMM d, h:mm:sstt"):Date.parse(a).toString("MMMM d")+", Midnight"},a.yearsAgo=function(a){return a.gsx$bya.$t.length?a.gsx$bya.$t+" billion":a.gsx$mya.$t.length?a.gsx$mya.$t+" million":a.gsx$kya.$t},a.move=function(c,d){var e=0,f=0;void 0===d?a.currentIndex=a.currentIndex+c<=365&&a.currentIndex+c>0?a.currentIndex+c:a.currentIndex:a.currentIndex=parseInt(d.replace("d-",""),10),e=(a.currentIndex-1)*i,f=Math.abs(b.duScrollTop()-e)/10,b.duScrollTop(e,f,function(a){return a}).then(function(){})},angular.element(window).on("scroll",e),a.open=function(b){var c=d.open({animation:!0,templateUrl:"modal.html",controller:"ModalinstanceCtrl",resolve:{data:function(){return b}}});c.result.then(function(b){a.move(0,b.target)},function(){})}}]),angular.module("planckApp").controller("ModalinstanceCtrl",["$scope","$uibModalInstance","data",function(a,b,c){a.months=[],a.data=c;var d=0;for(d=0;12>d;d+=1)a.months[d]=new Array(new Date(1970,d+1,0).getDate());angular.forEach(a.data,function(b,c){if(b.gsx$datetime.$t.length&&(b.gsx$bya.$t.length||b.gsx$mya.$t.length||b.gsx$kya.$t.length)){var d=Date.parse(b.gsx$datetime.$t),e=d.getMonth(),f=d.getDate();a.months[e][f-1]={"class":"has-event",id:"e-"+c}}}),a.ok=function(a){b.close({target:a.target.id})},a.enumerator=function(a){return new Array(a)},a.getMonthName=function(a){return new Date(1970,a,0).toString("MMMM")},a.setId=function(a,b){var c=new Date(1970,b,a+1),d=new Date(c.getFullYear(),0,0),e=c-d,f=Math.floor(e/864e5);return"d-"+f}}]),angular.module("planckApp").factory("Data",["$http",function(a){var b="1nlXzHEdrWpEusaZgPdgrND5e58DU6fWEAP0T_M0NnhQ";return{get:function(c){return a.get("https://spreadsheets.google.com/feeds/list/"+b+"/"+c+"/public/values?alt=json")}}}]);