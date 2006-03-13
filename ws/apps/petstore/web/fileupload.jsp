<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> 
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@taglib prefix="ui" uri="http://java.sun.com/blueprints/ui" %>
<%@taglib prefix="ui14" uri="http://java.sun.com/blueprints/ui/14" %>

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
       currentcap = "j_captcha_response="+document.getElementById("TestFileuploadForm:captcharesponse").value;
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
                        <td> <h:selectOneMenu id="product">
                            <f:selectItem itemValue="canine01" itemLabel="canine01"/>
                            <f:selectItem itemValue="canine02" itemLabel="canine02"/>
                            <f:selectItem itemValue="feline01" itemLabel="feline01"/>
                            <f:selectItem itemValue="feline02" itemLabel="feline02"/>
                        </h:selectOneMenu>  
                        </td>
                    </tr>
                    <tr>
                        <td><b>Name :</b></td>
                        <td> <h:inputText size="20" id="name"></h:inputText>
                        </td>
                    </tr>
                    <tr>
                        <td><b>Description</b></td>
                        <td>
                            <ui14:richTextarea id="description" items="textGroup;|;listGroup;|;colorGroup;"></ui14:richTextarea>
                        </td>
                    </tr>
                    <tr>
                        <td><b>Unit Cost :</b></td>
                        <td><h:inputText size="20" id="unitCost"></h:inputText>
                        </td>
                    </tr>
                    <tr>
                        <td><b>List Price :</b></td>
                        <td> <h:inputText size="20" id="listPrice"></h:inputText>
                        </td>
                    </tr>
                    <tr>
                        <td><b>Image File :</b></td>                 
                        <td><input type="file" size="20" name="fileToUpload" id="fileToUploadId"/>
                        </td>
                    </tr>
                    <tr>
                        <td><b>Seller Email :</b></td>               
                        <td><h:inputText size="20" id="email"></h:inputText>
                        </td>
                    </tr>
                    
                    <tr>
                        <td><b>Enter the text as it is shown below(case insensitive):</b></td>
                    </tr>
                    <tr>
                        <td><h:graphicImage id="captchaImg" url="CaptchaServlet"/></td>
                        <td><h:inputText id="captcharesponse"></h:inputText></td>
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

