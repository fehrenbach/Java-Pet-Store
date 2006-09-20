<%-- Copyright 2005 Sun Microsystems, Inc.  All rights reserved.  You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: 
 http://developer.sun.com/berkeley_license.html
 $Id: item.jsp,v 1.1 2006-09-20 21:33:22 inder Exp $ --%>
<html>
    <head>
        <title>Petstore Catalog Client</title>
    </head>

    <body>    

        <%@ page import="java.util.*,java.text.*,com.sun.javaee.blueprints.petstore.model.*" %>
        <%! Vector items;
            Item_1 item;%>
        
        <h2>Catalog Browser - Items
        </h2>
     
   
   <%          
      items = (Vector)request.getAttribute("result");  
      for(int i=0; i<items.size();++i){    
      item = (Item_1) items.get(i);
   %>                  
        <table>
            <tr>
                <td colspan="2"><b>Name: <%=item.getName() %></b>

                </td>
            </tr>   
            <tr>
                <td colspan="2"><b> Price: <%=item.getListPrice() %></b>

                </td>
            </tr>   
            <tr>
                <td colspan="2"><b>Description: <%=item.getDescription() %></b>

                </td>
            </tr>   
             
        </table>
     <% } %>  
    </body>
</html>