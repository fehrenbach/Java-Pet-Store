<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> 
<%@taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@taglib prefix="ui" uri="http://java.sun.com/blueprints/ui" %>
<html>
    <head>
        <title>Petstore Seller page</title>
    </head>
    <body>
        <h1>Petstore Seller Page</h1>

        <f:view>
    
            <ui:FileUploadTag id="TestFileuploadForm" serverLocationDir="../applications/j2ee-modules/petstore/images" enctype="multipart/form-data" 
                postProcessingMethod="#{FileUploadBean.postProcessingMethod}">
                <br>To sell a pet, please enter all the reqired data.<br> 
                <table colspacing="5" colpadding="5">
                    <tr>
                        <td><b>Item ID :</b></td>
                        <td><select name="item">
                            <option> pet-030 </option>
                            <option> pet-031 </option>
                            <option> pet-032 </option>
                            <option> pet-033 </option>
                            <option> pet-034 </option>
                            <option> pet-035 </option>
                            <option> pet-036 </option>
                            <option> pet-037 </option>
                            <option> pet-038 </option>
                            <option> pet-039 </option>
                            <option> pet-040 </option>
                            <option> pet-041 </option>
                            <option> pet-042 </option>
                            <option> pet-043 </option>
                            <option> pet-044 </option>
                            <option> pet-045 </option>                                                              
                        </select>  
                        </td>
                    </tr>
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
                        <td colspan="2">
                            <input type="submit" name="submitx" value="Submit"/>
                        </td>
                    </tr>
                </table>
            </ui:FileUploadTag>        
        </f:view>
        
    </body>
</html>

