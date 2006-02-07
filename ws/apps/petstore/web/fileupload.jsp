<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> 
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@taglib prefix="ui" uri="http://java.sun.com/blueprints/ui" %>
<html>
<head>
<title>AJAX FileUpload Page</title>
</head>
<body>
    <h1>AJAX FileUpload Page</h1>

    <f:view>

        <table border="1" colspacing="5" colpadding="5">
            <tr>
                <td>
                    <br>FileUpload Test 
                    <br>This section tests the default scenario.<br>
                    <ui:FileUploadTag id="TestFileuploadForm2" enctype="multipart/form-data">
                        <input type="file" size="40" name="fileToUpload5" id="fileToUploadId"/><br>
                        <input type="submit" name="submit3x" value="Submit"/>
                    </ui:FileUploadTag>
                </td>
            </tr>
        </table>
        
    </f:view>
        
</body>
</html>

