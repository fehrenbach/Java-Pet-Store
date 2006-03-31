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
        <jsp:include page="banner.jsp" />

        <f:view>
    
            <ui:fileUploadTag id="TestFileuploadForm" serverLocationDir="../applications/j2ee-modules/petstore/images" 
                postProcessingMethod="#{FileUploadBean.postProcessingMethod}"
                retMimeType="text/xml" retFunction="testRetFunction" 
                progressBarDivId="progress" progressBarSubmitId="submitx" progressBarSize="40">
                
                <script type="text/javascript">
                    dojo.require("dojo.widget.Wizard");
                </script>
                <div id="wizard1" dojoType="Wizard" style="width: 100px; height: 500px;"
                     nextButtonLabel="next >>" previousButtonLabel="<< previous" >
                    <div dojoType="WizardPane" label="Pet">
                        <h:panelGrid columns="2">
                            <f:facet name="header">
                                <h:outputText value="Information about your pet"/>
                            </f:facet>
                            
                            <h:outputText value="Category"/>
                            <h:selectOneMenu id="product">
                                <f:selectItem itemValue="canine01" itemLabel="canine01"/>
                                <f:selectItem itemValue="canine02" itemLabel="canine02"/>
                                <f:selectItem itemValue="feline01" itemLabel="feline01"/>
                                <f:selectItem itemValue="feline02" itemLabel="feline02"/>
                            </h:selectOneMenu>
                            
                            <h:outputText value="Pet's Name"/>
                            <h:inputText size="20" id="name"></h:inputText>
                            
                            <h:outputText value="Description"/>
                            <ui14:richTextarea id="description"
                                           items="textGroup;|;listGroup;|;colorGroup;"></ui14:richTextarea>                            
                            
                            <h:outputText value="Price"/>
                            <h:inputText size="20" id="price"></h:inputText>
                            
                            <h:outputText value="Image File"/>                 
                            <input type="file" size="20" name="fileToUpload" id="fileToUploadId"/>
                        </h:panelGrid>
                    </div>
                    <div dojoType="WizardPane" label="Your Info" canGoBack="true" doneFunction="done">
                        <h:panelGrid columns="2">
                            <f:facet name="header">
                                <h:outputText value="Information about yourself"/>
                            </f:facet>
                            <h:outputText value="First Name"/>
                            <h:inputText size="20" id="firstName"></h:inputText>
                            <h:outputText value="Last Name"/>
                            <h:inputText size="20" id="lastName"></h:inputText>
                            <h:outputText value="Seller Email"/>
                            <h:inputText size="20" id="email"></h:inputText>
                            <h:outputText value="Street 1"/>
                            <h:inputText size="20" id="street1"></h:inputText>
                            <h:outputText value="Street 2"/>
                            <h:inputText size="20" id="street2"></h:inputText>
                            <h:outputText value="City"/>
                            <h:inputText size="20" id="city"></h:inputText>
                            <h:outputText value="State"/>
                            <h:inputText size="20" id="state"></h:inputText>
                            <h:outputText value="Zip"/>
                            <h:inputText size="20" id="zip"></h:inputText>

                            <h:outputText value="Enter the text as it is shown below\n(case insensitive)"/>
                            <h:outputText />
                            <h:graphicImage id="captchaImg" url="CaptchaServlet"/>
                            <h:inputText id="captcharesponse"></h:inputText>
                          
                            <input type="submit" id="submitx" name="submitx" value="Submit" onclick="storeCookie()"/>
                        </h:panelGrid>
                    </div>
                </div>
                <br><div id="progress"></div><br/>
            </ui:fileUploadTag>        
        </f:view>
        
    </body>
</html>

