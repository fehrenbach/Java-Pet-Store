<%-- Copyright 2005 Sun Microsystems, Inc.  All rights reserved.  You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at: 
 http://developer.sun.com/berkeley_license.html
 $Id: error.jsp,v 1.1 2006-09-20 21:33:22 inder Exp $ --%>
<html>
<head>
<title>Catalog Browser > Error</title>
</head>
<body>
<h2>Error !</h2>
<p>We had problems processing your request.</p>
${requestScope["error_message"]}
<p> <a href="index.do">Go back to sample application home</a> </p>
</body>
</html>
