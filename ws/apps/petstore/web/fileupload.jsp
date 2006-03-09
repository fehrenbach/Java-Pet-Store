<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> 
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@taglib prefix="ui" uri="http://java.sun.com/blueprints/ui" %>
<html>
    <head>
        <title>Petstore Seller page</title>
        
<script type="text/javascript">
    
    function testRetFunction(type, data, evt){
        // handle successful response here
        var resultx = data.getElementsByTagName("response")[0];
        if(resultx) {
            // resultx is not set for IE, could be some problem in dojo.iframe, node upload
            alert("Customer AJAX Return Function Call" + '\n' +
                "Message: " + resultx.getElementsByTagName("message")[0].childNodes[0].nodeValue);
        } else {
            alert("Customer AJAX Return Function Call");
        }
    }

   function storeCookie() {
       currentcap = "j_captcha_response="+document.getElementById("captcharesponse").value;
       document.cookie = currentcap;
   }     
    
</script>        
    </head>
    <body>
        <h1>Petstore Seller Page</h1>

        <f:view>
    
            <ui:FileUploadTag id="TestFileuploadForm" serverLocationDir="../applications/j2ee-modules/petstore/images" 
                enctype="multipart/form-data" postProcessingMethod="#{FileUploadBean.postProcessingMethod}"
                retMimeType="text/xml" retFunction="testRetFunction" 
                progressBarDivId="progress" progressBarSubmitId="submitx" progressBarSize="40">
                
                <br>To sell a pet, please enter all the reqired data.<br> 
                <table colspacing="5" colpadding="5">                   
                    <tr>
                        <td><b>Product ID :</b></td>
                        <td> <select name="product">
                            <option> canine01 </option>
                            <option> canine02 </option>
                            <option> feline01 </option>
                            <option> feline02 </option>
                        </select>  
                        </td>
                    </tr>
                    <tr>
                        <td><b>Name :</b></td>
                        <td> <input type="text" size="20" name="name" id="nameId"/>
                        </td>
                    </tr>
                    <tr>
                        <td><b>Description</b></td>
                        <td><input type="text" size="20" name="description" id="descriptionId"/>
                        </td>
                    </tr>
                    <tr>
                        <td><b>Unit Cost :</b></td>
                        <td><input type="text" size="20" name="unitCost" id="unitCostId"/>
                        </td>
                    </tr>
                    <tr>
                        <td><b>List Price :</b></td>
                        <td> <input type="text" size="20" name="listPrice" id="listPriceId"/>                       
                        </td>
                    </tr>
                    <tr>
                        <td><b>Image File :</b></td>                 
                        <td><input type="file" size="20" name="fileToUpload" id="fileToUploadId"/>
                        </td>
                    </tr>
                    <tr>
                        <td><b>Seller Email :</b></td>               
                        <td><input type="text" size="20" name="email" id="emailId"/>
                        </td>
                    </tr>
                    
                    <tr>
                        <td><b>Enter the text as it is shown below(case sensitive):</b></td>
                    </tr>
                    <tr>
                        <td><img src="CaptchaServlet"></td>
                        <td><input type="text" name="j_captcha_response" id="captcharesponse"></td>
                    </tr>
                    
                    <tr>
                        <td colspan="2">
                            <input type="submit" id="submitx" name="submitx" value="Submit" onclick="storeCookie()"/>
                        </td>
                    </tr>
                </table>
                <br><div id="progress"></div><br/>
            </ui:FileUploadTag>        
        </f:view>
        
    </body>
</html>

