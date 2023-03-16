

ChatController.$inject = ["$scope", "$stateParams", "ngTableDataService", "$http", "$state", "$resource", "toaster","$filter",  "$window",   "$timeout","$interval","$sce","$rootScope","$compile"];
myApp.controller('ChatController', ChatController);
function ChatController($scope, $stateParams, ngDataService,$http, $state, $resource, toaster, $filter, $window, $timeout,$interval,$sce,$rootScope,$compile) {
 //'use strict';


	 
 $scope.user_admin_data = [];  
 $scope.getadminUser = function () {
          
            var contactData = {token: $rootScope.token};
            var contactPath = $rootScope.com + 'chat/get-admin-user';
           
		   
		    $http.post(contactPath, contactData).then(function (result) {
                $scope.user_admin_data = [];  
				 $scope.user_admin_data = result.data.response;
            });
            
        };
	
	

var user_name =$scope.$root.first_user_name;//$scope.currentUser;
 //console.log(user_name);

 if(user_name!=null) {

var windowFocus = true;
var chatHeartbeatCount = 0;
var minChatHeartbeat = 10;
var maxChatHeartbeat = 15;
var chatHeartbeatTime = minChatHeartbeat;
var originalTitle;
var blinkOrder = 0;

var chatboxFocus = new Array();
var newMessages = new Array();
var newMessagesWin = new Array();
var chatBoxes = new Array();

//var chatboxtitle='';
//var scrollHeight = 10;
var minimizedChatBoxes ='';
var minimize  ='';
var j  ='';
var x  ='';
var width   ='';

angular.element(document).ready(function(){
	originalTitle = document.title;
	 startChatSession();
	
	$([window, document]).blur(function(){
		windowFocus = false;
	}).focus(function(){
		windowFocus = true;
		document.title = originalTitle;
	});
});

 
 
$scope.chatWith = function  (chatuser,val) {
	//console.log(val);
	//console.log(chatuser);
	 //user_name =val;
		
	$scope.createChatBox(chatuser);
	$("#chatbox_"+chatuser+" .chatboxtextarea").focus();
}
 
$scope.createChatBox = function  (chatboxtitle,minimizeChatBox) {

	if ($("#chatbox_"+chatboxtitle).length > 0) {
		if ($("#chatbox_"+chatboxtitle).css('display') == 'none') {
			$("#chatbox_"+chatboxtitle).css('display','block');
			$scope.restructureChatBoxes();
		}
		$("#chatbox_"+chatboxtitle+" .chatboxtextarea").focus();
		return;
	}

	$(" <div />" ).attr("id","chatbox_"+chatboxtitle)
	.addClass("chatbox")
	
	

/* .html('<div class="chatboxhead"><div class="chatboxtitle">'+chatboxtitle+'</div><div class="chatboxoptions"><a href="javascript:void(0)" ng-click=="toggleChatBoxGrowth(\''+chatboxtitle+'\')">-</a> <a href="javascript:void(0)" ng-click="closeChatBox(\''+chatboxtitle+'\')">X</a></div><br clear="all"/></div><div class="chatboxcontent"></div><div class="chatboxinput"><textarea class="chatboxtextarea" onkeydown="javascript:return  checkChatBoxInputKey(event,this,\''+chatboxtitle+'\');"></textarea></div>')
.appendTo($( "body" ));
 */
 
 var $el = angular.element('<div id="chatbox_'+chatboxtitle+'" class="chatbox"> <div class="chatboxhead"><div class="chatboxtitle">'+chatboxtitle+'</div><div class="chatboxoptions"><a href="javascript:void(0)" ng-click="toggleChatBoxGrowth(\''+chatboxtitle+'\')">-</a> <a href="javascript:void(0)" ng-click="closeChatBox(\''+chatboxtitle+'\')">X</a></div><br clear="all"/></div><div class="chatboxcontent"></div><div class="chatboxinput"><textarea  id="chatboxtextarea_'+chatboxtitle+'" class="chatboxtextarea_'+chatboxtitle+'" ng-enter="  checkChatBoxInputKey(event,this,\''+chatboxtitle+'\');"></textarea></div></div>').appendTo(angular.element( "body" ));
    $compile($el)($scope);
	
	
	
	$("#chatbox_"+chatboxtitle).css('bottom', '0px');
	var chatBoxeslength  = 0;

	for (x in chatBoxes) {
		if ($("#chatbox_"+chatBoxes[x]).css('display') != 'none') {
			chatBoxeslength++;
		}
	}

	if (chatBoxeslength == 0) {
		$("#chatbox_"+chatboxtitle).css('right', '20px');
	} else {
		width = (chatBoxeslength)*(225+7)+20;
		$("#chatbox_"+chatboxtitle).css('right', width+'px');
	}
	
	chatBoxes.push(chatboxtitle);

	if (minimizeChatBox == 1) {
		minimizedChatBoxes = new Array();

		if ($.cookie('chatbox_minimized')) {
			minimizedChatBoxes = $.cookie('chatbox_minimized').split(/\|/);
		}
		minimize = 0;
		for (j=0;j<minimizedChatBoxes.length;j++) {
			if (minimizedChatBoxes[j] == chatboxtitle) {
				minimize = 1;
			}
		}

		if (minimize == 1) {
			$('#chatbox_'+chatboxtitle+' .chatboxcontent').css('display','none');
			$('#chatbox_'+chatboxtitle+' .chatboxinput').css('display','none');
		}
	}

	chatboxFocus[chatboxtitle] = false;

	$("#chatbox_"+chatboxtitle+" .chatboxtextarea").blur(function(){
		chatboxFocus[chatboxtitle] = false;
		$("#chatbox_"+chatboxtitle+" .chatboxtextarea").removeClass('chatboxtextareaselected');
	}).focus(function(){
		chatboxFocus[chatboxtitle] = true;
		newMessages[chatboxtitle] = false;
		$('#chatbox_'+chatboxtitle+' .chatboxhead').removeClass('chatboxblink');
		$("#chatbox_"+chatboxtitle+" .chatboxtextarea").addClass('chatboxtextareaselected');
	});

	$("#chatbox_"+chatboxtitle).click(function() {
		if ($('#chatbox_'+chatboxtitle+' .chatboxcontent').css('display') != 'none') {
			$("#chatbox_"+chatboxtitle+" .chatboxtextarea").focus();
		}
	});

	$("#chatbox_"+chatboxtitle).show();
}

/*$interval(function () {
	
 $scope.chatHeartbeat();		
  
}, 60 * 5000); //5 min 60 * 1000
*/

$scope.chatHeartbeat = function (){
//	 console.log($scope.$root.first_user_name);

	var itemsfound = 0;
	
	if (windowFocus == false) {
 
		var blinkNumber = 0;
		var titleChanged = 0;
		for (x in newMessagesWin) {
			if (newMessagesWin[x] == true) {
				++blinkNumber;
				if (blinkNumber >= blinkOrder) {
					document.title = x+' says...';
					titleChanged = 1;
					break;	
				}
			}
		}
		
		if (titleChanged == 0) {
			document.title = originalTitle;
			blinkOrder = 0;
		}
		 else ++blinkOrder;
		

	} 
	else {
		for (x in newMessagesWin) {
			newMessagesWin[x] = false;
		}
	}

	for (x in newMessages) {
		if (newMessages[x] == true) {
			if (chatboxFocus[x] == false) {
				//FIXME: add toggle all or none policy, otherwise it looks funny
				$('#chatbox_'+x+' .chatboxhead').toggleClass('chatboxblink');
			}
		}
	}
	
	
	$.ajax({
		
	  url:   "app/views/chat/chat.php?action=chatheartbeat",
//"api/communication/chat/chatheartbeat",	  //  $rootScope.com + 'chat/chatheartbeat',
	 
		data: 'user_name=' + user_name ,//  $scope.$root.token, // false,
		type: "POST",
	   dataType: "json",
//	   headers : {  'token' :  $scope.$root.token  },
	  cache: false,
	  success: function(data) {

		$.each(data.items, function(i,item){
			if (item)	{ // fix strange ie bug

				chatboxtitle = item.f;

				if ($("#chatbox_"+chatboxtitle).length <= 0) {
					$scope.createChatBox(chatboxtitle);
				}
				if ($("#chatbox_"+chatboxtitle).css('display') == 'none') {
					$("#chatbox_"+chatboxtitle).css('display','block');
					$scope.restructureChatBoxes();
				}
				
				if (item.s == 1) {
					item.f = user_name;
				}

				if (item.s == 2) {
					$("#chatbox_"+chatboxtitle+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxinfo">'+item.m+'</span></div>');
				} else {
					newMessages[chatboxtitle] = true;
					newMessagesWin[chatboxtitle] = true;
					$("#chatbox_"+chatboxtitle+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">'+item.f+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+item.m+'</span></div>');
				}

	$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent"));
	//[0].scrollHeight
				itemsfound += 1;
			}
		});

		chatHeartbeatCount++;

		if (itemsfound > 0) {
			chatHeartbeatTime = minChatHeartbeat;
			chatHeartbeatCount = 1;
		}
		 else if (chatHeartbeatCount >= 5) {
			chatHeartbeatTime *= 2;
			chatHeartbeatCount = 1;
			if (chatHeartbeatTime > maxChatHeartbeat) 	chatHeartbeatTime = maxChatHeartbeat;
		}
		
		
	//$timeout(  $scope.chatHeartbeat();,chatHeartbeatTime);
		 
		 
	}});
	
	
	
		
}



		
$scope.checkChatBoxInputKey = function     (event,chatboxtextarea,chatboxtitle) {

//console.log(user_name);

	// if(events.keyCode == 13 && events.shiftKey == 0)  { 
 		
		 message =	document.getElementById('chatboxtextarea_'+chatboxtitle+'').value ;
		 //$('.chatboxtextarea_'+chatboxtitle+'').value
		 // $('.chatboxtextarea_'+chatboxtitle+'').val();
		 // $(chatboxtextarea).val();
		message = message.replace(/^\s+|\s+$/g,"");
		
		//$(chatboxtextarea).val('');
		document.getElementById('chatboxtextarea_'+chatboxtitle+'').value="";
		 $('chatboxtextarea_'+chatboxtitle+'').val('');
	 
	 	$(chatboxtextarea).focus();
		$(chatboxtextarea).css('height','44px');
		
		if (message != '') { 
			 var url ="app/views/chat/chat.php?action=sendchat"   //"api/communication/chat/sendchat";
			$.post(url,  {to: chatboxtitle, message: message,user_name: user_name} , function(data){
						   
				message = message.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
				$("#chatbox_"+chatboxtitle+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">'+user_name+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+message+'</span></div>');
				$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);
			});
		}
		chatHeartbeatTime = minChatHeartbeat;
		chatHeartbeatCount = 1;

		return false;
	//}

	var adjustedHeight = $('.chatboxtextarea').val().clientHeight;
	var maxHeight = 94;

	if (maxHeight > adjustedHeight) {
		adjustedHeight = Math.max($('.chatboxtextarea').val().scrollHeight, adjustedHeight);
		if (maxHeight)
			adjustedHeight = Math.min(maxHeight, adjustedHeight);
		if (adjustedHeight > $('.chatboxtextarea').val().clientHeight)
			$(chatboxtextarea).css('height',adjustedHeight+8 +'px');
	}
	 else $($('.chatboxtextarea').val()).css('overflow','auto');
	 
	 
}



var ajx_data_with_token =  {token: "anp5ZGVhR3hEY1d6ZFFoWkxpZ0J3QT09.R29qR0U0bzlodEl5U2VtQVk1RkQ3QT09"} ;
//"token=" + 'anp5ZGVhR3hEY1d6ZFFoWkxpZ0J3QT09.R29qR0U0bzlodEl5U2VtQVk1RkQ3QT09';
	
	
function startChatSession  (){  

	$.ajax({
	  url: "app/views/chat/chat.php?action=startchatsession",
	 // "api/communication/chat/startchatsession",
	   data: 'user_name=' + user_name ,//ajx_data_with_token,// $scope.$root.token, // false,
		type: "POST",
	  // headers : {  'token' :  "anp5ZGVhR3hEY1d6ZFFoWkxpZ0J3QT09.R29qR0U0bzlodEl5U2VtQVk1RkQ3QT09"  },
	  cache: false,
	  dataType: "json",
	  success: function(data) {
 
		user_name = data.user_name;

		$.each(data.items, function(i,item){
			if (item)	{ // fix strange ie bug

				chatboxtitle = item.f;

				if ($("#chatbox_"+chatboxtitle).length <= 0) {
					$scope.createChatBox(chatboxtitle,1);
				}
				
				if (item.s == 1) {
					item.f = user_name;
				}

				if (item.s == 2) {
					$("#chatbox_"+chatboxtitle+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxinfo">'+item.m+'</span></div>');
				} else {
					$("#chatbox_"+chatboxtitle+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">'+item.f+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+item.m+'</span></div>');
				}
			}
		});
		
		for (i=0;i<chatBoxes.length;i++) {
			chatboxtitle = chatBoxes[i];
			$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0]);
			$timeout('$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);', 10000); // yet another strange ie bug
		//
		}
	
	$timeout($scope.chatHeartbeat(),chatHeartbeatTime);
		
	}});
	
}


$scope.closeChatBox = function (chatboxtitle) {
	//console.log(chatboxtitle);
	$('#chatbox_'+chatboxtitle).css('display','none');
	$scope.restructureChatBoxes();


 var 	url= "app/views/chat/chat.php?action=closechat";
	$.post(url, { chatbox: chatboxtitle,'user_name' : user_name} , function(data){	
	});

}


$scope.restructureChatBoxes = function  () {
	align = 0;
	for (x in chatBoxes) {
		chatboxtitle = chatBoxes[x];

		if ($("#chatbox_"+chatboxtitle).css('display') != 'none') {
			if (align == 0) {
				$("#chatbox_"+chatboxtitle).css('right', '20px');
			} else {
				width = (align)*(225+7)+20;
				$("#chatbox_"+chatboxtitle).css('right', width+'px');
			}
			align++;
		}
	}
}


$scope.toggleChatBoxGrowth = function    (chatboxtitle) {
	//	console.log(chatboxtitle);
	if ($('#chatbox_'+chatboxtitle+' .chatboxcontent').css('display') == 'none') {  
		
		var minimizedChatBoxes = new Array();
		
		if ($.cookie('chatbox_minimized')) {
			minimizedChatBoxes = $.cookie('chatbox_minimized').split(/\|/);
		}

		var newCookie = '';

		for (i=0;i<minimizedChatBoxes.length;i++) {
			if (minimizedChatBoxes[i] != chatboxtitle) {
				newCookie += chatboxtitle+'|';
			}
		}

		newCookie = newCookie.slice(0, -1)


		$.cookie('chatbox_minimized', newCookie);
		$('#chatbox_'+chatboxtitle+' .chatboxcontent').css('display','block');
		$('#chatbox_'+chatboxtitle+' .chatboxinput').css('display','block');
		$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);
	} else {
		
		var newCookie = chatboxtitle;

		if (angular.element.cookie('chatbox_minimized')) {
			newCookie += '|'+angular.element.cookie('chatbox_minimized');
		}


		angular.element.cookie('chatbox_minimized',newCookie);
		$('#chatbox_'+chatboxtitle+' .chatboxcontent').css('display','none');
		$('#chatbox_'+chatboxtitle+' .chatboxinput').css('display','none');
	}
	
}


 
 
 

/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};


	
 
 }else 	$('.chatbox').css('display','none');
	


 }
 
 
 