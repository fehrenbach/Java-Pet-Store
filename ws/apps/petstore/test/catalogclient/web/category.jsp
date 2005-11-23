<%-- Copyright 2005 Sun Microsystems, Inc.  All rights reserved.  You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: 
 http://developer.sun.com/berkeley_license.html
 $Id: category.jsp,v 1.1 2005-11-23 21:10:40 smitha Exp $ --%>
<html>
    <head>
        <title>Petstore Catalog Client</title>
    </head>

    <body>
    

        <%@ page import="java.util.*,java.text.*,com.sun.javaee.blueprints.petstore.model.*" %>
        <%! Vector categories;
            Vector cat;%>
        
        <h2>Catalog Browser - Categories
        </h2>
     
   
   <%          
   categories = (Vector)request.getAttribute("result");  
      for(int i=0; i<categories.size();++i){    
      cat = (Vector) categories.get(i);
   %>     
           
        <form name="getProducts" action="getproducts.do" method="GET">
            <table>
                <input type="hidden" name="action" value="getproducts"/> 
                <input type="hidden" name="cat_id" value= <%=cat.get(0) %> >
                <tr>
                    <td colspan="2"><b><%=cat.get(1) %></b>

                    </td>
                </tr>   
                <tr>
                    <td>
                        <input type="submit" value="View Products">
                    </td>
                </tr> 
            </table>
        </form>
     <% } %>  
    </body>
</html>