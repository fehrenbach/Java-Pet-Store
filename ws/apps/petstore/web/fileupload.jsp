<%-- Copyright 2006 Sun Microsystems, Inc. All rights reserved. You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: http://developer.sun.com/berkeley_license.html
$Id: fileupload.jsp,v 1.43 2006-09-20 22:42:11 yutayoshida Exp $ --%>

<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@page import="com.sun.javaee.blueprints.petstore.util.PetstoreConstants"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> 
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@taglib prefix="ui" uri="http://java.sun.com/blueprints/ui" %>
<%@taglib prefix="ui14" uri="http://java.sun.com/blueprints/ui/14" %>

<html>
    <head>
        <title>Petstore Seller page</title>
        
<script type="text/javascript">
    var doneButton = null;
    
    function testRetFunction(type, data, evt){
        var statusServlet = "http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.servletContext.contextPath}/FileUploadResponseServlet";
        //because of iframeIO problem, initiate another ajax request to get the real response
        var bindArgs = {
            url: statusServlet,
            mimeType: "text/json",
            handle: function (type, json, http) {
                processFUResponse(type, json, http);
                }
         };
         dojo.io.bind(bindArgs);
         
        /***
        // handle successful response here
        var resultx = data.getElementsByTagName("response")[0];
        var message;
        var thumbpath;
        if(resultx) {
            message = resultx.getElementsByTagName("message")[0].childNodes[0].nodeValue;
            thumbpath = resultx.getElementsByTagName("thumbnail")[0].childNodes[0].nodeValue;
        } else {
            // resultx is not set for IE, could be some problem in dojo.iframe, node upload
            var name = document.getElementById("TestFileuploadForm:name").value;
            var firstName = document.getElementById("TestFileuploadForm:firstName").value;
            thumbpath = "";
            message = firstName + ", Thank you for submitting your pet " + name;
        }
        location.href="fileuploadstatus.jsp?message=" + message + "&thumb=" + thumbpath;
        ***/
    }
    
    function processFUResponse(type, json, http) {
        if (typeof json == "string") {
            // in case json is not an object
            json = eval('(' + json + ')');
        }
        var message = json.message;
        var thumbpath = json.thumbnail;
        var productId = json.productid;
        var itemid = json.itemid;
        if (http.status == 401) {
            // captcha error
            //doneButton.disabled = false;
            alert("Authorization faild : please enter the correct captcha string");
        } else if (http.status == 500) {
            //doneButton.disabled = false;
            alert("Persistence failed : please check if the address is valid");
        } else {
            // fileupload complete
            var thumbpath = json.thumbnail;
            location.href="fileuploadstatus.jsp?message=" + message + "&id=" + itemid + "&productId=" + productId + "&thumb=" + thumbpath;
        }
    }

   function storeCookie() {
       currentcap = "j_captcha_response="+document.getElementById("TestFileuploadForm:captcharesponse").value;
       document.cookie = currentcap;
   }
   
   function extractCity(citystatezip) {
       var index = citystatezip.indexOf(',');
       var nextcity = citystatezip.substring(0, index+4);
       return nextcity; 
   }

   function chooseCity(city) {
       var index = city.indexOf(',');
       var state = city.substring(index+2, index+4);
       var zip = city.substring(index+5);
       city = city.substring(0, index);
       
       document.getElementById('TestFileuploadForm:cityField').value = city;
       document.getElementById('TestFileuploadForm:stateField').value = state;
       document.getElementById('TestFileuploadForm:zipField').value = zip;
   }
   
   function fileuploadOnsubmit() {
       //doneButton = this.parent.doneButton;
       //doneButton.disabled = true;
       storeCookie()
       document.forms['TestFileuploadForm'].onsubmit();
   }
   
   function showFU() {
       document.getElementById("fucomponent").style.visibility = "visible";
   }
   
   function switchPanes(fromDivId, toDivId) {
        // show pane
        var divx=document.getElementById(fromDivId);
        divx.style.visibility='hidden';
        divx=document.getElementById(toDivId);
        divx.style.visibility='visible';
   }
</script>
<style>
span.button {    
    background-color: #6699CC; 
    color: white; 
    cursor:pointer;
    border: thin outset black;
    padding: 1px 5px;
}
div.pane {
    width: 90%; 
    background-color: #EEEEEE;
    border: thin double blue;
    padding: .5cm;
    font: 12px arial;
}

</style>
    </head>
    <body onload="showFU()">
        <jsp:include page="banner.jsp"/>
        <br/>
        <div id="fucomponent" style="visibility:hidden;">
        <f:view>
    
            <ui:fileUploadTag id="TestFileuploadForm" serverLocationDir="#{FileUploadBean.uploadImageDirectory}" 
                postProcessingMethod="#{FileUploadBean.postProcessingMethod}"
                retMimeType="text/xml" retFunction="testRetFunction" 
                progressBarDivId="progress" progressBarSize="40">
                <div id="pane2" class="pane" style="visibility: hidden;">
                    <h:panelGrid columns="2" style="width: 80%">
                        <f:facet name="header">
                            <h:outputText value="Information about yourself"/>
                        </f:facet>
                        <h:outputText value="First Name"/>
                        <h:inputText size="20" id="firstName"></h:inputText>
                        <h:outputText value="Last Name"/>
                        <h:inputText size="20" id="lastName"></h:inputText>
                        <h:outputText value="Seller Email"/>
                        <h:inputText size="20" id="email"></h:inputText>
                        <h:outputText value="Street"/>
                        <h:inputText size="20" id="street1"></h:inputText>
                        <h:outputText value="City"/>
                        <ui14:autoComplete size="20" maxlength="100" id="cityField"
                        completionMethod="#{AutocompleteBean.completeCity}"
                        value="#{AddressBean.city}" required="true"
                        ondisplay="function(item) { return extractCity(item); }"
                        onchoose="function(item) { return chooseCity(item); }" />
                        <h:outputText value="State"/>
                        <ui14:autoComplete size="2"  maxlength="100" id="stateField" 
                        completionMethod="#{AutocompleteBean.completeState}" 
                        value="#{AddressBean.state}" required="true" />
                        <h:outputText value="Zip"/>
                        <h:inputText size="5" id="zipField" value="#{AddressBean.zip}" required="true" />

                        <h:outputText value="Enter the text as it is shown below (case insensitive)"/>
                        <h:outputText />
                        <h:graphicImage id="captchaImg" url="CaptchaServlet"/>
                        <h:inputText id="captcharesponse"></h:inputText>
                        <br/><span class="button" onclick="switchPanes('pane2', 'pane1');">&lt;&lt; Previous</span>
                        &nbsp;&nbsp;&nbsp;<span class="button" onclick="fileuploadOnsubmit()">Submit</span>
                        <br/><div id="progress"></div><br/>

                    </h:panelGrid>
                </div>
                <div class="pane"style="position:absolute; top:125px;" id="pane1">
                    <h:panelGrid columns="2" style="width: 80%">
                        <f:facet name="header">
                            <h:outputText value="Information about your pet"/>
                        </f:facet>

                        <h:outputText value="Category"/>
                        <h:selectOneMenu id="product">
                            <f:selectItems value="#{FileUploadBean.products}"/>
                        </h:selectOneMenu>

                        <h:outputText value="Pet's Name"/>
                        <h:inputText size="20" id="name"></h:inputText>

                        <h:outputText value="Description"/>
                        <h:inputTextarea id="description" cols="20" rows="5"></h:inputTextarea>
                        <%--
                        <ui14:richTextarea id="description"
                                       items="textGroup;|;listGroup;|;colorGroup;"></ui14:richTextarea>   
                         --%>

                        <h:outputText value="Price"/>
                        <h:inputText size="20" id="price"></h:inputText>

                        <h:outputText value="Image File"/>                 
                        <input type="file" size="20" name="fileToUpload" id="fileToUploadId"/>

                        <h:outputText value="Custom Tag Keywords (seperated by spaces)"/>
                        <h:inputText size="20" id="tags"></h:inputText>
                    </h:panelGrid>
                    <br/><span class="button" onclick="switchPanes('pane1', 'pane2');">Next &gt;&gt;</span>
                </div>
            </ui:fileUploadTag>        
        </f:view>
        </div>
 
    <jsp:include page="footer.jsp" />    
    </body>
</html>

