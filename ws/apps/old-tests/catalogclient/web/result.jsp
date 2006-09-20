<%-- Copyright 2005 Sun Microsystems, Inc.  All rights reserved.  You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:  http://developer.sun.com/berkeley_license.html $Id: result.jsp,v 1.1 2006-09-20 21:33:22 inder Exp $ --%>
<html>
    <head>  
        <title>Petstore Catalog Client
        </title>
    </head>
    <body>
        <h2>Catalog Browser</h2>  
        <table border="0" cellpadding="5" cellspacing="0">   
            <tr>      <td> Details:</td>  
                <td>        ${requestScope["result"]}      </td> 
            </tr>      <td align="right" colspan="2">      </td>      </tr>  
        </table>  <p> <a href="index.do">Go back to sample application home</a> </p>
    </body>
</html>