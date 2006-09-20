<%-- Copyright 2005 Sun Microsystems, Inc.  All rights reserved.  You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: 
 http://developer.sun.com/berkeley_license.html
 $Id: product.jsp,v 1.1 2006-09-20 21:33:22 inder Exp $ --%>
<html>
    <head>
        <title>Petstore Catalog Client</title>
    </head>

    <body>    

        <%@ page import="java.util.*,java.text.*,com.sun.javaee.blueprints.petstore.model.*" %>
        <%! Vector products;
            Product_1 prod;%>
        
        <h2>Catalog Browser - Products
        </h2>
     
   
   <%          
      products = (Vector)request.getAttribute("result");  
      for(int i=0; i<products.size();++i){    
      prod = (Product_1) products.get(i);
   %>    
           
        <form name="getItems" action="getitems.do" method="GET">
            <table>
                <input type="hidden" name="action" value="getitems"/> 
                <input type="hidden" name="prod_id" value= <%=prod.getProductID() %> >
                <tr>
                    <td colspan="2"><b><%=prod.getName() %></b>

                    </td>
                </tr>   
                <tr>
                    <td>
                        <input type="submit" value="View Items">
                    </td>
                </tr> 
            </table>
        </form>
     <% } %>  
    </body>
</html>