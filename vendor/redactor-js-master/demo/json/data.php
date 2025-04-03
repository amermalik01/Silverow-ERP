[<?php
                //$root = 'http://127.0.0.1:8080/redactor-js-master/demo/json/images/';   
				 $root = $_SERVER['DOCUMENT_ROOT']."/redactor-js-master/demo/json/images/"; 
				$files = scandir($root);
				natcasesort($files); 
				
                if( count($files) > 2 )
				          { 
											$images = scandir($root); 
											foreach($images as $curimg)
									 {  
									 ?>
 
 { "thumb": "json/images/<?php echo $curimg; ?>", "image": "json/images/<?php echo $curimg; ?>", "title": "Image 1", "folder": "Folder 1" },  	
  
<?php 
									}   
                        	}
            ?>]