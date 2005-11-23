<%-- Copyright 2005 Sun Microsystems, Inc.  All rights reserved.  You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: 
 http://developer.sun.com/berkeley_license.html
 $Id: index.jsp,v 1.1 2005-11-23 21:10:41 smitha Exp $ --%>
<html>
    <head>
        <title>Petstore Catalog Client</title>
    </head>

    <body>
        <h2>Catalog Browser
        </h2>
     
        
        <form name="getCategories" action="getcategories.do" method="GET">
            <table>
  <input type="hidden" name="action" value="getcategories"/>
        
     <tr>
                    <td>
                        <input type="submit" value="View Categories">
                    </td>
                </tr>       
            </table>
        </form>
  
    </body>
</html>