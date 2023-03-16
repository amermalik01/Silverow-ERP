CrmDocumentsController.$inject = ["$scope", "$filter", "ngTableParams", "$resource", "$timeout", "ngTableDataService","$http","ngDialog","toaster"];

myApp.controller('CrmDocumentsController', CrmDocumentsController);
myApp.controller('CrmDocumentsAddController', CrmDocumentsAddController);


function CrmDocumentsController($scope, $filter, ngParams, $resource, $timeout, ngDataService,$http,ngDialog,toaster, $stateParams) {
    'use strict';
	
	$scope.module_id = 12;
	$scope.filter_id = 114;
	$scope.module_table = 'document';
	$scope.more_fields = 'null';
	$scope.condition = 0;	
	$scope.sendRequest = false;
	
	if($scope.$root.crm_id > 0)
		$scope.postData = {'crm_id':$scope.$root.crm_id,token:$scope.$root.token,more_fields:'module_id*create_date*user_name*path*name'}

	$scope.MainDefer = null;
	$scope.mainParams = null;
	$scope.mainFilter = null;
	$scope.more_fields = 'module_id*create_date*user_name*path*name';	
	
		
	$scope.count = 1;
    var vm = this;
	
    var ApiAjax = $scope.$root.sales+"crm/crm/crm-documents";
    
	$scope.$on("myCrmDocumentsEventReload", function (event, args) {
		$scope.sendRequest = true;
		if(args != undefined){
			if(args[1] != undefined)
				$scope.detail(args[1]);
			
			$scope.postData = {'crm_id':args[0],token:$scope.$root.token,more_fields:'module_id*create_date*user_name*path*name'}
			$scope.$root.crm_id = args[0];
		}
		$scope.count = $scope.count+1;
				
		//var ApiAjax = $resource('api/company/get_listing_ajax/:module_id/:module_table/:filter_id/:more_fields/:condition');
		ngDataService.getDataCustomAjax( $scope.MainDefer, $scope.mainParams, ApiAjax,$scope.mainFilter,$scope,'doreload'+$scope.count ,$scope.postData);
		$scope.table.tableParams5.reload();

    });
	
	$scope.detail = function(id){
		 $timeout(function() {
			if($scope.$root.lblButton == 'Add New'){
				$scope.$root.lblButton = 'Edit';
			}
		}, 100);
		
		$scope.$root.tabHide = 0;
		$scope.$root.$broadcast("openCrmDocumentsFormEvent", {'edit':false,id:id});
	}

	$scope.editForm = function(id){
		$scope.$root.$broadcast("openCrmDocumentsFormEvent", {'edit':true,id:id});
	}
	

	$scope.$watch("MyCustomeFilters", function () {
        if($scope.MyCustomeFilters && $scope.table.tableParams5){
            $scope.table.tableParams5.reload();
        }
    }, true);
	
	 $scope.MyCustomeFilters = {
    }
	
   
    vm.tableParams5 = new ngParams({
        page: 1,            // show first page
        count: $scope.$root.pagination_limit,           // count per page
        filter: {
            name: '',
            age: ''
        }
    }, {
        total: 0,           // length of data
        counts: [],         // hide page counts control

        getData: function($defer, params) {
        	if($scope.$root.crm_id > 0 && $scope.sendRequest == true)
				ngDataService.getDataCustomAjax( $defer, params, ApiAjax,$filter,$scope,'crm_documents',$scope.postData);
			$scope.MainDefer = $defer;
			$scope.mainParams = params;
			$scope.mainFilter = $filter;

        }
    });

    $scope.$data = {};
    $scope.delete = function (id,index,$data) {
    	var delUrl = $scope.$root.sales+"crm/crm/delete-crm-document";
	    ngDialog.openConfirm({
	      template: 'modalDeleteDialogId',
	      className: 'ngdialog-theme-default-custom'
	    }).then(function (value) {
	      $http
			  .post(delUrl, {id:id,'token': $scope.$root.token})
			  .then(function (res) {
					if(res.data.ack == true){
						toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(103));
						 $data.splice(index,1);
					}
					else{
						toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
					}
			  });
	    }, function (reason) {
	      console.log('Modal promise rejected. Reason: ', reason);
		});
	
	};

	$scope.viewFile = function(id){
	 window.open(
	  'api/crm_document_doc_view.php?id='+id,
	  '_blank' // <- This is what makes it open in a new window.
	);
 	}

 	// force download file
	var content = 'file content';
	var blob = new Blob([ content ], { type : '*' });
	$scope.url = (window.URL || window.webkitURL).createObjectURL( blob );

}

function CrmDocumentsAddController($scope, $stateParams, $http, $state,$resource,toaster,sharedProperties, $timeout, Upload, ngDialog){
		$scope.rec = {};
		 $scope.$root.tabHide = 0;
   	    $scope.$root.lblButton = 'Add New';
   	    $scope.arr_folders = {};
		var getFolderUrl = $scope.$root.sales+"crm/crm/folders";
   	    $scope.folder = {};
	    
		$scope.showCrmDocumentListing = function(){
	  	$scope.$root.$broadcast("showCrmDocumentListing");
	  }

	  $scope.showCrmDocumentEditForm = function(){
	  	$scope.check_readonly = false;
	  }

	  $scope.$on("showAddCrmDocumentForm", function () {
		$scope.check_readonly = false;
		$scope.resetForm();
		var getDocUrl = $scope.$root.sales+"crm/crm/get-document-code";
		$http
	      .post(getDocUrl, {is_increment:1,'token':$scope.$root.token})
	      .then(function (res) {
	      			$scope.rec.document_code = '';
					$scope.rec.document_code = res.data.code;
	      });
		
	});

	  $http
	      .post(getFolderUrl, {'token':$scope.$root.token})
	      .then(function (res) {
	        	if(res.data.ack == true){
					$scope.arr_folders = res.data.response;
					$scope.arr_folders.push({'id':'-1','name':'++ Add New ++'});
				}
	      });

     
    /*$scope.select = function(row){

    	$scope.selected.title = row.title;
    	$scope.selected.id = row.id;
    	if($scope.selected.id > 0){
		 	$scope.isSelect = false;
		 }

		 if($scope.selected.id < 0){
		 	$scope.addFolderPopup();
		 }
		 console.log($scope.selected.id);
		 $scope.folder.folder_id = $scope.selected.id;
		 
    }  */


		$scope.$on("openCrmDocumentsFormEvent", function (event, arg) {
			
		$timeout(function() {
			var id = arg.id;
	   		if(arg.edit == false)
	   			$scope.check_readonly = true;
	   		else
	   			$scope.check_readonly = false;
			$scope.$root.$broadcast("showCrmDocumentForm");
			angular.element('.accordion-toggle').trigger('click');
			var getDocUrl = $scope.$root.sales+"crm/crm/get-crm-document-by-id";
			$scope.rec = {};
			$scope.comp_files = [];
			var table = 'document';
			$http
		      .post(getDocUrl, {id:id,'token':$scope.$root.token})
		      .then(function (res) {
		      	if(res.data.ack == true){
				 	$scope.rec = res.data.response;
					$scope.rec.update_id = res.data.response.id;
					$scope.rec.old_file = res.data.response.name;
					$scope.rec.file_size = res.data.response.file_size;
					$.each($scope.arr_folders,function(index, elem){
							if(elem.id == res.data.response.folder_id)
									$scope.rec.folders = elem;
					});

					if(res.data.response.name != ''){
						$scope.comp_files[0] = {file:res.data.response.name};
						$scope.check_files =1;
						$scope.check_file = 0;
					}
				}
			});
		  }, 100);
		
    });
	
	
$scope.resetForm = function(rec){
		$scope.files = [];
		$scope.str_files = [];
		$scope.temp_files = {};
		$scope.comp_files = {};
		$scope.check_file = 0;
		$scope.check_files = 0;

		document.getElementById("uploadCrmDocFile").value = '';
		$scope.rec = {};
		$scope.brands = '';
		/*angular.element("input[type='file']").val(null);*/
		
	}
	
	// force download file
	var content = 'file content';
	var blob = new Blob([ content ], { type : '*' });
	$scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
	
	
$scope.check_file = 0;	
$scope.onFileSelect = function($files) {
	$scope.check_file = 1;
	$scope.files=[];
	$scope.files = $files;
	$scope.str_files = [];
	$scope.temp_files = [];
	$timeout(function(){
		angular.forEach($scope.files,function(file,key){
			$scope.str_files.push({name:file.name,index:key});
			$scope.temp_files.push(file.name);
			 
		});
	/*document.getElementById("uploadCrmDocFile").value = $scope.temp_files; */		
	},100)
 };
 
 $scope.removeFile = function(index){
		$scope.files.splice(index,1);
		$scope.str_files.splice(index,1);
		$scope.temp_files.splice(index,1);
		/*document.getElementById("uploadCrmDocFile").value = $scope.temp_files; */
		if($scope.temp_files.length < 1)
			$scope.check_file = 0;	
	}
	
	
   $scope.rec = {};  
 
 $scope.add = function(rec) {
 	var addUrl = $scope.$root.sales+"crm/crm/add-crm-document";
	 rec.folder_name = 'document';
	 rec.row_id = $scope.$root.crm_id;
	 rec.token = $scope.$root.token;
	 rec.folder_id = $scope.rec.folders.id > 0 ?$scope.rec.folders.id:0;

	

	 if(rec.update_id != undefined)
	 		addUrl = $scope.$root.sales+"crm/crm/update-crm-document";
	 
 
      $scope.upload = Upload.upload({
        url: addUrl,
        method: 'POST', 
        headers: {'header-key': '83c238df1650bccb2d1aa4495723c63f07672ee8'}, 
        withCredentials: true, 
        data: rec,
        file: $scope.files != undefined?$scope.files[0]:'', 
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(res, status, headers, config) {
		 if(res.ack == true || res.edit == true){
				
	  			$scope.$root.lblButton = 'Add New';
				if(rec.update_id > 0)
				 	toaster.pop('success', 'Edit', $scope.$root.getErrorMessageByCode(102));
				else{
				 	toaster.pop('success', 'Info', $scope.$root.getErrorMessageByCode(101));
				 	$scope.$root.$broadcast("showCrmDocumentListing");
				 	$scope.resetForm(rec);
				 }
				 var args = [];
				 args[0] = $scope.$root.crm_id;
				 args[1] = undefined;
				 $scope.$root.$broadcast("myCrmDocumentsEventReload", args);
				 
				 /*$timeout(function() {
					angular.element('.accordion-toggle').trigger('click');
				  }, 100);*/
   		}
		else{
			if(rec.update_id > 0)
				toaster.pop('error', 'Edit', $scope.$root.getErrorMessageByCode(106));
			else
				toaster.pop('error', 'Add', $scope.$root.getErrorMessageByCode(104));
		}
   });
}

$scope.resetForm = function(rec){
		$scope.rec = {};
		angular.element("input[type='file']").val(null);
	}
  
  $scope.closeTab = function(rec){
			  $scope.$root.tabHide = 1;
			  $scope.resetForm(rec);
		   }
  $scope.togleTab = function(rec){
	  			$scope.resetForm(rec);
	  			$scope.$root.lblButton = 'Add New';
				$scope.$root.tabHide = 0;
				 $timeout(function() {
					angular.element('.accordion-toggle').trigger('click');
				  }, 100);
		   }
	  
  $scope.delete = function(id) {
    ngDialog.openConfirm({
      template: 'modalDeleteDialogId',
      className: 'ngdialog-theme-default-custom'
    }).then(function (value) {
      $http
		  .post('api/company/delete', {id:id,table:'document',folder_name:'sales',field_name:'file'})
		  .then(function (res) {
				if(res.data == true){
					/*$scope.$root.tabHide = 1;*/
					$timeout(function() {
						$scope.rec = {};
						angular.element('.accordion-toggle').trigger('click');
					  }, 100);
					toaster.pop('success', 'Deleted', $scope.$root.getErrorMessageByCode(103));
					var args = [];
					args[0] = $scope.$root.crm_id;
					args[1] = undefined;
					$scope.$root.$broadcast("myCrmDocumentsEventReload", args);
				}
				else{
					toaster.pop('error', 'Deleted', $scope.$root.getErrorMessageByCode(108));
				}
		  });
    }, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
 
 };

 $scope.viewFile = function(id){
	 window.open(
	  'api/crm_document_doc_view.php?id='+id,
	  '_blank' // <- This is what makes it open in a new window.
	);
 }

 $scope.addFolderPopup = function(){
 	var id = $scope.rec.folders.id;
 	if(id > 0)
 		return false;

 	 var index = $scope.arr_folders.indexOf('-1');
 	 $scope.arr_folders.splice(index,1);

	 ngDialog.openConfirm({
      template: 'app/views/crm_documents/add_folder.html',
      className: 'ngdialog-theme-default',
	  scope: $scope
    }).then(function (folder) {
    	var foldUrl = $scope.$root.sales+"crm/crm/add-folder"
	folder.token = $scope.$root.token;
	folder.row_id = $scope.$root.crm_id;
	folder.module_id = 19;
	folder.folder_id = folder.folders != undefined?folder.folders.id:0;

	$http
	  .post(foldUrl, folder)
	  .then(function (res1) {
	  	if(res1.data.ack == true){
	  	var getFolderUrl = $scope.$root.sales+"crm/crm/folders";
			$http
		      .post(getFolderUrl, {'all':'1','token':$scope.$root.token})
		      .then(function (res) {
		        	if(res.data.ack == true){
		        		
						$scope.arr_folders = res.data.response;
						$scope.arr_folders.push({'id':'-1','name':'++ Add New ++'});
						$timeout(function() {
						$.each($scope.arr_folders,function(index, elem){
							if(elem.id == res1.data.id){
								$scope.$root.$apply(function(){
									$scope.rec.folders = elem;
									});
								}
						});
						}, 3000);
						}
					});
		      // angular.element("#close-modal").click();

		      }

		     
		      
			});

		}, function (reason) {
      console.log('Modal promise rejected. Reason: ', reason);
    });
}

/*angular.element(document).on('click','.dropdown-title',function(){
      angular.element('.dropdown-content').show();
});

angular.element(document).on('click','.dropdown-content ul li span',function(e){
  e.preventDefault();
      angular.element('.dropdown-content').hide();
});

angular.element(document).on('mousedown',".dropdown-content", function(e) { 
   if( (e.which == 3) ) {
     angular.element('.dropdown-content').hide();
   }
   e.preventDefault();
}).on('contextmenu', function(e){
 e.preventDefault();
});

angular.element(document).mouseup(function (e)
{
    var container = angular.element(".dropdown-content");

    if (!container.is(e.target) 
        && container.has(e.target).length === 0)
    {
        container.hide();
    }
});*/


}




